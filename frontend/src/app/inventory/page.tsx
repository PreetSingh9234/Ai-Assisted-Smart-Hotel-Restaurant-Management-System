"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AiInsightChip } from '@/components/ui/AiInsightChip';
import { Search, AlertTriangle, TrendingDown, Package, FileText, ArrowUpDown } from 'lucide-react';
import { mockInventory } from '@/data/mock';
import { cn } from '@/lib/utils';

type InventoryStatus = 'All' | 'Normal' | 'Low' | 'Critical';

const statusTabs: InventoryStatus[] = ['All', 'Normal', 'Low', 'Critical'];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<InventoryStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'name' | 'quantity' | 'dailyUsage'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredItems = useMemo(() => {
    let items = [...mockInventory];

    if (activeTab !== 'All') {
      items = items.filter(i => i.status === activeTab);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.unit.toLowerCase().includes(q));
    }

    items.sort((a, b) => {
      let diff = 0;
      if (sortField === 'name') diff = a.name.localeCompare(b.name);
      else if (sortField === 'quantity') diff = a.quantity - b.quantity;
      else if (sortField === 'dailyUsage') diff = a.dailyUsage - b.dailyUsage;
      return sortDir === 'asc' ? diff : -diff;
    });

    return items;
  }, [activeTab, searchQuery, sortField, sortDir]);

  const stats = useMemo(() => {
    const critical = mockInventory.filter(i => i.status === 'Critical').length;
    const low = mockInventory.filter(i => i.status === 'Low').length;
    const normal = mockInventory.filter(i => i.status === 'Normal').length;
    return { critical, low, normal, total: mockInventory.length };
  }, []);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Calculate days until stockout
  const getDaysRemaining = (quantity: number, dailyUsage: number) => {
    if (dailyUsage === 0) return '—';
    const days = Math.floor(quantity / dailyUsage);
    return days === 0 ? '<1 day' : `${days} days`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight">Inventory Management</h1>
          <p className="text-nora-muted">Monitor stock levels, track usage, and manage suppliers.</p>
        </div>
        <div className="flex items-center gap-2">
          {stats.critical > 0 && (
            <AiInsightChip text={`${stats.critical} items critical — generate PO now`} type="warning" />
          )}
          <button className="flex items-center gap-1.5 px-4 py-2 bg-nora-accent text-white rounded-lg font-medium text-sm hover:bg-nora-accent/90 transition-colors">
            <FileText size={16} /> Generate PO
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-bg flex items-center justify-center text-nora-secondary">
            <Package size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.total}</div>
            <div className="text-xs text-nora-muted font-medium">Total Items</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-success/10 flex items-center justify-center text-nora-success">
            <Package size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.normal}</div>
            <div className="text-xs text-nora-muted font-medium">Normal</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-amber/10 flex items-center justify-center text-nora-amber">
            <TrendingDown size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.low}</div>
            <div className="text-xs text-nora-muted font-medium">Low Stock</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-danger/10 flex items-center justify-center text-nora-danger">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.critical}</div>
            <div className="text-xs text-nora-muted font-medium">Critical</div>
          </div>
        </Card>
      </div>

      {/* Critical Alert Banner */}
      {stats.critical > 0 && (
        <Card className="!bg-nora-danger-lt !border-nora-danger/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-nora-danger shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <div className="font-semibold text-nora-danger mb-1">Critical Stock Alert</div>
              <div className="text-sm text-nora-text">
                <strong>{stats.critical} items</strong> are critically low. Amul Butter is projected to stock out in <strong>1.1 days</strong> at current usage rates. Consider generating a purchase order immediately.
              </div>
            </div>
            <button className="px-3 py-1.5 bg-nora-danger text-white rounded text-xs font-medium hover:bg-nora-danger/90 transition-colors shrink-0">
              Generate PO
            </button>
          </div>
        </Card>
      )}

      {/* Filter Bar */}
      <Card noPadding>
        {/* Status Tabs */}
        <div className="flex overflow-x-auto border-b border-nora-border px-4 gap-1">
          {statusTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab
                  ? "border-nora-accent text-nora-accent"
                  : "border-transparent text-nora-muted hover:text-nora-text"
              )}
            >
              {tab}
              {tab !== 'All' && (
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  activeTab === tab ? "bg-nora-accent-lt text-nora-accent" : "bg-nora-bg text-nora-muted"
                )}>
                  {tab === 'Normal' ? stats.normal : tab === 'Low' ? stats.low : stats.critical}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-nora-border">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nora-muted" />
            <input
              type="text"
              placeholder="Search inventory items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-nora-bg border border-nora-border rounded-lg focus:outline-none focus:ring-2 focus:ring-nora-accent/20 focus:border-nora-accent transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-nora-muted uppercase bg-nora-bg/50">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  <button onClick={() => toggleSort('name')} className="flex items-center gap-1 hover:text-nora-text">
                    Item {sortField === 'name' && <ArrowUpDown size={12} />}
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <button onClick={() => toggleSort('quantity')} className="flex items-center gap-1 hover:text-nora-text">
                    Stock {sortField === 'quantity' && <ArrowUpDown size={12} />}
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold">
                  <button onClick={() => toggleSort('dailyUsage')} className="flex items-center gap-1 hover:text-nora-text">
                    Daily Usage {sortField === 'dailyUsage' && <ArrowUpDown size={12} />}
                  </button>
                </th>
                <th className="px-4 py-3 font-semibold">Days Remaining</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-nora-muted">
                    <Package size={24} className="mx-auto mb-2 opacity-40" />
                    <div className="font-medium">No items found</div>
                    <div className="text-xs mt-1">Try adjusting your filters or search query.</div>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id} className={cn(
                    "border-b border-nora-border last:border-0 hover:bg-nora-bg/30 transition-colors",
                    item.status === 'Critical' && "bg-nora-danger-lt/20"
                  )}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-nora-border flex items-center justify-center font-medium text-xs text-nora-secondary">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-nora-text">{item.name}</div>
                          <div className="text-xs text-nora-muted">SKU: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className={cn(
                        "font-medium",
                        item.status === 'Critical' ? 'text-nora-danger' : item.status === 'Low' ? 'text-nora-amber' : 'text-nora-text'
                      )}>
                        {item.quantity} {item.unit}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-nora-secondary">{item.dailyUsage} {item.unit}/day</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "font-medium",
                        item.status === 'Critical' ? 'text-nora-danger' : item.status === 'Low' ? 'text-nora-amber' : 'text-nora-secondary'
                      )}>
                        {getDaysRemaining(item.quantity, item.dailyUsage)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={item.status}
                        type={item.status === 'Critical' ? 'danger' : item.status === 'Low' ? 'warning' : 'success'}
                        icon
                      />
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
