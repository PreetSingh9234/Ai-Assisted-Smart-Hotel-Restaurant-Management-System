"use client";
import React, { Suspense } from 'react';
import { KpiCard } from '@/components/ui/KpiCard';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { RecommendationCard } from '@/components/ui/RecommendationCard';
import { AiInsightChip } from '@/components/ui/AiInsightChip';
import { DollarSign, ShoppingBag, Utensils, Star, Users, ArrowRight, CheckCircle2, AlertTriangle, Clock, MapPin, SmilePlus, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { SalesChart } from '@/components/ui/SalesChart';

// We would normally fetch real data from our services here
// import { getOrders } from '@/services/api';
// import { getMenu } from '@/services/api';
// import { getInventory } from '@/services/api';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { mockOrders, mockMenuItems, mockInventory, mockAiInsights } from '@/data/mock';

// Generate some hourly mock data for the chart based on the orders
const generateHourlySales = () => {
  const hours = ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM'];
  return hours.map((time, i) => {
    // Generate a bell curve around 1 PM and 8 PM
    const base = 2000;
    const lunchRush = Math.max(0, 5000 - Math.pow(i - 3, 2) * 800);
    const dinnerRush = Math.max(0, 8000 - Math.pow(i - 9, 2) * 1000);
    return {
      time,
      amount: Math.round(base + lunchRush + dinnerRush + (Math.random() * 1000)),
    };
  });
};

export default function DashboardPage() {
  // Simulate data fetching
  const orders = mockOrders;
  const menu = mockMenuItems;
  const inventory = mockInventory;

  // Computed stats
  const todayRevenue = orders
    .filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const activeOrders = orders.filter(o => ['New', 'Preparing'].includes(o.status));
  const delayedOrders = orders.filter(o => o.status === 'Delayed');

  const lowInventory = inventory.filter(i => i.status === 'Low' || i.status === 'Critical');
  const outOfStock = inventory.filter(i => i.quantity === 0);
  const hourlySales = generateHourlySales();

  // Kitchen Metrics
  const itemsInPrep = orders.filter(o => o.status === 'Preparing').reduce((sum, o) => sum + o.items.length, 0);
  const avgPrepTime = '18m'; // derived from real data eventually

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Restaurant Health Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight">Rajdarbar Unified Dashboard</h1>
          <p className="text-nora-muted">Command center for your entire operations.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-nora-border shadow-sm">
          <span className="text-sm font-medium">System Health:</span>
          {delayedOrders.length > 2 || outOfStock.length > 0 ? (
            <StatusBadge status="Needs Attention" type="warning" icon />
          ) : (
            <StatusBadge status="Healthy" type="success" icon />
          )}
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <KpiCard
          title="Today's Revenue"
          value={formatCurrency(todayRevenue)}
          trend={12.5}
          trendLabel="vs yesterday"
          icon={DollarSign}
        />
        <KpiCard
          title="Total Orders"
          value={orders.length}
          trend={8.2}
          trendLabel="vs yesterday"
          icon={ShoppingBag}
        />
        <KpiCard
          title="Active Orders"
          value={activeOrders.length}
          icon={Utensils}
        />
        <KpiCard
          title="Average Order Value"
          value={formatCurrency(todayRevenue / (orders.length || 1))}
          trend={-2.1}
          trendLabel="vs last week"
          icon={Users}
        />
        <KpiCard
          title="Sentiment Score"
          value="4.8/5"
          trend={0}
          trendLabel="stable"
          icon={Star}
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {/* 3. Critical Attention Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RecommendationCard
          title="Critical Inventory Shortage"
          description={`You have ${lowInventory.length} items low on stock. Amul Butter is projected to stock out in 1.1 days.`}
          priority="high"
          actions={[
            { label: 'Generate PO', onClick: () => console.log('Generate PO'), primary: true },
            { label: 'View Inventory', onClick: () => console.log('View') }
          ]}
        />
        <RecommendationCard
          title="Kitchen Bottleneck: Tandoor"
          description="Tandoor station expects a 40% surge in orders. 4 paneer dishes already queued."
          priority="medium"
          actions={[
            { label: 'Reallocate Staff', onClick: () => console.log('Reallocate'), primary: true }
          ]}
        />
        <RecommendationCard
          title="Dinner Rush Projection"
          description="Based on prior Tuesdays and current weather, expect ₹32,000 revenue tonight."
          metric="₹32k"
          metricLabel="Est. Revenue"
          priority="low"
          actions={[
            { label: 'View Forecast', onClick: () => console.log('View'), primary: true }
          ]}
        />
      </div>

      {/* Visual Analytics / Operations Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Chart (Placeholder) */}
        <Card className="col-span-1 lg:col-span-2 flex flex-col">
          <CardHeader title="Sales Performance" subtitle="Revenue trends today" />
          <div className="flex-1 mt-4">
            <SalesChart data={hourlySales} height={280} />
          </div>
        </Card>

        {/* AI Insight Feed */}
        <Card>
          <CardHeader
            title="NORA Insights"
            action={<Link href="/ai/nora" className="text-sm font-medium text-nora-accent hover:underline">Chat</Link>}
          />
          <div className="space-y-4">
            {mockAiInsights.slice(0, 4).map(insight => (
              <div key={insight.id} className="pb-4 border-b border-nora-border last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <AiInsightChip
                    text={insight.category.charAt(0).toUpperCase() + insight.category.slice(1)}
                    type={insight.type}
                  />
                  <span className="text-xs text-nora-muted ml-auto">{timeAgo(insight.createdAt)}</span>
                </div>
                <p className="text-sm text-nora-text font-medium leading-snug">{insight.insight}</p>
                {insight.actionable && (
                  <button className="mt-2 text-xs font-semibold text-nora-accent hover:text-indigo-700 flex items-center gap-1">
                    Take Action <ArrowRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Orders List */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader
            title="Active & Recent Orders"
            action={<Link href="/orders" className="text-sm font-medium text-nora-accent hover:underline">View All</Link>}
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-nora-muted uppercase bg-nora-bg rounded-t-lg">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="border-b border-nora-border last:border-0 hover:bg-nora-bg/30 transition-colors">
                    <td className="px-4 py-3 font-medium">{order.id}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-nora-muted">{timeAgo(order.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/orders/${order.id}`} className="text-nora-accent hover:underline font-medium text-xs">
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Inventory Quick View */}
        <Card>
          <CardHeader
            title="Inventory Alerts"
            action={<Link href="/inventory" className="text-sm font-medium text-nora-accent hover:underline">Manage</Link>}
          />
          <div className="space-y-3">
            {lowInventory.length > 0 ? (
              lowInventory.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-nora-bg flex items-center justify-center font-medium text-xs text-nora-secondary">
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-nora-text leading-tight">{item.name}</div>
                      <div className="text-xs text-nora-danger flex items-center gap-1">
                        <AlertTriangle size={10} /> Low Stock
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{item.quantity} {item.unit}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-sm text-nora-secondary flex flex-col items-center gap-2">
                <CheckCircle2 className="text-nora-success" size={24} />
                All inventory levels are healthy
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Grid Row 3: Kitchen & Delivery & Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Kitchen Status */}
        <Card>
          <CardHeader
            title="Kitchen Load"
            action={<Link href="/kitchen" className="text-sm font-medium text-nora-accent hover:underline">Kitchen Display</Link>}
          />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-nora-bg p-3 rounded-lg border border-nora-border">
                <div className="text-sm text-nora-muted font-medium mb-1">Items in Prep</div>
                <div className="text-2xl font-bold tracking-tight">{itemsInPrep}</div>
              </div>
              <div className="bg-nora-bg p-3 rounded-lg border border-nora-border">
                <div className="text-sm text-nora-muted font-medium mb-1">Avg Prep Time</div>
                <div className="text-2xl font-bold tracking-tight text-nora-success">{avgPrepTime}</div>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span>Tandoor Station</span>
                  <span className="text-nora-danger">82% Load</span>
                </div>
                <div className="w-full bg-nora-border rounded-full h-2 overflow-hidden">
                  <div className="bg-nora-danger h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span>Curry Station</span>
                  <span className="text-nora-amber">65% Load</span>
                </div>
                <div className="w-full bg-nora-border rounded-full h-2 overflow-hidden">
                  <div className="bg-nora-amber h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1 font-medium">
                  <span>Beverage & Dessert</span>
                  <span className="text-nora-success">25% Load</span>
                </div>
                <div className="w-full bg-nora-border rounded-full h-2 overflow-hidden">
                  <div className="bg-nora-success h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Menu Performance */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader
            title="Menu Performance"
            subtitle="Top moving items today"
            action={<Link href="/menu" className="text-sm font-medium text-nora-accent hover:underline">Full Menu</Link>}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menu.filter(m => m.available).slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 bg-nora-bg/50 border border-nora-border rounded-lg">
                <div className="w-12 h-12 rounded flex items-center justify-center font-bold text-nora-secondary bg-nora-border shrink-0">
                  {item.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                  <div className="text-xs text-nora-muted">{item.category}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-sm text-nora-text">{formatCurrency(item.price)}</div>
                  <div className="text-[10px] text-nora-success font-medium flex items-center justify-end gap-0.5">
                    <TrendingUp size={10} /> +12%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

      {/* Grid Row 4: Delivery & Customers & Sentiment */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Delivery Status */}
        <Card>
          <CardHeader
            title="Delivery Fleet"
            action={<Link href="/delivery" className="text-sm font-medium text-nora-accent hover:underline">Map</Link>}
          />
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 bg-nora-bg border border-nora-border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-nora-success animate-pulse" /> Active Riders
              </div>
              <span className="font-bold">4</span>
            </div>

            <div className="space-y-3">
              {[
                { driver: 'Rahul S.', status: 'In Transit', time: '12m away', dest: 'Sector 44' },
                { driver: 'Amit p.', status: 'At Restaurant', time: 'Waiting', dest: 'Sector 30' },
                { driver: 'Vikram M.', status: 'Delivering', time: '2m away', dest: 'Mg Road' }
              ].map((fleet, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-medium text-xs">
                      {fleet.driver.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{fleet.driver}</div>
                      <div className="text-[10px] text-nora-muted flex items-center gap-0.5">
                        <MapPin size={10} /> {fleet.dest}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium text-nora-accent bg-nora-accent-lt px-1.5 py-0.5 rounded">{fleet.status}</span>
                    <div className="text-[10px] text-nora-secondary mt-1">{fleet.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Guest Sentiment */}
        <Card>
          <CardHeader
            title="Guest Sentiment"
            action={<Link href="/ai/sentiment" className="text-sm font-medium text-nora-accent hover:underline">Details</Link>}
          />
          <div className="flex flex-col items-center justify-center mb-6 mt-2">
            <div className="w-20 h-20 rounded-full border-4 border-nora-success flex items-center justify-center shadow-inner relative">
              <SmilePlus className="text-nora-success opacity-20 absolute w-10 h-10" />
              <span className="text-2xl font-bold text-nora-text relative z-10">88%</span>
            </div>
            <div className="text-sm font-medium mt-3 text-nora-success">Positive Trending</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-nora-muted uppercase tracking-wider mb-2">Top Topics</div>
            <div className="flex justify-between items-center text-sm border-b border-nora-border pb-1">
              <span>Food Quality</span>
              <span className="text-nora-success font-medium">92%</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-nora-border pb-1">
              <span>Portion Size</span>
              <span className="text-nora-success font-medium">85%</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-nora-border pb-1">
              <span>Delivery Space</span>
              <span className="text-nora-amber font-medium">64%</span>
            </div>
          </div>
        </Card>

        {/* Customer Base Overview */}
        <Card>
          <CardHeader
            title="Customer Segments"
            action={<Link href="/customers" className="text-sm font-medium text-nora-accent hover:underline">CRM</Link>}
          />
          <div className="flex flex-col gap-3 mt-2">
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>VIP (High LTV)</span>
                <span>28%</span>
              </div>
              <div className="w-full bg-nora-border rounded-full h-2 overflow-hidden">
                <div className="bg-nora-accent h-2 rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>Regulars</span>
                <span>45%</span>
              </div>
              <div className="w-full bg-nora-border rounded-full h-2 overflow-hidden">
                <div className="bg-coral h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>New Walk-ins</span>
                <span>20%</span>
              </div>
              <div className="w-full bg-nora-border rounded-full h-2 overflow-hidden">
                <div className="bg-nora-success h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>At Risk (No recent visits)</span>
                <span>7%</span>
              </div>
              <div className="w-full bg-nora-border rounded-full h-2 overflow-hidden">
                <div className="bg-nora-danger h-2 rounded-full" style={{ width: '7%' }}></div>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 py-2 bg-nora-bg border border-nora-border rounded-lg text-sm font-medium text-nora-secondary hover:text-nora-text transition-colors">
            Run Win-back Campaign
          </button>
        </Card>
      </div>
    </div>
  );
}
