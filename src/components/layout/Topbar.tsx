'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { springs } from '@/lib/motion';
import { useNora } from '@/context/NoraContext';

export function Topbar() {
  const { openDrawer } = useNora();
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      setGreeting('Good Morning');
    } else if (hour >= 12 && hour < 17) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  return (
    <header className="h-16 topbar-material sticky top-0 z-10 flex items-center justify-between px-6">
      {/* Dynamic Greeting & User */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-nora-muted">{greeting},</span>
            <span className="text-sm font-bold text-nora-text">Pritam Singh 👋</span>
          </div>
          <p className="text-[11px] text-nora-muted hidden sm:block">Welcome to Rajdarbar Restaurant Intelligence</p>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nora-muted" size={16} />
          <input
            type="text"
            placeholder="Search orders, menu, or ask NORA..."
            className="w-full pl-9 pr-4 py-1.5 bg-white/70 border border-nora-border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all placeholder:text-nora-muted"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.currentTarget.value.trim() !== '') {
                  openDrawer(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <motion.button
          onClick={() => openDrawer()}
          whileTap={{ scale: 0.95 }}
          transition={springs.press}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-coral/10 to-nora-accent/10 border border-coral/30 rounded-full hover:bg-white text-xs font-semibold transition-all text-coral shadow-sm"
        >
          <Sparkles size={14} className="text-coral" />
          <span>Ask NORA</span>
        </motion.button>

        <button className="relative p-2 text-nora-secondary hover:text-nora-text transition-colors rounded-full hover:bg-nora-bg">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-nora-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral to-orange-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            PS
          </div>
          <div className="hidden md:block text-left leading-tight">
            <p className="text-xs font-bold text-nora-text">Pritam Singh</p>
            <p className="text-[10px] text-nora-muted">General Manager</p>
          </div>
        </div>
      </div>
    </header>
  );
}

