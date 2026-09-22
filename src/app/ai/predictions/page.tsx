"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { KpiCard } from '@/components/ui/KpiCard';
import { SalesChart } from '@/components/ui/SalesChart';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useNora } from '@/context/NoraContext';
import { TrendingUp, Sparkles, Clock, Flame, Calendar, Users, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function PredictionsPage() {
  const { openDrawer } = useNora();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(console.error);
  }, []);

  const hourlyForecast = [
    { time: '12 PM', amount: 3200, label: 'Lunch Start' },
    { time: '1 PM', amount: 6800, label: 'Lunch Peak' },
    { time: '2 PM', amount: 5100, label: 'Lunch Wind-down' },
    { time: '4 PM', amount: 2400, label: 'Snack/Beverage' },
    { time: '6 PM', amount: 3900, label: 'Early Dinner' },
    { time: '7 PM', amount: 8400, label: 'Dinner Surge' },
    { time: '8 PM', amount: 11200, label: 'Peak Rush' },
    { time: '9 PM', amount: 9500, label: 'Late Rush' },
    { time: '10 PM', amount: 4200, label: 'Last Calls' },
  ];

  const predictedStockDepletions = [
    { item: 'Chicken Breast', current: '3.0 kg', burnRate: '4.5 kg/day', predictedZero: 'Today, 8:45 PM', confidence: '94%' },
    { item: 'Amul Butter', current: '2.0 kg', burnRate: '1.2 kg/day', predictedZero: 'Tomorrow, 2:30 PM', confidence: '89%' },
    { item: 'Paneer (Fresh)', current: '6.0 kg', burnRate: '2.0 kg/day', predictedZero: 'In 3 days', confidence: '82%' },
    { item: 'Mango Pulp', current: '4.0 L', burnRate: '1.8 L/day', predictedZero: 'In 2.2 days', confidence: '85%' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight flex items-center gap-2">
            <TrendingUp className="text-coral" /> AI Demand & Inventory Predictions
          </h1>
          <p className="text-nora-muted text-sm">Predictive machine learning models for footfall, station load, and inventory depletion.</p>
        </div>
        <button
          onClick={() => openDrawer("What are your predictive forecasts for dinner rush tonight?")}
          className="flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-lg text-sm font-semibold hover:bg-coral-dark transition-colors shadow-sm"
        >
          <Sparkles size={15} /> Ask NORA for Staffing Plan
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          title="Predicted Dinner Revenue"
          value="₹32,500"
          trend={15.4}
          trendLabel="vs last Tuesday"
          icon={TrendingUp}
        />
        <KpiCard
          title="Predicted Peak Window"
          value="7:45 – 9:15 PM"
          icon={Clock}
        />
        <KpiCard
          title="Projected Kitchen Load"
          value="88% (Tandoor Heavy)"
          icon={Flame}
        />
      </div>

      {/* Hourly Sales Forecast Chart */}
      <Card>
        <CardHeader
          title="Predicted Hourly Demand Curve (Today)"
          subtitle="Model trained on 90-day order trends, weather data, and day-of-week seasonality"
          action={
            <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full border border-purple-200">
              Confidence: 91.2%
            </span>
          }
        />
        <div className="p-4 pt-0">
          <SalesChart data={hourlyForecast} height={320} />
        </div>
      </Card>

      {/* Predicted Stock Depletions Table */}
      <Card>
        <CardHeader
          title="Predictive Inventory Depletion Matrix"
          subtitle="Calculated based on live burn-rate and incoming dinner demand volume"
        />
        <div className="p-4 pt-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-nora-bg text-nora-muted border-b border-nora-border">
              <tr>
                <th className="py-3 px-4">Raw Ingredient</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Estimated Burn Rate</th>
                <th className="py-3 px-4">Predicted Stock-Out</th>
                <th className="py-3 px-4">AI Confidence</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nora-border">
              {predictedStockDepletions.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="py-3 px-4 font-semibold text-nora-text">{row.item}</td>
                  <td className="py-3 px-4">{row.current}</td>
                  <td className="py-3 px-4 text-nora-secondary">{row.burnRate}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 text-xs">
                      {row.predictedZero}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-purple-700">{row.confidence}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => openDrawer(`Draft a purchase order for ${row.item} right now.`)}
                      className="text-xs font-bold text-coral hover:underline"
                    >
                      Restock PO
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
