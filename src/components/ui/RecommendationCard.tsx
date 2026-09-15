"use client";
import React from 'react';
import { Card } from './Card';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Action {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

interface RecommendationCardProps {
  title: string;
  description: string;
  metric?: string;
  metricLabel?: string;
  priority?: 'high' | 'medium' | 'low';
  actions?: Action[];
  className?: string;
}

export function RecommendationCard({
  title,
  description,
  metric,
  metricLabel,
  priority = 'medium',
  actions,
  className
}: RecommendationCardProps) {
  const priorityColors = {
    high: 'text-nora-danger bg-nora-danger-lt border-nora-danger/20',
    medium: 'text-nora-amber bg-nora-amber-lt border-nora-amber/20',
    low: 'text-nora-accent bg-nora-accent-lt border-nora-accent/20',
  };

  return (
    <Card className={cn("relative overflow-hidden group", className)}>
      {/* Decorative gradient blob */}
      <div className="absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br from-nora-accent/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none" />

      <div className="flex items-start justify-between mb-3 relative z-10">
        <div className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", priorityColors[priority])}>
          <Sparkles size={10} />
          {priority} Priority
        </div>
        {metric && (
          <div className="text-right">
            <div className="text-base font-bold text-nora-text leading-none">{metric}</div>
            {metricLabel && <div className="text-[10px] text-nora-muted font-medium mt-1">{metricLabel}</div>}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h4 className="font-semibold text-nora-text mb-1.5">{title}</h4>
        <p className="text-sm text-nora-secondary mb-4 line-clamp-2 md:line-clamp-none">{description}</p>
      </div>

      {actions && actions.length > 0 && (
        <div className="flex flex-wrap gap-2 relative z-10">
          {actions.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={cn(
                "text-xs font-medium px-3 py-1.5 rounded-full transition-colors flex items-center gap-1",
                action.primary
                  ? "bg-nora-text text-white hover:bg-black"
                  : "bg-nora-bg text-nora-text border border-nora-border hover:bg-nora-border/50"
              )}
            >
              {action.label}
              {action.primary && <ArrowRight size={12} />}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
