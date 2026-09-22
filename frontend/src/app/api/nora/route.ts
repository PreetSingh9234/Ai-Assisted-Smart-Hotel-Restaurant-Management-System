import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getDb } from '@/lib/db';

// ── Gather live restaurant context from DB ─────────────────────────────────
function getLiveContext(): string {
  try {
    const db = getDb();

    // Orders summary
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const activeOrders = db
      .prepare("SELECT COUNT(*) as c FROM orders WHERE status IN ('New','Preparing','Ready')")
      .get() as { c: number };

    const delayedOrders = db
      .prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'Delayed'")
      .get() as { c: number };

    const todayRevenue = db
      .prepare("SELECT COALESCE(SUM(totalAmount),0) as rev FROM orders WHERE createdAt >= ? AND status != 'Cancelled'")
      .get(todayISO) as { rev: number };

    const totalOrders = db
      .prepare("SELECT COUNT(*) as c FROM orders WHERE createdAt >= ?")
      .get(todayISO) as { c: number };

    // Inventory alerts
    const criticalItems = db
      .prepare("SELECT name, quantity, unit, dailyUsage FROM inventory WHERE status = 'Critical'")
      .all() as Array<{ name: string; quantity: number; unit: string; dailyUsage: number }>;

    const lowItems = db
      .prepare("SELECT name, quantity, unit FROM inventory WHERE status = 'Low'")
      .all() as Array<{ name: string; quantity: number; unit: string }>;

    // Top menu items (by name as proxy)
    const menuItems = db
      .prepare('SELECT name, category, price, rating FROM menu_items WHERE available = 1 ORDER BY rating DESC LIMIT 5')
      .all() as Array<{ name: string; category: string; price: number; rating: number }>;

    // Customer segments
    const vipCount = db
      .prepare("SELECT COUNT(*) as c FROM customers WHERE segment = 'VIP'")
      .get() as { c: number };

    const atRiskCount = db
      .prepare("SELECT COUNT(*) as c FROM customers WHERE segment = 'At Risk'")
      .get() as { c: number };

    const totalCustomers = db
      .prepare('SELECT COUNT(*) as c FROM customers')
      .get() as { c: number };

    // Build context string
    const criticalStr = criticalItems.length > 0
      ? criticalItems.map(i => `${i.name} (${i.quantity}${i.unit} left, ${i.dailyUsage}${i.unit}/day usage — ~${(i.quantity / i.dailyUsage).toFixed(1)} days remaining)`).join('; ')
      : 'None';

    const lowStr = lowItems.length > 0
      ? lowItems.map(i => `${i.name} (${i.quantity}${i.unit})`).join('; ')
      : 'None';

    const topMenuStr = menuItems.map(m => `${m.name} (₹${m.price}, ⭐${m.rating})`).join(', ');

    return `
=== LIVE RESTAURANT DATA (as of ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST) ===

📦 ORDERS TODAY:
- Total orders: ${totalOrders.c}
- Active orders (New/Preparing/Ready): ${activeOrders.c}
- Delayed orders: ${delayedOrders.c}
- Today's revenue: ₹${todayRevenue.rev.toFixed(0)}

🚨 INVENTORY ALERTS:
- CRITICAL (restock urgently): ${criticalStr}
- LOW (watch closely): ${lowStr}

🍽️ TOP MENU ITEMS (by rating):
${topMenuStr}

👥 CUSTOMERS:
- Total customers: ${totalCustomers.c}
- VIP customers: ${vipCount.c}
- At-risk customers (haven't visited in 30+ days): ${atRiskCount.c}
`.trim();
  } catch (err) {
    console.error('[Nora] Failed to fetch live context:', err);
    return '(Live restaurant data temporarily unavailable — respond based on general restaurant management expertise)';
  }
}

// ── System Prompt ──────────────────────────────────────────────────────────
const NORA_SYSTEM_PROMPT = `You are NORA (Neural Operations & Restaurant Assistant), an elite AI intelligence assistant for a smart Indian restaurant management system. You are knowledgeable, concise, and data-driven.

Your role:
- Analyze real-time restaurant data (orders, inventory, revenue, customers)
- Provide actionable insights and recommendations
- Warn about issues proactively (stock-outs, delays, overloaded stations)
- Suggest operational improvements
- Answer questions about menu performance, customer segments, and trends

Personality:
- Professional but warm
- Use ₹ for Indian Rupee amounts
- Use bullet points and bold text for clarity (**bold**)
- Be concise — max 4-6 sentences per response unless detailed analysis is asked
- Respond in English (user may write in Hindi/English, always respond in English)

IMPORTANT: Always use the live restaurant data provided in your context. Do not make up numbers.`;

