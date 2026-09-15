"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AiInsightChip } from '@/components/ui/AiInsightChip';
import { Clock, Utensils, CheckCircle2, AlertTriangle, ChefHat, Flame, Timer, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockOrders } from '@/data/mock';
import { formatCurrency, timeAgo } from '@/lib/utils';

type KitchenStatus = 'New' | 'Preparing' | 'Ready';

interface KitchenOrder {
  id: string;
  customerName: string;
  items: { name: string; quantity: number }[];
  status: KitchenStatus;
  createdAt: string;
  elapsedMin: number;
  station: string;
  priority: 'normal' | 'rush' | 'delayed';
}

const stationColors: Record<string, string> = {
  'Tandoor': 'bg-red-50 text-red-700 border-red-200',
  'Curry': 'bg-amber-50 text-amber-700 border-amber-200',
  'Grill': 'bg-orange-50 text-orange-700 border-orange-200',
  'Beverage': 'bg-green-50 text-green-700 border-green-200',
  'Dessert': 'bg-purple-50 text-purple-700 border-purple-200',
};

const columns: { key: KitchenStatus; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'New', label: 'New Orders', icon: Clock, color: 'border-nora-accent' },
  { key: 'Preparing', label: 'In Preparation', icon: Flame, color: 'border-nora-amber' },
  { key: 'Ready', label: 'Ready to Serve', icon: CheckCircle2, color: 'border-nora-success' },
];

// Derive kitchen orders from mock data
function buildKitchenOrders(): KitchenOrder[] {
  const stations = ['Tandoor', 'Curry', 'Grill', 'Beverage', 'Dessert'];
  return mockOrders
    .filter(o => ['New', 'Preparing', 'Ready'].includes(o.status))
    .map(o => {
      const elapsed = Math.round((Date.now() - new Date(o.createdAt).getTime()) / 60000);
      return {
        id: o.id,
        customerName: o.customerName,
        items: o.items.map(i => ({ name: i.name, quantity: i.quantity })),
        status: o.status as KitchenStatus,
        createdAt: o.createdAt,
        elapsedMin: elapsed,
        station: stations[Math.floor(Math.random() * 3)], // Assign to first 3 stations primarily
        priority: elapsed > 25 ? 'delayed' : elapsed > 15 ? 'rush' : 'normal',
      };
    });
}

