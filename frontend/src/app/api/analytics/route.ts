import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// ── GET /api/analytics ──────────────────────────────────────────────────────
// Returns a consolidated analytics snapshot for the dashboard
export async function GET() {
  try {
    const db = getDb();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayISO = todayStart.toISOString();

    const weekStart = new Date(Date.now() - 7 * 86_400_000).toISOString();

    // ── Revenue ──────────────────────────────────────────────────────────────
    const todayRevenue = db
      .prepare("SELECT COALESCE(SUM(totalAmount),0) as rev FROM orders WHERE createdAt >= ? AND status != 'Cancelled'")
      .get(todayISO) as { rev: number };

    const weekRevenue = db
      .prepare("SELECT COALESCE(SUM(totalAmount),0) as rev FROM orders WHERE createdAt >= ? AND status != 'Cancelled'")
      .get(weekStart) as { rev: number };

    // ── Orders Stats ─────────────────────────────────────────────────────────
    const todayOrders = db
      .prepare("SELECT COUNT(*) as c FROM orders WHERE createdAt >= ?")
      .get(todayISO) as { c: number };

    const activeOrders = db
      .prepare("SELECT COUNT(*) as c FROM orders WHERE status IN ('New','Preparing','Ready')")
      .get() as { c: number };

    const delayedOrders = db
      .prepare("SELECT COUNT(*) as c FROM orders WHERE status = 'Delayed'")
      .get() as { c: number };

    const weekOrders = db
      .prepare("SELECT COUNT(*) as c FROM orders WHERE createdAt >= ?")
      .get(weekStart) as { c: number };

    // ── Order Status Breakdown (today) ────────────────────────────────────────
    const statusBreakdown = db
      .prepare("SELECT status, COUNT(*) as count FROM orders WHERE createdAt >= ? GROUP BY status")
      .all(todayISO) as Array<{ status: string; count: number }>;

    // ── Inventory Alerts ─────────────────────────────────────────────────────
    const criticalInventory = db
      .prepare("SELECT * FROM inventory WHERE status = 'Critical' ORDER BY quantity ASC")
      .all();

    const lowInventory = db
      .prepare("SELECT * FROM inventory WHERE status = 'Low' ORDER BY quantity ASC")
      .all();

    // ── Top Menu Items by Category ────────────────────────────────────────────
    const topMenuItems = db
      .prepare("SELECT * FROM menu_items WHERE available = 1 ORDER BY rating DESC LIMIT 6")
      .all();

    // ── Customer Segments ─────────────────────────────────────────────────────
    const customerSegments = db
      .prepare("SELECT segment, COUNT(*) as count FROM customers GROUP BY segment")
      .all() as Array<{ segment: string; count: number }>;

    const totalCustomers = db
      .prepare("SELECT COUNT(*) as c FROM customers")
      .get() as { c: number };

    // ── Daily Revenue trend (last 7 days) ─────────────────────────────────────
    const revenueByDay = db.prepare(`
      SELECT 
        DATE(createdAt) as date,
        COALESCE(SUM(totalAmount), 0) as revenue,
        COUNT(*) as orders
      FROM orders
      WHERE createdAt >= ? AND status != 'Cancelled'
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `).all(weekStart) as Array<{ date: string; revenue: number; orders: number }>;

    return NextResponse.json({
      revenue: {
        today: Math.round(todayRevenue.rev),
        week: Math.round(weekRevenue.rev),
        avgOrderValue: weekOrders.c > 0 ? Math.round(weekRevenue.rev / weekOrders.c) : 0,
      },
      orders: {
        today: todayOrders.c,
        week: weekOrders.c,
        active: activeOrders.c,
        delayed: delayedOrders.c,
        statusBreakdown,
      },
      inventory: {
        critical: criticalInventory,
        low: lowInventory,
        criticalCount: (criticalInventory as unknown[]).length,
        lowCount: (lowInventory as unknown[]).length,
      },
      menu: {
        topItems: topMenuItems,
      },
      customers: {
        total: totalCustomers.c,
        segments: customerSegments,
      },
      trend: {
        revenueByDay,
      },
    });
  } catch (err) {
    console.error('[GET /api/analytics]', err);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
