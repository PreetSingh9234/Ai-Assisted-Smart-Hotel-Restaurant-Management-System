"use client";
import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export type InsightType = 'suggestion' | 'warning' | 'positive' | 'info';

interface AiInsightChipProps {
  text: string;
  type?: InsightType;
  className?: string;
  onClick?: () => void;
}

export function AiInsightChip({ text, type = 'info', className, onClick }: AiInsightChipProps) {
  const styles = {
    suggestion: 'bg-nora-accent-lt text-nora-accent border-nora-accent/20',
    warning: 'bg-nora-amber-lt text-nora-amber border-nora-amber/20 hover:bg-nora-amber/20',
    positive: 'bg-nora-success-lt text-nora-success border-nora-success/20',
    info: 'bg-nora-bg text-nora-secondary border-nora-border',
  };

  const icons = {
    suggestion: <Sparkles size={12} />,
    warning: <AlertTriangle size={12} />,
    positive: <TrendingUp size={12} />,
    info: <Info size={12} />,
  };

  const Comp = onClick ? motion.button : motion.div;
  const hoverProps = onClick ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } } : {};

  return (
    <Comp
      onClick={onClick}
      {...hoverProps}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border rounded-full transition-colors",
        styles[type],
        onClick && "cursor-pointer",
        className
      )}
    >
      {icons[type]}
      {text}
    </Comp>
  );
}
