import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// ── GET /api/menu ───────────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const availableOnly = searchParams.get('available') === 'true';

    let query = 'SELECT * FROM menu_items';
    const params: (string | number)[] = [];
    const conditions: string[] = [];

    if (category) { conditions.push('category = ?'); params.push(category); }
    if (availableOnly) { conditions.push('available = 1'); }
    if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
    query += ' ORDER BY category, name';

    const items = db.prepare(query).all(...params) as Array<{
      id: string; name: string; category: string; price: number; rating: number; available: number;
    }>;

    return NextResponse.json(items.map(i => ({ ...i, available: i.available === 1 })));
  } catch (err) {
    console.error('[GET /api/menu]', err);
    const { mockMenuItems } = await import('@/data/mock');
    return NextResponse.json(mockMenuItems);
  }
}

// ── POST /api/menu ──────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { name, category, price, rating = 0, available = true } = body as {
      name: string; category: string; price: number; rating?: number; available?: boolean;
    };

    if (!name || !category || !price) {
      return NextResponse.json({ error: 'name, category, and price are required' }, { status: 400 });
    }

    const id = `m-${Date.now()}`;
    db.prepare(
      'INSERT INTO menu_items (id, name, category, price, rating, available) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, name, category, price, rating, available ? 1 : 0);

    return NextResponse.json({ id, name, category, price, rating, available }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/menu]', err);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}
