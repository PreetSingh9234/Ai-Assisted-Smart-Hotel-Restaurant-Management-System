// MOCK SCAFFOLD — replace with FastAPI at NEXT_PUBLIC_API_URL

import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();
    const orders = db.prepare('SELECT * FROM orders ORDER BY createdAt DESC').all();

    if (orders.length === 0) {
      throw new Error("No data seeded");
    }
    return NextResponse.json(orders);
  } catch (e) {
    // Fall back to mock data
    const { mockOrders } = await import('@/data/mock');
    return NextResponse.json(mockOrders);
  }
}