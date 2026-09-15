// MOCK SCAFFOLD — Replace with Groq/LangChain integration when backend is ready
import { NextRequest, NextResponse } from 'next/server';

const FALLBACK_RESPONSES: Record<string, string> = {
  revenue: "Today's projected revenue is **₹28,400** based on current order trends. Compared to last Tuesday, you're tracking **12% higher**. The dinner rush (7–9 PM) typically contributes 40% of daily revenue — ensure tandoor station is fully staffed.",
  inventory: "**3 items need attention:**\n• Amul Butter — projected to stock out in **1.1 days** (daily usage: 2.5 kg)\n• Basmati Rice — **4 days remaining** at current consumption\n• Paneer — stock is adequate but usage spiked 30% this week\n\nI recommend generating a purchase order for butter and rice immediately.",
  kitchen: "Current kitchen load is **moderate-high**:\n• **Tandoor Station:** 82% capacity — 4 paneer dishes + 2 naan orders queued\n• **Curry Station:** 65% — running smoothly\n• **Beverage & Dessert:** 25% — available for overflow support\n\nConsider redistributing 1 staff member from dessert to tandoor for the next 2 hours.",
  orders: "You have **3 active orders** right now:\n• ORD-005 (Table 7) — Preparing, estimated 12 min\n• ORD-004 (Delivery) — In transit, Rahul S. delivering\n• ORD-003 (Table 3) — New, needs kitchen assignment\n\nNo delayed orders currently. Average prep time today is **18 minutes**.",
  customer: "Your customer base today:\n• **28% VIP guests** (high lifetime value)\n• **45% regulars** returning within their usual frequency\n• **20% new walk-ins** — slightly above Tuesday average\n• **7% at-risk** — haven't visited in 30+ days\n\nConsider running a win-back campaign targeting the at-risk segment with a 15% discount on their favourite dishes.",
  sentiment: "Guest sentiment is **88% positive** today.\n\n**Top praise:** Food quality (92%), portion sizes (85%)\n**Area for improvement:** Delivery speed (64%) — 3 reviews mentioned longer-than-expected wait times for delivery orders.\n\nI suggest reviewing delivery route assignments during peak hours.",
  menu: "**Top performers today:**\n1. Butter Chicken — 24 orders (₹8,160 revenue)\n2. Dal Makhani — 18 orders\n3. Garlic Naan — 42 orders (highest volume)\n\n**Underperforming:** Gulab Jamun is down 35% from last week. Consider a combo deal pairing it with a main course.",
  staff: "Currently **8 staff on duty**:\n• 3 kitchen (1 tandoor, 1 curry, 1 prep)\n• 2 servers\n• 1 cashier\n• 2 delivery riders\n\nFor the projected dinner rush, I recommend calling in 1 additional kitchen staff by 6:30 PM.",
  delivery: "**Delivery fleet status:**\n• Rahul S. — In transit, 12 min from Sector 44\n• Amit P. — At restaurant, waiting for ORD-004\n• Vikram M. — Delivering, 2 min from MG Road\n• 1 rider available for next assignment\n\nAverage delivery time today: **28 minutes** (target: 30 min). Fleet is performing well.",
};

function getSmartResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('revenue') || lower.includes('sales') || lower.includes('earning') || lower.includes('money'))
    return FALLBACK_RESPONSES.revenue;
  if (lower.includes('inventory') || lower.includes('stock') || lower.includes('supply') || lower.includes('purchase'))
    return FALLBACK_RESPONSES.inventory;
  if (lower.includes('kitchen') || lower.includes('prep') || lower.includes('cook') || lower.includes('station'))
    return FALLBACK_RESPONSES.kitchen;
  if (lower.includes('order') || lower.includes('active') || lower.includes('delayed'))
    return FALLBACK_RESPONSES.orders;
  if (lower.includes('customer') || lower.includes('guest') || lower.includes('vip') || lower.includes('loyalty'))
    return FALLBACK_RESPONSES.customer;
  if (lower.includes('sentiment') || lower.includes('review') || lower.includes('feedback') || lower.includes('rating'))
    return FALLBACK_RESPONSES.sentiment;
  if (lower.includes('menu') || lower.includes('dish') || lower.includes('food') || lower.includes('item'))
    return FALLBACK_RESPONSES.menu;
  if (lower.includes('staff') || lower.includes('team') || lower.includes('employee') || lower.includes('waiter'))
    return FALLBACK_RESPONSES.staff;
  if (lower.includes('delivery') || lower.includes('rider') || lower.includes('fleet') || lower.includes('driver'))
    return FALLBACK_RESPONSES.delivery;

  return "Based on my analysis of today's operations:\n\n• **Revenue** is tracking 12% above yesterday at ₹28,400\n• **Kitchen load** is moderate-high, with tandoor station at 82%\n• **3 inventory items** need restocking soon\n• **Guest sentiment** is 88% positive\n\nWould you like me to drill deeper into any of these areas? You can ask about revenue, inventory, kitchen, orders, customers, menu, staff, delivery, or sentiment.";
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // TODO: Replace with Groq SDK call when API key is available
    // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    // const completion = await groq.chat.completions.create({
    //   model: 'llama-3.3-70b-versatile',
    //   messages: [
    //     { role: 'system', content: NORA_SYSTEM_PROMPT },
    //     { role: 'user', content: message }
    //   ],
    // });

    // Simulate slight delay for realistic feel
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));

    const response = getSmartResponse(message);

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
