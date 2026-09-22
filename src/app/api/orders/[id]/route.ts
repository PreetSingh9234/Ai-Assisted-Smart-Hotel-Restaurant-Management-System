import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

type RouteContext = { params: { id: string } };

// ── GET /api/orders/[id] ────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const db = getDb();
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(params.id) as {
      id: string; customerName: string; totalAmount: number; status: string; createdAt: string;
    } | undefined;

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(params.id) as Array<{
      id: string; menuItemId: string; name: string; quantity: number; price: number;
    }>;

    return NextResponse.json({
      ...order,
      items: items.map(i => ({ id: i.menuItemId ?? i.id, name: i.name, quantity: i.quantity, price: i.price })),
    });
  } catch (err) {
    console.error('[GET /api/orders/[id]]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// ── PATCH /api/orders/[id] — Update status ──────────────────────────────────
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const db = getDb();
    const { status } = await request.json() as { status: string };

    const validStatuses = ['New', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Delayed', 'Cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 });
    }

    const existing = db.prepare('SELECT id FROM orders WHERE id = ?').get(params.id);
    if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, params.id);
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(params.id);
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PATCH /api/orders/[id]]', err);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// ── DELETE /api/orders/[id] — Cancel order ──────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT id FROM orders WHERE id = ?').get(params.id);
    if (!existing) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // Soft delete — mark as Cancelled (preserve history)
    db.prepare("UPDATE orders SET status = 'Cancelled' WHERE id = ?").run(params.id);
    return NextResponse.json({ message: `Order ${params.id} cancelled successfully` });
  } catch (err) {
    console.error('[DELETE /api/orders/[id]]', err);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}