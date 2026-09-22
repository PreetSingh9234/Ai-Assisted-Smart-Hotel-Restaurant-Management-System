"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useNora } from '@/context/NoraContext';
import { Sparkles, Send, Bot, User, Trash2, ArrowRight, TrendingUp, AlertTriangle, ChefHat, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NoraAiDedicatedPage() {
  const { messages, sendMessage, isLoading, clearMessages } = useNora();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
  };

  const samplePrompts = [
    { label: "Today's Revenue Forecast", query: "What is today's revenue projection and how does it compare to last week?" },
    { label: "Stock Depletion Check", query: "Which ingredients are approaching critical depletion levels?" },
    { label: "Kitchen Load Status", query: "Analyze our kitchen station queue and flag any delays." },
    { label: "Top Customer Win-back", query: "Show me at-risk VIP guests and suggest retention offers." }
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col p-2 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-nora-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-coral to-orange-400 flex items-center justify-center text-white shadow-sm">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-nora-text">NORA AI Assistant</h1>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 rounded-full border border-green-200">
                Groq LLM Active
              </span>
            </div>
            <p className="text-xs text-nora-muted">Powered by Groq High-Speed Inference • Connected to Live Database</p>
          </div>
        </div>

        <button
          onClick={clearMessages}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-nora-muted hover:text-red-600 hover:bg-red-50 border border-nora-border rounded-lg transition-colors"
        >
          <Trash2 size={13} />
          Clear Chat
        </button>
      </div>

      {/* Main Chat Stream */}
      <div className="flex-1 bg-white rounded-xl border border-nora-border shadow-sm p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'nora' && (
              <div className="w-8 h-8 rounded-full bg-coral-lt text-coral flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-nora-text text-white rounded-tr-sm shadow-sm'
                  : 'bg-nora-bg border border-nora-border rounded-tl-sm text-nora-text shadow-sm'
              }`}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: msg.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br />')
                }}
              />
              <span className="text-[10px] text-nora-muted block mt-1.5 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-coral to-orange-400 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-1">
                PS
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-coral-lt text-coral flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="animate-spin" />
            </div>
            <div className="bg-nora-bg border border-nora-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-coral animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-coral animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-coral animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(p.query)}
            className="text-left p-2.5 bg-white hover:bg-nora-bg border border-nora-border hover:border-coral/40 rounded-lg text-xs transition-all text-nora-secondary hover:text-nora-text shadow-sm"
          >
            <p className="font-semibold text-coral truncate">{p.label}</p>
            <p className="text-[11px] text-nora-muted truncate mt-0.5">{p.query}</p>
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask NORA anything about kitchen, orders, revenue, inventory..."
          className="w-full bg-white border border-nora-border rounded-full pl-5 pr-14 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-coral/20 transition-all shadow-sm placeholder:text-nora-muted"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 p-2.5 bg-coral text-white rounded-full disabled:opacity-40 disabled:cursor-not-allowed hover:bg-coral-dark transition-colors shadow-sm"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
