import os
from groq import Groq
from dotenv import load_dotenv
from database import get_db_connection
from datetime import datetime

# Load .env.local from root if present
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env.local"))

def get_live_restaurant_context() -> str:
    """Queries SQLite database to extract live telemetry for LLM grounding."""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Orders overview
        cursor.execute("SELECT COUNT(*) FROM orders WHERE status IN ('New','Preparing','Ready')")
        active_orders = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM orders WHERE status = 'Delayed'")
        delayed_orders = cursor.fetchone()[0]

        today_start = datetime.now().strftime("%Y-%m-%d 00:00:00")
        cursor.execute("SELECT COALESCE(SUM(totalAmount), 0) FROM orders WHERE createdAt >= ?", (today_start,))
        today_revenue = cursor.fetchone()[0]

        # Critical inventory
        cursor.execute("SELECT name, quantity, unit, dailyUsage FROM inventory WHERE status = 'Critical'")
        critical_items = [f"{row['name']} ({row['quantity']}{row['unit']})" for row in cursor.fetchall()]

        # Low inventory
        cursor.execute("SELECT name, quantity, unit FROM inventory WHERE status = 'Low'")
        low_items = [f"{row['name']} ({row['quantity']}{row['unit']})" for row in cursor.fetchall()]

        # Top menu
        cursor.execute("SELECT name, price, rating FROM menu_items WHERE available = 1 ORDER BY rating DESC LIMIT 3")
        top_menu = [f"{row['name']} (₹{row['price']}, ⭐{row['rating']})" for row in cursor.fetchall()]

        conn.close()

        context = f"""
=== LIVE RESTAURANT METRICS ===
Active Orders in Queue: {active_orders}
Delayed Orders: {delayed_orders}
Today's Revenue: ₹{today_revenue:,.0f}
Critical Stock-outs (Restock ASAP): {', '.join(critical_items) if critical_items else 'None'}
Low Inventory: {', '.join(low_items) if low_items else 'None'}
Top Rated Dishes: {', '.join(top_menu)}
"""
        return context.strip()
    except Exception as e:
        return "(Telemetry temporarily offline)"

NORA_SYSTEM_PROMPT = """You are NORA (Neural Operations & Restaurant Assistant), an elite AI intelligence assistant for Rajdarbar Restaurant managed by Pritam Singh.
Your role:
- Answer queries about kitchen station queue, revenue velocity, inventory run-rates, and customer sentiment.
- Always cite verified live data provided in the prompt context.
- Be concise (3-5 sentences), professional, and use bullet points when summarizing.
- Currency is Indian Rupee (₹).
"""

def generate_nora_response(message: str, history: list = None) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_groq_api_key_here":
        return "NORA is operating in local fallback mode. Please configure your GROQ_API_KEY in .env.local to activate full LLM reasoning."

    try:
        client = Groq(apiKey=api_key)
        live_context = get_live_restaurant_context()

        messages = [
            {"role": "system", "content": f"{NORA_SYSTEM_PROMPT}\n\n{live_context}"}
        ]

        if history:
            for turn in history[-6:]:
                messages.append({"role": turn.get("role", "user"), "content": turn.get("content", "")})

        messages.append({"role": "user", "content": message})

        completion = client.chat.completions.create(
            model="qwen/qwen3.8-27b",
            messages=messages,
            temperature=0.6,
            max_tokens=512,
        )

        return completion.choices[0].message.content or "No response generated."
    except Exception as e:
        return f"Error communicating with Groq API: {str(e)}"
