"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useNora } from '@/context/NoraContext';
import { Sparkles, AlertTriangle, TrendingUp, CheckCircle, ArrowRight, RefreshCw, ChefHat, Package, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AiInsightsPage() {
  const { openDrawer } = useNora();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchInsights = async () => {
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
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight flex items-center gap-2">
            <Sparkles className="text-coral" /> NORA AI Insights & Recommendations
          </h1>
          <p className="text-nora-muted text-sm">Automated intelligence, proactive anomaly alerts, and actionable recommendations.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openDrawer("Give me an operational summary of our restaurant right now")}
            className="flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-lg text-sm font-semibold hover:bg-coral-dark transition-colors shadow-sm"
          >
            <Sparkles size={15} /> Ask NORA Live
          </button>
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-nora-border rounded-lg text-sm font-medium text-nora-text hover:bg-gray-50 transition-colors shadow-sm"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Priority Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Inventory Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
              <AlertTriangle size={16} className="text-amber-600" />
              INVENTORY DEPLETION ALERT
            </div>
            <p className="text-sm text-amber-900 leading-relaxed">
              {data?.inventory?.criticalCount > 0 ? (
                <>Found <strong>{data.inventory.criticalCount} Critical items</strong> ({data.inventory.critical.map((i: any) => i.name).join(', ')}) nearing stock out within 24-48 hours.</>
              ) : (
                <>Inventory levels are currently within safe buffer margins.</>
              )}
            </p>
          </div>
          <button
            onClick={() => openDrawer("Which inventory items should I order today and why?")}
            className="mt-4 text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1"
          >
            Ask NORA for purchase plan <ArrowRight size={12} />
          </button>
        </div>

        {/* Kitchen Bottleneck Warning */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm mb-2">
              <ChefHat size={16} className="text-blue-600" />
              KITCHEN LOAD BALANCING
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              Active order queue has <strong>{data?.orders?.active ?? 0} orders</strong>.
              {data?.orders?.delayed > 0 ? (
                <> Warning: <strong>{data.orders.delayed} orders</strong> are past target delivery SLA.</>
              ) : (
                <> Prep times are tracking smoothly within the 18-minute SLA target.</>
              )}
            </p>
          </div>
          <button
            onClick={() => openDrawer("How is our kitchen queue performing and are there any delays?")}
            className="mt-4 text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1"
          >
            Analyze kitchen stations <ArrowRight size={12} />
          </button>
        </div>

        {/* Revenue Growth Opportunity */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
              <TrendingUp size={16} className="text-emerald-600" />
              REVENUE MOMENTUM
            </div>
            <p className="text-sm text-emerald-900 leading-relaxed">
              Today&apos;s run-rate stands at <strong>{formatCurrency(data?.revenue?.today ?? 0)}</strong>. Dinner rush typically drives 40% of revenue between 7:30 PM and 9:45 PM.
            </p>
          </div>
          <button
            onClick={() => openDrawer("What is our projected dinner revenue and how can we maximize it?")}
            className="mt-4 text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            Get dinner projection <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {/* Customer Segmentation & Retention Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Customer Base Segmentation"
            description="LTV and churn risk classification"
          />
          <div className="p-4 pt-0 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {data?.customers?.segments?.map((seg: any) => (
                <div key={seg.segment} className="p-3 bg-nora-bg border border-nora-border rounded-lg">
                  <p className="text-xs text-nora-muted font-medium">{seg.segment}</p>
                  <p className="text-xl font-bold text-nora-text mt-1">{seg.count}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-nora-secondary">
              <p className="font-semibold text-nora-text mb-1">💡 Retention Recommendation:</p>
              Target <strong>At Risk</strong> customers with an automated WhatsApp campaign offering their favorite dish with a 15% incentive to reclaim visits.
            </div>
          </div>
        </Card>

        {/* Proactive Stock Reorder Checklist */}
        <Card>
          <CardHeader
            title="Immediate Stock Replenishment"
            description="Items flagged by algorithm based on burn-rate"
          />
          <div className="p-4 pt-0">
            <div className="divide-y divide-nora-border">
              {data?.inventory?.critical?.concat(data?.inventory?.low || [])?.slice(0, 5).map((item: any) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusBadge
                      status={item.status}
                      type={item.status === 'Critical' ? 'danger' : 'warning'}
                    />
                    <div>
                      <p className="font-semibold text-sm text-nora-text">{item.name}</p>
                      <span className="text-xs text-nora-muted">Burn rate: {item.dailyUsage} {item.unit}/day</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-nora-text">{item.quantity} {item.unit}</span>
                    <p className="text-[11px] text-nora-muted">remaining</p>
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
