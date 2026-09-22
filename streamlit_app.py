from __future__ import annotations

import random
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Literal

import pandas as pd
import streamlit as st
import streamlit.components.v1 as components

OrderStatus = Literal[
    "New",
    "Preparing",
    "Ready",
    "Out for Delivery",
    "Delivered",
    "Delayed",
    "Cancelled",
]
InventoryStatus = Literal["Normal", "Low", "Critical"]
CustomerSegment = Literal["VIP", "Regular", "New", "At Risk"]


@dataclass(frozen=True)
class MenuItem:
    id: str
    name: str
    category: str
    price: int
    rating: float
    available: bool


MENU_ITEMS = [
    MenuItem("m1", "Peri-Peri Pizza", "Pizza", 389, 4.7, True),
    MenuItem("m2", "Margherita Pizza", "Pizza", 299, 4.5, True),
    MenuItem("m3", "Butter Chicken", "Indian Mains", 349, 4.8, True),
    MenuItem("m4", "Chicken Biryani", "Indian Mains", 329, 4.6, True),
    MenuItem("m5", "Paneer Tikka", "Starters", 279, 4.4, True),
    MenuItem("m6", "Garlic Bread", "Starters", 149, 4.3, True),
    MenuItem("m7", "Loaded Fries", "Starters", 189, 4.2, True),
    MenuItem("m8", "Masala Pasta", "Mains", 259, 4.1, False),
    MenuItem("m9", "Chicken Burger", "Burgers", 249, 4.3, True),
    MenuItem("m10", "Chocolate Brownie", "Desserts", 179, 4.6, True),
    MenuItem("m11", "Mango Lassi", "Beverages", 129, 4.5, True),
    MenuItem("m12", "Masala Chai", "Beverages", 69, 4.4, True),
]

INVENTORY_ITEMS = [
    {"name": "Tomatoes", "quantity": 25, "unit": "kg", "status": "Normal", "daily_usage": 3.2},
    {"name": "Cheese", "quantity": 8, "unit": "kg", "status": "Low", "daily_usage": 1.8},
    {"name": "Chicken", "quantity": 3, "unit": "kg", "status": "Critical", "daily_usage": 4.5},
    {"name": "Flour", "quantity": 40, "unit": "kg", "status": "Normal", "daily_usage": 2.1},
    {"name": "Paneer", "quantity": 6, "unit": "kg", "status": "Low", "daily_usage": 2.0},
    {"name": "Rice", "quantity": 30, "unit": "kg", "status": "Normal", "daily_usage": 3.5},
    {"name": "Onions", "quantity": 15, "unit": "kg", "status": "Normal", "daily_usage": 2.8},
    {"name": "Butter", "quantity": 2, "unit": "kg", "status": "Critical", "daily_usage": 1.2},
    {"name": "Cooking Oil", "quantity": 18, "unit": "L", "status": "Normal", "daily_usage": 1.5},
    {"name": "Mango Pulp", "quantity": 4, "unit": "L", "status": "Low", "daily_usage": 1.8},
]

CUSTOMERS = [
    {
        "name": "Priya Sharma",
        "orders_count": 14,
        "total_spend": 5400,
        "favorite_dish": "Butter Chicken",
        "segment": "VIP",
    },
    {
        "name": "Arjun Mehta",
        "orders_count": 8,
        "total_spend": 3200,
        "favorite_dish": "Chicken Biryani",
        "segment": "Regular",
    },
    {
        "name": "Rahul Verma",
        "orders_count": 22,
        "total_spend": 9800,
        "favorite_dish": "Peri-Peri Pizza",
        "segment": "VIP",
    },
    {
        "name": "Sneha Patel",
        "orders_count": 1,
        "total_spend": 488,
        "favorite_dish": "Margherita Pizza",
        "segment": "New",
    },
    {
        "name": "Kiran Reddy",
        "orders_count": 12,
        "total_spend": 4500,
        "favorite_dish": "Paneer Tikka",
        "segment": "At Risk",
    },
]

NORA_RESPONSES = {
    "revenue": "Today's projected revenue is Rs 28,400 and tracking 12% above yesterday.",
    "inventory": "Three inventory items need attention: Butter, Chicken, and Cheese.",
    "kitchen": "Kitchen load is moderate-high. Tandoor is close to full capacity.",
    "orders": "You have active orders in New and Preparing states; no critical delays right now.",
    "customers": "VIP customers are highly active today. Consider a loyalty upsell campaign.",
    "delivery": "Delivery fleet performance is healthy with average turnaround below 30 minutes.",
}


def format_currency(value: float) -> str:
    return f"Rs {value:,.0f}"


