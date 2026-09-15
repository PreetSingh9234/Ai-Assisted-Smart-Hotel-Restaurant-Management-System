// MOCK SCAFFOLD — replace with FastAPI at NEXT_PUBLIC_API_URL
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { mockMenuItems } = await import('@/data/mock');
    return NextResponse.json(mockMenuItems);
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
