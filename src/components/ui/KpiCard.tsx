"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  trend?: number; // positive for up, negative for down, 0 for neutral
  trendLabel?: string;
  icon: React.ElementType;
  className?: string;
}

export function KpiCard({ title, value, trend, trendLabel, icon: Icon, className }: KpiCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;
  const isNeutral = trend === 0;

  return (
    <Card className={cn("flex flex-col", className)} noPadding={false}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium text-nora-muted">{title}</div>
        <div className="w-8 h-8 rounded-full bg-nora-bg flex items-center justify-center text-nora-secondary">
          <Icon size={16} />
        </div>
      </div>

      <div className="mt-auto">
        <div className="text-2xl font-bold tracking-tight text-nora-text mb-2 kpi-value">
          {value}
        </div>

        {trend !== undefined && (
          <div className="flex items-center text-xs font-medium">
            <span className={cn(
              "flex items-center gap-1",
              isPositive && "text-nora-success",
              isNegative && "text-nora-danger",
              isNeutral && "text-nora-muted"
            )}>
              {isPositive && <TrendingUp size={12} />}
              {isNegative && <TrendingDown size={12} />}
              {isNeutral && <Minus size={12} />}
              {Math.abs(trend)}%
            </span>
            {trendLabel && (
              <span className="text-nora-muted ml-1.5">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
