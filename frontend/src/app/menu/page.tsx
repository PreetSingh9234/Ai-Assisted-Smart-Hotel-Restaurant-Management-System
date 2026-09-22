"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AiInsightChip } from '@/components/ui/AiInsightChip';
import { Search, Plus, Filter, MoreVertical, Edit, Trash2, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { mockMenuItems } from '@/data/mock';
import { cn } from '@/lib/utils';

type MenuCategory = 'All' | 'Pizza' | 'Indian Main Course' | 'Starters' | 'Burgers' | 'Desserts' | 'Beverages';

const categories: MenuCategory[] = ['All', 'Pizza', 'Indian Main Course', 'Starters', 'Burgers', 'Desserts', 'Beverages'];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredItems = useMemo(() => {
    let items = [...mockMenuItems];

    if (activeCategory !== 'All') {
      items = items.filter(i => i.category === activeCategory);
    }

    if (showAvailableOnly) {
      items = items.filter(i => i.available);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }

    return items;
  }, [activeCategory, searchQuery, showAvailableOnly]);

  const stats = useMemo(() => {
    return {
      total: mockMenuItems.length,
      available: mockMenuItems.filter(i => i.available).length,
      unavailable: mockMenuItems.filter(i => !i.available).length,
      avgRating: (mockMenuItems.reduce((sum, i) => sum + i.rating, 0) / mockMenuItems.length).toFixed(1),
    };
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight">Menu Management</h1>
          <p className="text-nora-muted">Manage dishes, pricing, availability, and performance.</p>
        </div>
        <div className="flex items-center gap-2">
          <AiInsightChip text="3 items underperforming this week" type="warning" />
          <button className="flex items-center gap-1.5 px-4 py-2 bg-nora-accent text-white rounded-lg font-medium text-sm hover:bg-nora-accent/90 transition-colors">
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-bg flex items-center justify-center text-nora-secondary">
            <Filter size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.total}</div>
            <div className="text-xs text-nora-muted font-medium">Total Items</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-success/10 flex items-center justify-center text-nora-success">
            <TrendingUp size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.available}</div>
            <div className="text-xs text-nora-muted font-medium">Available</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-danger/10 flex items-center justify-center text-nora-danger">
            <TrendingDown size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.unavailable}</div>
            <div className="text-xs text-nora-muted font-medium">Unavailable</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-amber/10 flex items-center justify-center text-nora-amber">
            <Star size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{stats.avgRating}</div>
            <div className="text-xs text-nora-muted font-medium">Avg Rating</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card noPadding>
        {/* Category Tabs */}
        <div className="flex overflow-x-auto border-b border-nora-border px-4 gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeCategory === cat
                  ? "border-nora-accent text-nora-accent"
                  : "border-transparent text-nora-muted hover:text-nora-text"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-4 py-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-nora-muted" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-nora-bg border border-nora-border rounded-lg focus:outline-none focus:ring-2 focus:ring-nora-accent/20 focus:border-nora-accent transition-colors"
            />
          </div>
          <label className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-nora-border cursor-pointer hover:bg-nora-bg transition-colors">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={e => setShowAvailableOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded accent-nora-accent"
            />
            Available Only
          </label>
        </div>
      </Card>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12 text-nora-muted">
            <Filter size={32} className="mx-auto mb-3 opacity-30" />
            <div className="font-medium">No items found</div>
            <div className="text-xs mt-1">Try adjusting your filters or search query.</div>
          </div>
        ) : (
          filteredItems.map(item => (
            <Card key={item.id} className="group hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-nora-border flex items-center justify-center font-bold text-sm text-nora-secondary">
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-nora-text">{item.name}</h3>
                    <div className="text-xs text-nora-muted">{item.category}</div>
                  </div>
                </div>
                <button className="w-6 h-6 rounded flex items-center justify-center text-nora-muted hover:bg-nora-bg transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-xl font-bold text-nora-text">{formatCurrency(item.price)}</div>
                <div className="flex items-center gap-1 text-xs">
                  <Star size={12} className="text-nora-amber fill-nora-amber" />
                  <span className="font-medium">{item.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-nora-border">
                <StatusBadge status={item.available ? 'Available' : 'Out of Stock'} type={item.available ? 'success' : 'danger'} />
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded flex items-center justify-center text-nora-accent hover:bg-nora-accent-lt transition-colors">
                    <Edit size={14} />
                  </button>
                  <button className="w-7 h-7 rounded flex items-center justify-center text-nora-danger hover:bg-nora-danger-lt transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Performance indicator */}
              <div className="mt-3 pt-3 border-t border-nora-border text-xs">
                <div className="flex items-center justify-between text-nora-secondary">
                  <span>This week</span>
                  <span className="flex items-center gap-1 text-nora-success font-medium">
                    <TrendingUp size={10} /> +12%
                  </span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
