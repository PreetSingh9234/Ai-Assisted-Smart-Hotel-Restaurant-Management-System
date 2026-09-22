import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// ── GET /api/orders ─────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') ?? '50');

    // Fetch orders
    const orderQuery = status
      ? 'SELECT * FROM orders WHERE status = ? ORDER BY createdAt DESC LIMIT ?'
      : 'SELECT * FROM orders ORDER BY createdAt DESC LIMIT ?';
    const orderParams = status ? [status, limit] : [limit];
    const orders = db.prepare(orderQuery).all(...orderParams) as Array<{
      id: string; customerName: string; totalAmount: number; status: string; createdAt: string;
    }>;

    // Fetch items for all fetched orders
    const orderIds = orders.map(o => o.id);
    if (orderIds.length === 0) return NextResponse.json([]);

    const placeholders = orderIds.map(() => '?').join(',');
    const items = db
      .prepare(`SELECT * FROM order_items WHERE orderId IN (${placeholders})`)
      .all(...orderIds) as Array<{
        id: string; orderId: string; menuItemId: string; name: string; quantity: number; price: number;
      }>;

    // Join items into orders
    const itemsByOrder = new Map<string, typeof items>();
    for (const item of items) {
      if (!itemsByOrder.has(item.orderId)) itemsByOrder.set(item.orderId, []);
      itemsByOrder.get(item.orderId)!.push(item);
    }

    const result = orders.map(o => ({
      ...o,
      items: (itemsByOrder.get(o.id) ?? []).map(i => ({
        id: i.menuItemId ?? i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
    }));

    return NextResponse.json(result);
  } catch (err) {
    console.error('[GET /api/orders]', err);
    // Fallback to mock
    const { mockOrders } = await import('@/data/mock');
    return NextResponse.json(mockOrders);
  }
}

// ── POST /api/orders ────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { customerName, items } = body as {
      customerName: string;
      items: Array<{ id: string; name: string; quantity: number; price: number }>;
    };

    if (!customerName || !items?.length) {
      return NextResponse.json({ error: 'customerName and items are required' }, { status: 400 });
    }

    const orderId = `ORD-${Date.now()}`;
    const createdAt = new Date().toISOString();
    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const insertOrder = db.prepare(
      'INSERT INTO orders (id, customerName, totalAmount, status, createdAt) VALUES (?, ?, ?, ?, ?)'
    );
    const insertItem = db.prepare(
      'INSERT INTO order_items (id, orderId, menuItemId, name, quantity, price) VALUES (?, ?, ?, ?, ?, ?)'
    );

    db.transaction(() => {
      insertOrder.run(orderId, customerName, totalAmount, 'New', createdAt);
      items.forEach((item, idx) => {
        insertItem.run(`${orderId}-${idx}`, orderId, item.id, item.name, item.quantity, item.price);
      });
    })();

    return NextResponse.json({ id: orderId, customerName, totalAmount, status: 'New', createdAt, items }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}