from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import database
from nora import generate_nora_response

app = FastAPI(
    title="Rajdarbar Smart Hotel & Restaurant Backend API",
    description="Dedicated Backend REST API with Groq LLM-powered NORA AI assistant and SQLite data persistence.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    database.init_db()

# --- Pydantic Schemas ---
class ChatMessage(BaseModel):
    role: str
    content: str

class NoraRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = None

class OrderItemSchema(BaseModel):
    id: str
    name: str
    quantity: int
    price: float

class CreateOrderRequest(BaseModel):
    customerName: str
    items: List[OrderItemSchema]

class UpdateOrderStatusRequest(BaseModel):
    status: str

# --- Nora AI Endpoint ---
@app.post("/api/nora")
def chat_with_nora(payload: NoraRequest):
    reply = generate_nora_response(payload.message, [h.dict() for h in payload.history] if payload.history else None)
    return {"response": reply, "source": "groq"}

# --- Orders Endpoints ---
@app.get("/api/orders")
def get_orders(status: Optional[str] = None, limit: int = 50):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    if status:
        cursor.execute("SELECT * FROM orders WHERE status = ? ORDER BY createdAt DESC LIMIT ?", (status, limit))
    else:
        cursor.execute("SELECT * FROM orders ORDER BY createdAt DESC LIMIT ?", (limit,))
    
    rows = cursor.fetchall()
    orders = []
    for r in rows:
        cursor.execute("SELECT menuItemId as id, name, quantity, price FROM order_items WHERE orderId = ?", (r["id"],))
        items = [dict(item) for item in cursor.fetchall()]
        orders.append({
            "id": r["id"],
            "customerName": r["customerName"],
            "totalAmount": r["totalAmount"],
            "status": r["status"],
            "createdAt": r["createdAt"],
            "items": items
        })
    conn.close()
    return orders

@app.post("/api/orders", status_code=201)
def create_order(payload: CreateOrderRequest):
    order_id = f"ORD-{int(datetime.now().timestamp()*1000)}"
    created_at = datetime.now().isoformat()
    total_amount = sum(item.price * item.quantity for item in payload.items)

    conn = database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO orders (id, customerName, totalAmount, status, createdAt) VALUES (?, ?, ?, ?, ?)",
        (order_id, payload.customerName, total_amount, "New", created_at)
    )
    for idx, it in enumerate(payload.items):
        cursor.execute(
            "INSERT INTO order_items (id, orderId, menuItemId, name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)",
            (f"{order_id}-{idx}", order_id, it.id, it.name, it.quantity, it.price)
        )
    conn.commit()
    conn.close()
    return {"id": order_id, "customerName": payload.customerName, "totalAmount": total_amount, "status": "New", "createdAt": created_at}

@app.patch("/api/orders/{order_id}")
def update_order_status(order_id: str, payload: UpdateOrderStatusRequest):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE orders SET status = ? WHERE id = ?", (payload.status, order_id))
    if cursor.rowcount == 0:
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")
    conn.commit()
    conn.close()
    return {"id": order_id, "status": payload.status}

# --- Inventory Endpoints ---
@app.get("/api/inventory")
def get_inventory(status: Optional[str] = None):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    if status:
        cursor.execute("SELECT * FROM inventory WHERE status = ? ORDER BY quantity ASC", (status,))
    else:
        cursor.execute("SELECT * FROM inventory ORDER BY CASE status WHEN 'Critical' THEN 1 WHEN 'Low' THEN 2 ELSE 3 END")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

# --- Menu Endpoints ---
@app.get("/api/menu")
def get_menu(category: Optional[str] = None):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    if category:
        cursor.execute("SELECT * FROM menu_items WHERE category = ?", (category,))
    else:
        cursor.execute("SELECT * FROM menu_items")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

# --- Customers Endpoints ---
@app.get("/api/customers")
def get_customers(segment: Optional[str] = None):
    conn = database.get_db_connection()
    cursor = conn.cursor()
    if segment:
        cursor.execute("SELECT * FROM customers WHERE segment = ? ORDER BY totalSpend DESC", (segment,))
    else:
        cursor.execute("SELECT * FROM customers ORDER BY totalSpend DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

# --- Consolidated Analytics Endpoint ---
@app.get("/api/analytics")
def get_analytics():
    conn = database.get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COALESCE(SUM(totalAmount), 0) FROM orders WHERE status != 'Cancelled'")
    today_rev = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM orders")
    total_orders = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM orders WHERE status IN ('New', 'Preparing', 'Ready')")
    active_orders = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM inventory WHERE status = 'Critical'")
    critical_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM inventory WHERE status = 'Low'")
    low_count = cursor.fetchone()[0]

    conn.close()
    return {
        "revenue": {"today": today_rev, "week": today_rev * 6.5, "avgOrderValue": today_rev / max(total_orders, 1)},
        "orders": {"today": total_orders, "active": active_orders},
        "inventory": {"criticalCount": critical_count, "lowCount": low_count},
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
