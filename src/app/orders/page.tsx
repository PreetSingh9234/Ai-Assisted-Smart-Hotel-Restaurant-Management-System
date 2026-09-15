"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AiInsightChip } from '@/components/ui/AiInsightChip';
import { Search, Filter, ArrowUpDown, Eye, Clock, ShoppingBag, CheckCircle2, XCircle, AlertTriangle, Truck } from 'lucide-react';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { mockOrders } from '@/data/mock';
import Link from 'next/link';

const STATUS_TABS = ['All', 'New', 'Preparing', 'Ready', 'Delivered', 'Delayed', 'Cancelled'] as const;
type StatusTab = (typeof STATUS_TABS)[number];

const statusIcons: Record<string, React.ElementType> = {
  All: ShoppingBag,
  New: Clock,
  Preparing: Clock,
  Ready: CheckCircle2,
  Delivered: Truck,
  Delayed: AlertTriangle,
  Cancelled: XCircle,
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'createdAt' | 'totalAmount'>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filteredOrders = useMemo(() => {
    let orders = [...mockOrders];

    // Tab filter
    if (activeTab !== 'All') {
      orders = orders.filter(o => o.status === activeTab);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      orders = orders.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.items.some(item => item.name.toLowerCase().includes(q))
      );
    }

    // Sort
    orders.sort((a, b) => {
      if (sortField === 'createdAt') {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return sortDir === 'desc' ? diff : -diff;
      }
      const diff = b.totalAmount - a.totalAmount;
      return sortDir === 'desc' ? diff : -diff;
    });

    return orders;
  }, [activeTab, searchQuery, sortField, sortDir]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { All: mockOrders.length };
    mockOrders.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, []);

  const toggleSort = (field: 'createdAt' | 'totalAmount') => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight">Order Management</h1>
          <p className="text-nora-muted">Track, manage, and analyze all restaurant orders.</p>
        </div>
        <AiInsightChip
          text={`${mockOrders.filter(o => o.status === 'Delayed').length > 0 ? mockOrders.filter(o => o.status === 'Delayed').length + ' delayed orders need attention' : 'All orders on track'}`}
          type={mockOrders.filter(o => o.status === 'Delayed').length > 0 ? 'warning' : 'positive'}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-bg flex items-center justify-center text-nora-secondary">
            <ShoppingBag size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{mockOrders.length}</div>
            <div className="text-xs text-nora-muted font-medium">Total Orders</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-success/10 flex items-center justify-center text-nora-success">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{mockOrders.filter(o => o.status === 'Delivered').length}</div>
            <div className="text-xs text-nora-muted font-medium">Delivered</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-accent-lt flex items-center justify-center text-nora-accent">
            <Clock size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{mockOrders.filter(o => ['New', 'Preparing'].includes(o.status)).length}</div>
            <div className="text-xs text-nora-muted font-medium">Active</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-amber/10 flex items-center justify-center text-nora-amber">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{mockOrders.filter(o => o.status === 'Delayed').length}</div>
            <div className="text-xs text-nora-muted font-medium">Delayed</div>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card noPadding>
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-nora-border px-4 gap-1">
          {STATUS_TABS.map(tab => {
            const Icon = statusIcons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-nora-accent text-nora-accent'
                    : 'border-transparent text-nora-muted hover:text-nora-text'
                }`}
              >
                <Icon size={14} />
                {tab}
                {tabCounts[tab] !== undefined && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab ? 'bg-nora-accent-lt text-nora-accent' : 'bg-nora-bg text-nora-muted'
                  }`}>
                    {tabCounts[tab] || 0}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-3 border-b border-nora-border">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nora-muted" />
            <input
              type="text"
              placeholder="Search orders by ID, customer, or item..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-nora-bg border border-nora-border rounded-lg focus:outline-none focus:ring-2 focus:ring-nora-accent/20 focus:border-nora-accent transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSort('createdAt')}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                sortField === 'createdAt' ? 'bg-nora-accent-lt border-nora-accent/20 text-nora-accent' : 'bg-nora-bg border-nora-border text-nora-secondary hover:text-nora-text'
              }`}
            >
              <ArrowUpDown size={12} /> Time {sortField === 'createdAt' && (sortDir === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => toggleSort('totalAmount')}
              className={`flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                sortField === 'totalAmount' ? 'bg-nora-accent-lt border-nora-accent/20 text-nora-accent' : 'bg-nora-bg border-nora-border text-nora-secondary hover:text-nora-text'
              }`}
            >
              <ArrowUpDown size={12} /> Amount {sortField === 'totalAmount' && (sortDir === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-nora-muted uppercase bg-nora-bg/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-nora-muted">
                    <Filter size={24} className="mx-auto mb-2 opacity-40" />
                    <div className="font-medium">No orders found</div>
                    <div className="text-xs mt-1">Try adjusting your filters or search query.</div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-nora-border last:border-0 hover:bg-nora-bg/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-nora-text">{order.id}</td>
                    <td className="px-4 py-3 text-nora-secondary">{order.customerName}</td>
                    <td className="px-4 py-3 text-nora-secondary">
                      <span className="truncate block max-w-[200px]">
                        {order.items.map(i => i.name).join(', ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(order.totalAmount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-nora-muted text-xs">{timeAgo(order.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/orders/${order.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-nora-accent hover:underline"
                      >
                        <Eye size={12} /> View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
