'use client';

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Card } from './Card';

interface SalesChartProps {
  data: any[];
  height?: number;
}

export function SalesChart({ data, height = 300 }: SalesChartProps) {
  return (
    <div style={{ height: height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E05C3A" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#E05C3A" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            tickFormatter={(value) => `₹${value / 1000}k`}
            dx={-10}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
            labelStyle={{ color: '#374151', fontWeight: 600, marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#E05C3A"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorSales)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
