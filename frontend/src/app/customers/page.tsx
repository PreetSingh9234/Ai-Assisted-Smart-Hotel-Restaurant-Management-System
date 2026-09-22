"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AiInsightChip } from '@/components/ui/AiInsightChip';
import { Search, Users, TrendingUp, Heart, AlertTriangle, ArrowUpDown, Eye, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockCustomers } from '@/data/mock';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type CustomerSegment = 'All' | 'VIP' | 'Regular' | 'New' | 'At Risk';

const segments: CustomerSegment[] = ['All', 'VIP', 'Regular', 'New', 'At Risk'];

const segmentColors: Record<string, string> = {
  'VIP': 'bg-purple-50 text-purple-700 border-purple-200',
  'Regular': 'bg-blue-50 text-blue-700 border-blue-200',
  'New': 'bg-green-50 text-green-700 border-green-200',
  'At Risk': 'bg-red-50 text-red-700 border-red-200',
};

export default function CustomersPage() {
  const [activeSegment, setActiveSegment] = useState<CustomerSegment>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'ordersCount' | 'totalSpend'>('totalSpend');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filteredCustomers = useMemo(() => {
    let customers = [...mockCustomers];

    if (activeSegment !== 'All') {
      customers = customers.filter(c => c.segment === activeSegment);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      customers = customers.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.favoriteDish?.toLowerCase().includes(q) ||
        c.segment.toLowerCase().includes(q)
      );
    }

    customers.sort((a, b) => {
      let diff = 0;
      if (sortField === 'name') diff = a.name.localeCompare(b.name);
      else if (sortField === 'ordersCount') diff = a.ordersCount - b.ordersCount;
      else if (sortField === 'totalSpend') diff = a.totalSpend - b.totalSpend;
      return sortDir === 'desc' ? -diff : diff;
    });

    return customers;
  }, [activeSegment, searchQuery, sortField, sortDir]);

  const stats = useMemo(() => {
    const vip = mockCustomers.filter(c => c.segment === 'VIP').length;
    const regular = mockCustomers.filter(c => c.segment === 'Regular').length;
    const newCust = mockCustomers.filter(c => c.segment === 'New').length;
    const atRisk = mockCustomers.filter(c => c.segment === 'At Risk').length;
    const totalSpend = mockCustomers.reduce((sum, c) => sum + c.totalSpend, 0);
    const avgSpend = totalSpend / mockCustomers.length;

    return { vip, regular, new: newCust, atRisk, totalSpend, avgSpend };
  }, []);

  const toggleSort = (field: typeof sortField) => {
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
          <h1 className="text-2xl font-bold text-nora-text tracking-tight">Customer Relationship Management</h1>
          <p className="text-nora-muted">Track customer segments, loyalty, and engagement patterns.</p>
        </div>
        <div className="flex items-center gap-2">
          {stats.atRisk > 0 && (
            <AiInsightChip text={`${stats.atRisk} customers at risk — launch win-back campaign`} type="warning" />
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-accent-lt flex items-center justify-center text-nora-accent">
            <Users size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{mockCustomers.length}</div>
            <div className="text-xs text-nora-muted font-medium">Total Customers</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-700">
            <Heart size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.vip}</div>
            <div className="text-xs text-nora-muted font-medium">VIP Members</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-success/10 flex items-center justify-center text-nora-success">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{formatCurrency(stats.avgSpend)}</div>
            <div className="text-xs text-nora-muted font-medium">Avg Lifetime Value</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-danger/10 flex items-center justify-center text-nora-danger">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.atRisk}</div>
            <div className="text-xs text-nora-muted font-medium">At Risk</div>
          </div>
        </Card>
      </div>

      {/* At Risk Alert */}
      {stats.atRisk > 0 && (
        <Card className="!bg-nora-amber-lt !border-nora-amber/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-nora-amber shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <div className="font-semibold text-nora-amber mb-1">Win-Back Opportunity</div>
              <div className="text-sm text-nora-text">
                <strong>{stats.atRisk} customers</strong> haven&apos;t visited in 30+ days. Consider launching a targeted win-back campaign with personalized offers based on their favorite dishes.
              </div>
            </div>
            <button className="px-3 py-1.5 bg-nora-amber text-white rounded text-xs font-medium hover:bg-nora-amber/90 transition-colors shrink-0">
              Launch Campaign
            </button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card noPadding>
        {/* Segment Tabs */}
        <div className="flex overflow-x-auto border-b border-nora-border px-4 gap-1">
          {segments.map(seg => (
            <button
              key={seg}
              onClick={() => setActiveSegment(seg)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeSegment === seg
                  ? "border-nora-accent text-nora-accent"
                  : "border-transparent text-nora-muted hover:text-nora-text"
              )}
            >
              {seg}
              {seg !== 'All' && (
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  activeSegment === seg ? "bg-nora-accent-lt text-nora-accent" : "bg-nora-bg text-nora-muted"
                )}>
                  {seg === 'VIP' ? stats.vip : seg === 'Regular' ? stats.regular : seg === 'New' ? stats.new : stats.atRisk}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-3 border-b border-nora-border">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nora-muted" />
            <input
              type="text"
              placeholder="Search customers by name, dish, or segment..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-nora-bg border border-nora-border rounded-lg focus:outline-none focus:ring-2 focus:ring-nora-accent/20 focus:border-nora-accent transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSort('name')}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors",
                sortField === 'name' ? "bg-nora-accent-lt border-nora-accent/20 text-nora-accent" : "bg-nora-bg border-nora-border text-nora-secondary hover:text-nora-text"
              )}
            >
              <ArrowUpDown size={12} /> Name {sortField === 'name' && (sortDir === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => toggleSort('ordersCount')}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors",
                sortField === 'ordersCount' ? "bg-nora-accent-lt border-nora-accent/20 text-nora-accent" : "bg-nora-bg border-nora-border text-nora-secondary hover:text-nora-text"
              )}
            >
              <ArrowUpDown size={12} /> Orders {sortField === 'ordersCount' && (sortDir === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => toggleSort('totalSpend')}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border transition-colors",
                sortField === 'totalSpend' ? "bg-nora-accent-lt border-nora-accent/20 text-nora-accent" : "bg-nora-bg border-nora-border text-nora-secondary hover:text-nora-text"
              )}
            >
              <ArrowUpDown size={12} /> Spend {sortField === 'totalSpend' && (sortDir === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-nora-muted uppercase bg-nora-bg/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Segment</th>
                <th className="px-4 py-3 font-semibold">Orders</th>
                <th className="px-4 py-3 font-semibold">Total Spend</th>
                <th className="px-4 py-3 font-semibold">Favorite Dish</th>
                <th className="px-4 py-3 font-semibold">Last Order</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-nora-muted">
                    <Users size={24} className="mx-auto mb-2 opacity-40" />
                    <div className="font-medium">No customers found</div>
                    <div className="text-xs mt-1">Try adjusting your filters or search query.</div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-nora-border last:border-0 hover:bg-nora-bg/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-nora-accent-lt flex items-center justify-center font-bold text-sm text-nora-accent">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-nora-text">{customer.name}</div>
                          <div className="text-xs text-nora-muted">ID: {customer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
                        segmentColors[customer.segment]
                      )}>
                        {customer.segment}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{customer.ordersCount}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(customer.totalSpend)}</td>
                    <td className="px-4 py-3 text-nora-secondary">{customer.favoriteDish || '—'}</td>
                    <td className="px-4 py-3 text-nora-muted text-xs">{formatDate(customer.lastOrderAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/customers/${customer.id}`}
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

      {/* Segment Distribution */}
      <Card>
        <CardHeader title="Customer Segment Distribution" subtitle="Distribution across lifecycle stages" />
        <div className="space-y-3">
          {[
            { segment: 'VIP (High LTV)', count: stats.vip, percentage: Math.round((stats.vip / mockCustomers.length) * 100), colorClass: 'bg-nora-accent' },
            { segment: 'Regulars', count: stats.regular, percentage: Math.round((stats.regular / mockCustomers.length) * 100), colorClass: 'bg-coral' },
            { segment: 'New Walk-ins', count: stats.new, percentage: Math.round((stats.new / mockCustomers.length) * 100), colorClass: 'bg-nora-success' },
            { segment: 'At Risk', count: stats.atRisk, percentage: Math.round((stats.atRisk / mockCustomers.length) * 100), colorClass: 'bg-nora-danger' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span>{item.segment}</span>
                <span>{item.percentage}% ({item.count} customers)</span>
              </div>
              <div className="w-full bg-nora-border rounded-full h-2 overflow-hidden">
                <div
                  className={cn("h-2 rounded-full transition-all duration-500", item.colorClass)}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
