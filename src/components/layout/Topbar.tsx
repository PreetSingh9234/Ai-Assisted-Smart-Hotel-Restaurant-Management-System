'use client';

import { Bell, Search, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { springs } from '@/lib/motion';
import { useNora } from '@/context/NoraContext';

export function Topbar() {
  const { openDrawer } = useNora();

  return (
    <header className="h-16 topbar-material sticky top-0 z-10 flex items-center justify-between px-6">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nora-muted" size={18} />
          <input
            type="text"
            placeholder="Search orders, menu, or ask NORA..."
            className="w-full pl-10 pr-4 py-2 bg-white/50 border border-nora-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all placeholder:text-nora-muted"
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

      <div className="flex items-center gap-4">
        <motion.button
          onClick={() => openDrawer()}
          whileTap={{ scale: 0.95 }}
          transition={springs.press}
          className="flex items-center gap-2 px-4 py-2 bg-nora-bg border border-nora-border rounded-full hover:bg-white text-sm font-medium transition-colors text-nora-accent"
        >
          <Sparkles size={16} />
          <span className="hidden sm:inline">Ask NORA</span>
        </motion.button>

        <button className="relative p-2 text-nora-secondary hover:text-nora-text transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full border border-white"></span>
        </button>

        <div className="w-8 h-8 rounded-full bg-coral-lt flex items-center justify-center text-coral font-bold text-sm">
          PS
        </div>
      </div>
    </header>
  );
}
