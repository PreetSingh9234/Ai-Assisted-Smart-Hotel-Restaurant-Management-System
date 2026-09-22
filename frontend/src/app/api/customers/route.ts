import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// ── GET /api/customers ──────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const segment = searchParams.get('segment'); // VIP | Regular | New | At Risk
    const limit = parseInt(searchParams.get('limit') ?? '100');

    let query = 'SELECT * FROM customers';
    const params: (string | number)[] = [];
    if (segment) { query += ' WHERE segment = ?'; params.push(segment); }
    query += ' ORDER BY totalSpend DESC LIMIT ?';
    params.push(limit);

    const customers = db.prepare(query).all(...params);
    return NextResponse.json(customers);
  } catch (err) {
    console.error('[GET /api/customers]', err);
    const { mockCustomers } = await import('@/data/mock');
    return NextResponse.json(mockCustomers);
  }
}

// ── POST /api/customers ─────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const { name, favoriteDish } = await request.json() as {
      name: string; favoriteDish?: string;
    };

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const id = `c-${Date.now()}`;
    const lastOrderAt = new Date().toISOString();
    db.prepare(
      'INSERT INTO customers (id, name, ordersCount, totalSpend, favoriteDish, lastOrderAt, segment) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, name, 0, 0, favoriteDish ?? null, lastOrderAt, 'New');

    return NextResponse.json({ id, name, ordersCount: 0, totalSpend: 0, favoriteDish: favoriteDish ?? null, lastOrderAt, segment: 'New' }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/customers]', err);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