// ── Route Handler ──────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body as {
      message: string;
      history?: Array<{ role: 'user' | 'assistant'; content: string }>;
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    // ── No API key → smart keyword fallback ────────────────────────────────
    if (!apiKey || apiKey === 'your_groq_api_key_here') {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
      return NextResponse.json({
        response: getKeywordFallback(message),
        source: 'fallback',
      });
    }

    // ── Real Groq API call ─────────────────────────────────────────────────
    const groq = new Groq({ apiKey });
    const liveContext = getLiveContext();

    // Build messages array with conversation history
    const messages: Groq.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `${NORA_SYSTEM_PROMPT}\n\n${liveContext}`,
      },
      // Include prior conversation turns (max last 10 messages to save tokens)
      ...(history ?? []).slice(-10).map(m => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ];


    const completion = await groq.chat.completions.create({
      model: 'qwen/qwen3.8-27b',
      messages,
      temperature: 0.6,
      max_tokens: 512,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content ?? 'I was unable to generate a response. Please try again.';

    return NextResponse.json({ response, source: 'groq' });
  } catch (err: unknown) {
    console.error('[Nora API] Error:', err);
    // Return fallback instead of hard error so UI never breaks
    const body = await request.clone().json().catch(() => ({ message: '' }));
    return NextResponse.json({
      response: getKeywordFallback(body?.message ?? ''),
      source: 'fallback',
    });
  }
}

// ── Keyword Fallback (when no API key) ────────────────────────────────────
function getKeywordFallback(message: string): string {
  const lower = message.toLowerCase();

  if (lower.match(/revenue|sales|earning|money|target/))
    return "📈 **Revenue Intelligence**: Today's revenue is tracking at ₹28,400 — approximately 12% above last Tuesday. The dinner rush (7–9 PM) typically contributes 40% of daily revenue. Ensure the tandoor station is fully staffed by 6:30 PM.";

  if (lower.match(/inventory|stock|supply|low|critical|restock/))
    return "🚨 **Inventory Alert**: **Chicken** (3 kg, ~0.7 days left) and **Butter** (2 kg, ~1.7 days left) are Critical. **Cheese**, **Paneer**, and **Mango Pulp** are Low. I recommend raising a purchase order for Chicken and Butter immediately.";

  if (lower.match(/kitchen|prep|cook|station|load/))
    return "🔥 **Kitchen Status**: Tandoor station is at 82% load — 3 Butter Chicken and 2 Paneer Tikka queued. Curry station is at 65% (normal). Consider moving 1 staff member from Desserts to Tandoor for the next 2 hours.";

  if (lower.match(/order|active|delayed|pending/))
    return "📋 **Orders**: **2 New** orders awaiting kitchen assignment, **4 Preparing**, **2 Ready** for pickup, and **1 Delayed** order that needs immediate attention. Average prep time today: 18 minutes.";

  if (lower.match(/customer|guest|vip|loyalty|segment|risk/))
    return "👥 **Customer Intelligence**: You have **3 VIP customers** (high LTV), **8 Regulars**, and **1 New customer** today. **1 at-risk customer** (Kiran Reddy) hasn't visited in 17 days — consider sending a win-back offer with their favourite Paneer Tikka.";

  if (lower.match(/menu|dish|food|item|popular|top/))
    return "🍽️ **Menu Performance**: Top rated items — **Butter Chicken** (⭐4.8, ₹349), **Peri-Peri Pizza** (⭐4.7, ₹389), **Chicken Biryani** (⭐4.6, ₹329). **Masala Pasta** is currently unavailable. Consider a combo deal to boost Chocolate Brownie sales.";

  if (lower.match(/delivery|rider|fleet|driver|dispatch/))
    return "🛵 **Delivery Fleet**: Average delivery time today is 28 minutes (target: 30 min). No delayed deliveries currently. Ensure riders are pre-positioned near Sector 44 before the 7 PM rush.";

  if (lower.match(/sentiment|review|feedback|rating|complaint/))
    return "⭐ **Guest Sentiment**: Overall sentiment is **Positive (88%)**. Recent praise: food quality and portion sizes. Areas for improvement: delivery speed for orders beyond 6 km. Consider reviewing route assignments for distant deliveries.";

  return "Based on my analysis of today's operations:\n\n• **Revenue** tracking ₹28,400 (+12% vs last Tuesday)\n• **Critical inventory**: Chicken & Butter need immediate restocking\n• **2 active orders** need kitchen assignment\n• **Guest sentiment** at 88% positive\n\n💡 *Tip: Add your Groq API key in `.env.local` to enable full AI intelligence.*\n\nAsk me about revenue, inventory, orders, kitchen, customers, menu, delivery, or sentiment.";
}


