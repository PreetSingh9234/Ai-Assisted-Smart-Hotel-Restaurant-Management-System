import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { mockOrders } = await import('@/data/mock');
    const order = mockOrders.find(o => o.id === params.id);
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(order);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}