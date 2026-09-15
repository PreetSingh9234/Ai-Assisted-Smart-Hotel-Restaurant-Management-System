import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'accent';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-nora-text text-white',
    outline: 'border border-nora-border text-nora-secondary',
    secondary: 'bg-nora-bg text-nora-text',
    accent: 'bg-nora-accent-lt text-nora-accent',
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
