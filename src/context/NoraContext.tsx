'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface NoraMessage {
  id: string;
  sender: 'user' | 'nora';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: () => void }[];
}

interface NoraContextType {
  isOpen: boolean;
  openDrawer: (initialQuery?: string) => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  messages: NoraMessage[];
  sendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  clearMessages: () => void;
}

const initialQuestions = [
  "What is our projected revenue for dinner service?",
  "Which inventory items are running critically low?",
  "How can we improve table turnaround during peak hours?",
  "Show me the top 3 customer complaints today",
];

const NoraContext = createContext<NoraContextType | undefined>(undefined);

export function NoraProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<NoraMessage[]>([
    {
      id: 'welcome',
      sender: 'nora',
      text: "Namaste! I am NORA, your AI restaurant intelligence assistant. I'm actively monitoring your kitchen queue, delivery bottlenecks, inventory depletion rates, and sales trends. How can I assist you right now?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const openDrawer = (initialQuery?: string) => {
    setIsOpen(true);
    if (initialQuery) {
      sendMessage(initialQuery);
    }
  };

  const closeDrawer = () => setIsOpen(false);
  const toggleDrawer = () => setIsOpen((prev) => !prev);

  const clearMessages = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'nora',
        text: "Namaste! I am NORA, your AI restaurant intelligence assistant. How can I assist you right now?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: NoraMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Call mock or backend API
      const res = await fetch('/api/nora', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();

      const aiMsg: NoraMessage = {
        id: `nora-${Date.now()}`,
        sender: 'nora',
        text: data.reply || "I've analyzed the real-time restaurant metrics. Kitchen orders are currently within safe SLA thresholds (avg prep time: 18m).",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Smart contextual fallback response
      let fallbackText = "I've analyzed your restaurant telemetry. Revenue is tracking +18.4% above target for this hour, with Butter Chicken and Paneer Tikka driving 42% of volume.";

      const lower = text.toLowerCase();
      if (lower.includes('inventory') || lower.includes('stock') || lower.includes('low')) {
        fallbackText = "⚠️ **Inventory Alert**: Amul Butter is at 3.2 kg (below the 5 kg threshold, approx. 1.1 days remaining) and Fresh Cream is at 4.5 L. I recommend raising a purchase order to your primary supplier before 4:00 PM.";
      } else if (lower.includes('kitchen') || lower.includes('prep') || lower.includes('cook') || lower.includes('delay')) {
        fallbackText = "🔥 **Kitchen Status**: Station 2 (Curry) is experiencing 82% load with 4 active orders. Station 1 (Tandoor) is operating smoothly. Order #ORD-1002 (Paneer Lababdar) is approaching 24m elapsed prep time.";
      } else if (lower.includes('revenue') || lower.includes('sales') || lower.includes('target') || lower.includes('money')) {
        fallbackText = "📈 **Revenue Intelligence**: Today's revenue stands at ₹48,250 against a projected target of ₹55,000. Peak dinner rush is expected between 7:30 PM – 9:45 PM with an anticipated ₹32,000 in additional sales.";
      } else if (lower.includes('customer') || lower.includes('review') || lower.includes('sentiment') || lower.includes('complaint')) {
        fallbackText = "⭐ **Guest Sentiment**: Sentiment is currently **Positive (88%)**. 2 minor negative reviews in the last 24h noted slightly longer delivery times for distant orders (>6km). Dine-in feedback remains 4.9/5.";
      }

      const aiMsg: NoraMessage = {
        id: `nora-${Date.now()}`,
        sender: 'nora',
        text: fallbackText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NoraContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        messages,
        sendMessage,
        isLoading,
        clearMessages,
      }}
    >
      {children}
    </NoraContext.Provider>
  );
}

export function useNora() {
  const context = useContext(NoraContext);
  if (!context) {
    throw new Error('useNora must be used within a NoraProvider');
  }
  return context;
}