def generate_orders(seed: int = 42, count: int = 50) -> list[dict]:
    random.seed(seed)
    now = datetime.now()
    customer_names = [customer["name"] for customer in CUSTOMERS] + [
        "Anjali Deshmukh",
        "Vikram Singh",
        "Siddharth Rao",
        "Nisha Gupta",
        "Rohan Das",
    ]
    statuses: list[OrderStatus] = ["New", "Preparing", "Ready", "Delivered", "Delayed"]
    orders: list[dict] = []

    for idx in range(count):
        if idx < 20:
            created_at = now - timedelta(hours=random.uniform(0, 8))
        else:
            created_at = now - timedelta(
                days=random.randint(1, 5),
                hours=random.uniform(0, 12),
            )

        items = random.sample(MENU_ITEMS, random.randint(1, 3))
        order_items = []
        total = 0

        for item in items:
            quantity = random.randint(1, 2)
            subtotal = item.price * quantity
            total += subtotal
            order_items.append(
                {
                    "name": item.name,
                    "quantity": quantity,
                    "price": item.price,
                    "subtotal": subtotal,
                }
            )

        status = statuses[min(idx, len(statuses) - 1)] if idx < 5 else random.choice(statuses)

        orders.append(
            {
                "id": str(2404 + idx),
                "customer_name": random.choice(customer_names),
                "items": order_items,
                "total_amount": total,
                "status": status,
                "created_at": created_at,
            }
        )

    return orders


def nora_reply(message: str) -> str:
    lower = message.lower()

    if any(keyword in lower for keyword in ["revenue", "sales", "earning"]):
        return NORA_RESPONSES["revenue"]
    if any(keyword in lower for keyword in ["inventory", "stock", "supply"]):
        return NORA_RESPONSES["inventory"]
    if any(keyword in lower for keyword in ["kitchen", "prep", "station"]):
        return NORA_RESPONSES["kitchen"]
    if any(keyword in lower for keyword in ["order", "delayed"]):
        return NORA_RESPONSES["orders"]
    if any(keyword in lower for keyword in ["customer", "guest", "vip"]):
        return NORA_RESPONSES["customers"]
    if any(keyword in lower for keyword in ["delivery", "rider", "fleet"]):
        return NORA_RESPONSES["delivery"]

    return "Ask me about revenue, inventory, kitchen, orders, customers, or delivery."