export default function KitchenPage() {
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setKitchenOrders(buildKitchenOrders());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setKitchenOrders(buildKitchenOrders());
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(timer);
  }, []);

  const moveOrder = (orderId: string, to: KitchenStatus) => {
    setKitchenOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: to } : o)
    );
  };

  // Station load data
  const stationLoads = [
    { name: 'Tandoor', load: 82, items: 6, colorClass: { text: 'text-nora-danger', bg: 'bg-nora-danger' } },
    { name: 'Curry', load: 65, items: 4, colorClass: { text: 'text-nora-amber', bg: 'bg-nora-amber' } },
    { name: 'Grill', load: 40, items: 2, colorClass: { text: 'text-nora-success', bg: 'bg-nora-success' } },
    { name: 'Beverage', load: 25, items: 2, colorClass: { text: 'text-nora-success', bg: 'bg-nora-success' } },
    { name: 'Dessert', load: 15, items: 1, colorClass: { text: 'text-nora-success', bg: 'bg-nora-success' } },
  ];

  const totalItemsInPrep = kitchenOrders
    .filter(o => o.status === 'Preparing')
    .reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight">Kitchen Display System</h1>
          <p className="text-nora-muted">Real-time kitchen order management and station monitoring.</p>
        </div>
        <div className="flex items-center gap-3">
          <AiInsightChip
            text={stationLoads[0].load > 75 ? `Tandoor at ${stationLoads[0].load}% — consider reallocation` : 'All stations balanced'}
            type={stationLoads[0].load > 75 ? 'warning' : 'positive'}
          />
          <div className="text-sm text-nora-muted font-medium">
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Station Load Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stationLoads.map(station => (
          <Card key={station.name} className="!p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-nora-muted uppercase tracking-wider">{station.name}</span>
              <span className={cn("text-xs font-bold", station.colorClass.text)}>{station.load}%</span>
            </div>
            <div className="w-full bg-nora-border rounded-full h-1.5 overflow-hidden">
              <div
                className={cn("h-1.5 rounded-full transition-all duration-500", station.colorClass.bg)}
                style={{ width: `${station.load}%` }}
              />
            </div>
            <div className="text-[10px] text-nora-muted mt-1">{station.items} items queued</div>
          </Card>
        ))}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-accent-lt flex items-center justify-center text-nora-accent">
            <Utensils size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{kitchenOrders.length}</div>
            <div className="text-xs text-nora-muted font-medium">Active Orders</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-amber/10 flex items-center justify-center text-nora-amber">
            <Flame size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{totalItemsInPrep}</div>
            <div className="text-xs text-nora-muted font-medium">Items Cooking</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-success/10 flex items-center justify-center text-nora-success">
            <Timer size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">18m</div>
            <div className="text-xs text-nora-muted font-medium">Avg Prep Time</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-danger/10 flex items-center justify-center text-nora-danger">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{kitchenOrders.filter(o => o.priority === 'delayed').length}</div>
            <div className="text-xs text-nora-muted font-medium">Delayed</div>
          </div>
        </Card>
      </div>

      {/* 3-Column Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => {
          const colOrders = kitchenOrders.filter(o => o.status === col.key);
          const Icon = col.icon;
          const nextStatus: KitchenStatus | null =
            col.key === 'New' ? 'Preparing' : col.key === 'Preparing' ? 'Ready' : null;

          return (
            <div key={col.key} className={`border-t-2 ${col.color} rounded-lg`}>
              <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-2">
                  <Icon size={16} className="text-nora-secondary" />
                  <h3 className="font-semibold text-sm text-nora-text">{col.label}</h3>
                </div>
                <span className="text-xs font-bold bg-nora-bg text-nora-muted px-2 py-0.5 rounded-full">
                  {colOrders.length}
                </span>
              </div>

              <div className="space-y-3 p-4 pt-2 min-h-[200px]">
                {colOrders.length === 0 ? (
                  <div className="text-center py-8 text-sm text-nora-muted">
                    <CheckCircle2 size={20} className="mx-auto mb-2 opacity-30" />
                    No orders
                  </div>
                ) : (
                  colOrders.map(order => (
                    <Card key={order.id} className={cn(
                      "!p-3 !rounded-lg",
                      order.priority === 'delayed' && 'ring-1 ring-nora-danger/30 bg-nora-danger-lt/30',
                      order.priority === 'rush' && 'ring-1 ring-nora-amber/30'
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-xs text-nora-text">{order.id}</span>
                        <div className="flex items-center gap-1.5">
                          {order.priority === 'delayed' && (
                            <span className="text-[10px] font-bold text-nora-danger bg-nora-danger-lt px-1.5 py-0.5 rounded">DELAYED</span>
                          )}
                          {order.priority === 'rush' && (
                            <span className="text-[10px] font-bold text-nora-amber bg-nora-amber-lt px-1.5 py-0.5 rounded">RUSH</span>
                          )}
                          <span className={cn(
                            "text-[10px] font-medium px-1.5 py-0.5 rounded border",
                            stationColors[order.station] || 'bg-nora-bg text-nora-secondary border-nora-border'
                          )}>
                            {order.station}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-nora-secondary mb-1">{order.customerName}</div>

                      <div className="space-y-1 mb-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-xs flex items-center justify-between">
                            <span className="text-nora-text">{item.name}</span>
                            <span className="text-nora-muted">×{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-nora-border">
                        <div className="flex items-center gap-1 text-[10px] text-nora-muted">
                          <Clock size={10} />
                          {order.elapsedMin}m ago
                        </div>
                        {nextStatus && (
                          <button
                            onClick={() => moveOrder(order.id, nextStatus)}
                            className="flex items-center gap-1 text-[10px] font-semibold text-nora-accent hover:text-nora-accent/80 transition-colors"
                          >
                            Move <ArrowRight size={10} />
                          </button>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
