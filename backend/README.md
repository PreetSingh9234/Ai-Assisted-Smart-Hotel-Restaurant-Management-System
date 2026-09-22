# 🏨 Rajdarbar Restaurant Management System — Backend Service

A high-performance **FastAPI** backend service integrated with **Groq LLM (NORA AI)** and an embedded **SQLite** database engine.

---

## 📁 Architecture Overview

```
backend/
├── main.py            # FastAPI entrypoint with REST endpoints (Orders, Menu, Inventory, Analytics)
├── nora.py            # Groq API LLM integration with real-time database context grounding
├── database.py        # SQLite schema, connection management, and table definitions
├── requirements.txt   # Python dependencies
└── README.md          # Documentation & Setup guide
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Python 3.9+ installed
- A valid Groq API Key (from [console.groq.com](https://console.groq.com))

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
Ensure `.env.local` in the project root contains your Groq key:
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

### 4. Run Backend Server
```bash
python main.py
```
*Or with uvicorn:*
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive Swagger API docs will be available at: **http://localhost:8000/docs**

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/nora` | Chat with NORA AI assistant powered by Groq LLM |
| `GET` | `/api/orders` | List orders (with status filter) |
| `POST` | `/api/orders` | Create a new table or delivery order |
| `PATCH` | `/api/orders/{id}` | Update order status (`New` ➔ `Preparing` ➔ `Ready` ➔ `Delivered`) |
| `GET` | `/api/inventory` | Real-time stock levels with `Critical` / `Low` flags |
| `GET` | `/api/menu` | Full digital menu card categorized |
| `GET` | `/api/customers` | Guest segmentation (VIP, Regular, At-Risk) |
| `GET` | `/api/analytics` | Aggregated revenue and order processing metrics |
