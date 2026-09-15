'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { navItems } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { springs } from '@/lib/motion';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 220 }}
      transition={springs.drawer}
      className="hidden md:flex flex-col h-screen bg-nora-card border-r border-nora-border relative z-20 shrink-0"
    >
      <div className="flex items-center h-16 px-4 border-b border-nora-border">
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-semibold text-lg tracking-tight"
          >
            NORA
          </motion.span>
        )}
        {collapsed && (
          <span className="font-bold text-coral mx-auto text-xl">N</span>
        )}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-nora-card border border-nora-border rounded-full p-1 shadow-sm hover:bg-nora-bg transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        {navItems.map((group, i) => (
          <div key={group.section} className="mb-6 px-3">
            {!collapsed && (
              <h3 className="px-3 mb-2 text-xs font-semibold text-nora-muted uppercase tracking-wider">
                {group.section}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-nora-accent-lt text-nora-accent"
                        : "text-nora-secondary hover:bg-nora-border/50 hover:text-nora-text",
                      collapsed && "justify-center px-0"
                    )}
                    title={collapsed ? item.label : undefined}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon size={18} className={cn(collapsed ? "mx-auto" : "mr-3 shrink-0")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!collapsed && (
        <div className="p-4 border-t border-nora-border text-xs text-nora-muted">
          NORA OS v1.0.0
        </div>
      )}
    </motion.aside>
  );
}
