import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// ── GET /api/inventory ──────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // 'Critical' | 'Low' | 'Normal'

    let query = 'SELECT * FROM inventory';
    const params: string[] = [];
    if (status) { query += ' WHERE status = ?'; params.push(status); }
    query += ' ORDER BY CASE status WHEN \'Critical\' THEN 1 WHEN \'Low\' THEN 2 ELSE 3 END, name';

    const items = db.prepare(query).all(...params);
    return NextResponse.json(items);
  } catch (err) {
    console.error('[GET /api/inventory]', err);
    const { mockInventory } = await import('@/data/mock');
    return NextResponse.json(mockInventory);
  }
}

// ── POST /api/inventory ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { name, quantity, unit, dailyUsage = 0 } = await request.json() as {
      name: string; quantity: number; unit: string; dailyUsage?: number;
    };

    if (!name || quantity === undefined || !unit) {
      return NextResponse.json({ error: 'name, quantity, and unit are required' }, { status: 400 });
    }

    const id = `inv-${Date.now()}`;
    const status = quantity <= 0 ? 'Critical' : quantity <= dailyUsage * 3 ? 'Low' : 'Normal';
    db.prepare(
      'INSERT INTO inventory (id, name, quantity, unit, status, dailyUsage) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, name, quantity, unit, status, dailyUsage);

    return NextResponse.json({ id, name, quantity, unit, status, dailyUsage }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/inventory]', err);
    return NextResponse.json({ error: 'Failed to add inventory item' }, { status: 500 });
  }
}

// ── PATCH /api/inventory ─────────────────────────────────────────────────────
export async function PATCH(request: NextRequest) {
  try {
    const db = getDb();
    const { id, quantity, status } = await request.json() as {
      id: string; quantity?: number; status?: string;
    };

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const item = db.prepare('SELECT * FROM inventory WHERE id = ?').get(id) as {
      id: string; dailyUsage: number; quantity: number;
    } | undefined;

    if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

    const newQuantity = quantity !== undefined ? quantity : item.quantity;
    const newStatus = status ?? (
      newQuantity <= 0 ? 'Critical' : newQuantity <= item.dailyUsage * 3 ? 'Low' : 'Normal'
    );

    db.prepare('UPDATE inventory SET quantity = ?, status = ? WHERE id = ?').run(newQuantity, newStatus, id);
    const updated = db.prepare('SELECT * FROM inventory WHERE id = ?').get(id);
    return NextResponse.json(updated);
  } catch (err) {
    console.error('[PATCH /api/inventory]', err);
    return NextResponse.json({ error: 'Failed to update inventory' }, { status: 500 });
  }
}
