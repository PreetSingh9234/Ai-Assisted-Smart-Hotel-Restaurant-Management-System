// MOCK SCAFFOLD — replace with FastAPI at NEXT_PUBLIC_API_URL
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { mockCustomers } = await import('@/data/mock');
    return NextResponse.json(mockCustomers);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
