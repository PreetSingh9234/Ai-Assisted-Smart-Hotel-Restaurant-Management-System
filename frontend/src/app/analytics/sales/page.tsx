"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { KpiCard } from '@/components/ui/KpiCard';
import { SalesChart } from '@/components/ui/SalesChart';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DollarSign, ShoppingBag, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

export default function SalesAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#E05C3A', '#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  // Format revenue trend for chart
  const trendData = data?.trend?.revenueByDay?.map((item: any) => ({
    time: new Date(item.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
    amount: item.revenue,
    orders: item.orders,
  })) || [];

  const statusData = data?.orders?.statusBreakdown?.map((item: any) => ({
    name: item.status,
    value: item.count,
  })) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight flex items-center gap-2">
            <BarChart2 className="text-coral" /> Sales & Revenue Analytics
          </h1>
          <p className="text-nora-muted text-sm">Real-time performance metrics and revenue breakdown across the restaurant.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-nora-border rounded-lg text-sm font-medium text-nora-text hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Today's Revenue"
          value={formatCurrency(data?.revenue?.today ?? 0)}
          trend={14.2}
          trendLabel="vs yesterday"
          icon={DollarSign}
        />
        <KpiCard
          title="7-Day Revenue"
          value={formatCurrency(data?.revenue?.week ?? 0)}
          trend={8.5}
          trendLabel="vs last week"
          icon={TrendingUp}
        />
        <KpiCard
          title="Avg Order Value"
          value={formatCurrency(data?.revenue?.avgOrderValue ?? 0)}
          trend={3.1}
          trendLabel="stable"
          icon={ShoppingBag}
        />
        <KpiCard
          title="Active Orders Queue"
          value={data?.orders?.active ?? 0}
          icon={Users}
        />
      </div>

      {/* Main Revenue Trend Chart */}
      <Card>
        <CardHeader
          title="Revenue Trend (Last 7 Days)"
          description="Daily gross revenue tracked from verified completed orders"
          action={
            <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
              Live SQLite Telemetry
            </span>
          }
        />
        <div className="p-4 pt-0">
          {trendData.length > 0 ? (
            <SalesChart data={trendData} height={320} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-nora-muted text-sm">
              {loading ? "Loading revenue figures..." : "No orders found in this period."}
            </div>
          )}
        </div>
      </Card>

      {/* Secondary Grid: Status Breakdown + Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Breakdown */}
        <Card>
          <CardHeader
            title="Today's Order Status Distribution"
            description="Breakdown of order processing lifecycle"
          />
          <div className="p-4 pt-0 h-[280px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => [`${val} orders`, 'Volume']} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-nora-muted text-sm">
                No orders active today yet.
              </div>
            )}
          </div>
        </Card>

        {/* Top Performing Dishes */}
        <Card>
          <CardHeader
            title="Top Rated Menu Items"
            description="Highest customer satisfaction performers"
          />
          <div className="p-4 pt-0">
            <div className="divide-y divide-nora-border">
              {data?.menu?.topItems?.map((item: any, i: number) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-nora-bg text-nora-muted font-bold text-xs flex items-center justify-center border border-nora-border">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-sm text-nora-text">{item.name}</p>
                      <span className="text-xs text-nora-muted">{item.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-nora-text">{formatCurrency(item.price)}</p>
                    <span className="text-xs text-amber-600 font-semibold">★ {item.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
