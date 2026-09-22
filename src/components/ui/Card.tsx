"use client";
import React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Card({ children, className, noPadding = false, ...props }: CardProps) {
  return (
    <motion.div
      className={cn(
        "bg-white rounded-card border border-nora-border shadow-sm overflow-hidden",
        !noPadding && "p-5 md:p-6",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({
  title,
  subtitle,
  description,
  action,
  className
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  const sub = subtitle ?? description;
  return (
    <div className={cn("flex justify-between items-start mb-4", className)}>
      <div>
        <h3 className="font-semibold text-nora-text">{title}</h3>
        {sub && <p className="text-sm text-nora-muted">{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