def render_header() -> None:
    st.set_page_config(
        page_title="Smart Hotel & Restaurant Management",
        page_icon=":fork_and_knife:",
        layout="wide",
    )

    st.markdown(
        """
        <style>
            .nora-card {
                padding: 16px;
                border: 1px solid #e5e7eb;
                border-radius: 14px;
                background: #ffffff;
            }
            .nora-title {
                font-size: 28px;
                font-weight: 700;
                margin: 0;
            }
            .nora-sub {
                color: #6b7280;
                margin-top: 6px;
            }
        </style>
        <div class="nora-card">
            <h1 class="nora-title">Rajdarbar Unified Dashboard (Streamlit)</h1>
            <p class="nora-sub">
                Full Streamlit rewrite for web deployment with HTML/CSS and JS widget support.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    components.html(
        """
        <div style="font-family:sans-serif; color:#374151; margin:6px 0 2px 0;">
            <b>Live Local Time:</b> <span id="clock"></span>
        </div>
        <script>
            function tick() {
                document.getElementById("clock").innerText = new Date().toLocaleTimeString();
            }
            tick();
            setInterval(tick, 1000);
        </script>
        """,
        height=30,
    )


def render_dashboard_tab(orders: list[dict]) -> None:
    today_revenue = sum(
        order["total_amount"]
        for order in orders
        if order["created_at"].date() == datetime.now().date()
    )
    active_orders = sum(
        1 for order in orders if order["status"] in {"New", "Preparing"}
    )
    delayed_orders = sum(1 for order in orders if order["status"] == "Delayed")
    low_inventory = sum(
        1 for item in INVENTORY_ITEMS if item["status"] in {"Low", "Critical"}
    )

    cols = st.columns(4)
    cols[0].metric("Today's Revenue", format_currency(today_revenue))
    cols[1].metric("Total Orders", len(orders))
    cols[2].metric("Active Orders", active_orders)
    cols[3].metric("Delayed Orders", delayed_orders)

    st.caption(f"Inventory alerts: {low_inventory} item(s)")

    hourly = pd.DataFrame(
        {
            "hour": list(range(10, 21)),
            "sales": [random.randint(2000, 9500) for _ in range(11)],
        }
    )
    st.line_chart(hourly.set_index("hour"))


def render_orders_tab(orders: list[dict]) -> None:
    order_df = pd.DataFrame(
        [
            {
                "Order ID": order["id"],
                "Customer": order["customer_name"],
                "Status": order["status"],
                "Amount": order["total_amount"],
                "Created At": order["created_at"].strftime("%Y-%m-%d %H:%M"),
            }
            for order in orders
        ]
    )

    status_filter = st.selectbox(
        "Filter by status",
        ["All"] + sorted(order_df["Status"].unique().tolist()),
    )
    if status_filter != "All":
        order_df = order_df[order_df["Status"] == status_filter]

    search = st.text_input("Search by order ID or customer")
    if search.strip():
        search_value = search.lower()
        order_df = order_df[
            order_df["Order ID"].str.lower().str.contains(search_value)
            | order_df["Customer"].str.lower().str.contains(search_value)
        ]

    st.dataframe(order_df.sort_values("Created At", ascending=False), use_container_width=True)


def render_menu_tab() -> None:
    menu_df = pd.DataFrame([vars(item) for item in MENU_ITEMS])
    menu_df = menu_df.rename(
        columns={
            "id": "ID",
            "name": "Name",
            "category": "Category",
            "price": "Price",
            "rating": "Rating",
            "available": "Available",
        }
    )

    st.dataframe(menu_df, use_container_width=True)

    top_items = menu_df.sort_values("Rating", ascending=False).head(5)
    st.subheader("Top Rated Items")
    st.table(top_items[["Name", "Rating", "Price"]])


def render_inventory_tab() -> None:
    inventory_df = pd.DataFrame(INVENTORY_ITEMS)
    inventory_df = inventory_df.rename(
        columns={
            "name": "Item",
            "quantity": "Quantity",
            "unit": "Unit",
            "status": "Status",
            "daily_usage": "Daily Usage",
        }
    )

    st.dataframe(inventory_df, use_container_width=True)

    critical = inventory_df[inventory_df["Status"] == "Critical"]
    if not critical.empty:
        st.warning(f"Critical stock: {', '.join(critical['Item'].tolist())}")


def render_customers_tab() -> None:
    customer_df = pd.DataFrame(CUSTOMERS)
    customer_df = customer_df.rename(
        columns={
            "name": "Name",
            "orders_count": "Orders",
            "total_spend": "Total Spend",
            "favorite_dish": "Favorite Dish",
            "segment": "Segment",
        }
    )

    st.dataframe(customer_df, use_container_width=True)
    st.bar_chart(customer_df["Segment"].value_counts())


def render_kitchen_tab(orders: list[dict]) -> None:
    prep_orders = [order for order in orders if order["status"] in {"New", "Preparing", "Ready"}]
    kitchen_df = pd.DataFrame(
        [
            {
                "Order ID": order["id"],
                "Status": order["status"],
                "Items": ", ".join(item["name"] for item in order["items"]),
            }
            for order in prep_orders
        ]
    )

    st.dataframe(kitchen_df, use_container_width=True)
    st.info("Tandoor station and curry station load can be monitored here.")


def render_delivery_tab() -> None:
    delivery_df = pd.DataFrame(
        [
            {"Rider": "Rahul S.", "Zone": "Sector 44", "Status": "In Transit"},
            {"Rider": "Amit P.", "Zone": "MG Road", "Status": "Waiting Pickup"},
            {"Rider": "Vikram M.", "Zone": "City Center", "Status": "In Transit"},
            {"Rider": "Neha T.", "Zone": "Phase 5", "Status": "Available"},
        ]
    )

    st.dataframe(delivery_df, use_container_width=True)


def render_nora_tab() -> None:
    st.subheader("NORA AI Assistant")
    user_prompt = st.text_area("Ask NORA", placeholder="How is inventory risk today?")

    if st.button("Get Insight"):
        if not user_prompt.strip():
            st.error("Please type a message for NORA.")
            return

        st.success(nora_reply(user_prompt))


def main() -> None:
    render_header()
    orders = generate_orders()

    page = st.sidebar.radio(
        "Navigate",
        [
            "Dashboard",
            "Orders",
            "Menu",
            "Inventory",
            "Customers",
            "Kitchen",
            "Delivery",
            "NORA Assistant",
        ],
    )

    if page == "Dashboard":
        render_dashboard_tab(orders)
    elif page == "Orders":
        render_orders_tab(orders)
    elif page == "Menu":
        render_menu_tab()
    elif page == "Inventory":
        render_inventory_tab()
    elif page == "Customers":
        render_customers_tab()
    elif page == "Kitchen":
        render_kitchen_tab(orders)
    elif page == "Delivery":
        render_delivery_tab()
    else:
        render_nora_tab()


if __name__ == "__main__":
    main()
