'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, MoreHorizontal, ChefHat, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNora } from '@/context/NoraContext';
import { springs } from '@/lib/motion';

export function NoraDrawer() {
  const { isOpen, closeDrawer, messages, sendMessage, isLoading } = useNora();
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  const initialSuggestions = [
    { icon: TrendingUp, text: 'Sales projection for dinner?' },
    { icon: AlertTriangle, text: 'Any delayed orders over 30m?' },
    { icon: ChefHat, text: 'Current kitchen load status?' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={springs.drawer}
            className="fixed right-0 top-0 bottom-0 w-[100vw] md:w-[400px] bg-white shadow-2xl z-50 flex flex-col border-l border-nora-border"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-nora-border flex-shrink-0 bg-nora-bg/50 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-nora-accent-lt text-nora-accent flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">NORA</h3>
                  <p className="text-[10px] text-nora-muted uppercase tracking-wider font-semibold">AI Intelligence</p>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="p-2 text-nora-muted hover:text-nora-text transition-colors rounded-full hover:bg-nora-border/50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm flex gap-3 ${
                    msg.sender === 'user'
                      ? 'bg-nora-text text-white rounded-tr-sm'
                      : 'bg-white border border-nora-border rounded-tl-sm shadow-sm'
                  }`}>
                    {msg.sender === 'nora' && (
                      <div className="mt-0.5 w-6 h-6 rounded-full bg-nora-accent-lt text-nora-accent flex items-center justify-center flex-shrink-0">
                        <Sparkles size={12} />
                      </div>
                    )}
                    <div>
                      {/* Very basic markdown bold parsing for nora responses */}
                      <p className="leading-relaxed" dangerouslySetInnerHTML={{
                          __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-nora-border rounded-2xl rounded-tl-sm shadow-sm px-4 py-3 flex gap-3">
                    <div className="mt-0.5 w-6 h-6 rounded-full bg-nora-accent-lt text-nora-accent flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Sparkles size={12} />
                    </div>
                    <div className="flex items-center gap-1">
                      <motion.div className="w-1.5 h-1.5 bg-nora-muted rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-nora-muted rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-nora-muted rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (only when little history) */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 pb-2">
                <div className="flex flex-wrap gap-2">
                  {initialSuggestions.map((suggestion, idx) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => sendMessage(suggestion.text)}
                        className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-nora-bg border border-nora-border rounded-full text-nora-secondary hover:text-nora-accent hover:border-nora-accent/30 transition-colors text-left"
                      >
                        <Icon size={12} />
                        {suggestion.text}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-nora-border pb-safe">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask NORA for insights..."
                  className="w-full bg-nora-bg border border-nora-border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-nora-accent/20 transition-all placeholder:text-nora-muted"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 bg-nora-accent text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-600 transition-colors"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
