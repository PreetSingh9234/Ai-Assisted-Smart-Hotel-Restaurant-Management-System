import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, Server, CheckCircle2, XCircle } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
  icon?: boolean;
}

export function StatusBadge({ status, type, className, icon = false }: StatusBadgeProps) {
  // Auto-determine type based on status text if not explicitly provided
  let inferredType: StatusType = type || 'neutral';

  if (!type) {
    const s = status.toLowerCase();
    if (['completed', 'ready', 'delivered', 'healthy', 'active'].includes(s)) inferredType = 'success';
    else if (['delayed', 'pending', 'preparing', 'low stock', 'attention'].includes(s)) inferredType = 'warning';
    else if (['cancelled', 'critical', 'offline', 'out of stock'].includes(s)) inferredType = 'danger';
    else if (['new', 'processing', 'in transit'].includes(s)) inferredType = 'info';
  }

  const styles = {
    success: 'bg-nora-success-lt text-nora-success border-nora-success/20',
    warning: 'bg-nora-amber-lt text-nora-amber border-nora-amber/20',
    danger: 'bg-nora-danger-lt text-nora-danger border-nora-danger/20',
    info: 'bg-nora-accent-lt text-nora-accent border-nora-accent/20',
    neutral: 'bg-nora-bg text-nora-secondary border-nora-border',
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1rounded-full text-xs font-semibold border rounded-full",
      styles[inferredType],
      className
    )}>
      {icon && inferredType === 'success' && <CheckCircle2 size={12} />}
      {icon && inferredType === 'warning' && <AlertTriangle size={12} />}
      {icon && inferredType === 'danger' && <XCircle size={12} />}
      {icon && inferredType === 'info' && <Clock size={12} />}
      {icon && inferredType === 'neutral' && <Server size={12} />}

      {!icon && (
        <span className={cn(
          "w-1.5 h-1.5 rounded-full",
          inferredType === 'success' && "bg-nora-success",
          inferredType === 'warning' && "bg-nora-amber",
          inferredType === 'danger' && "bg-nora-danger",
          inferredType === 'info' && "bg-nora-accent",
          inferredType === 'neutral' && "bg-nora-muted",
        )} />
      )}

      {status}
    </span>
  );
}
