"use client";

import React from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { KpiCard } from '@/components/ui/KpiCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useNora } from '@/context/NoraContext';
import { SmilePlus, ThumbsUp, ThumbsDown, MessageSquare, Sparkles, Star } from 'lucide-react';
import { mockReviews } from '@/data/mock';

export default function SentimentAnalysisPage() {
  const { openDrawer } = useNora();

  const total = mockReviews.length;
  const positive = mockReviews.filter(r => r.sentiment === 'Positive').length;
  const neutral = mockReviews.filter(r => r.sentiment === 'Neutral').length;
  const negative = mockReviews.filter(r => r.sentiment === 'Negative').length;
  const positivePct = Math.round((positive / total) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight flex items-center gap-2">
            <SmilePlus className="text-coral" /> Customer Sentiment & Review Analysis
          </h1>
          <p className="text-nora-muted text-sm">NLP-driven classification of guest feedback across dining, packaging, and delivery.</p>
        </div>
        <button
          onClick={() => openDrawer("Analyze our guest feedback trends and highlight top complaints.")}
          className="flex items-center gap-2 px-4 py-2 bg-coral text-white rounded-lg text-sm font-semibold hover:bg-coral-dark transition-colors shadow-sm"
        >
          <Sparkles size={15} /> Ask NORA for Summary
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KpiCard
          title="Overall Sentiment"
          value={`${positivePct}% Positive`}
          trend={2.4}
          trendLabel="vs last week"
          icon={SmilePlus}
        />
        <KpiCard
          title="Positive Reviews"
          value={positive}
          icon={ThumbsUp}
        />
        <KpiCard
          title="Neutral Reviews"
          value={neutral}
          icon={MessageSquare}
        />
        <KpiCard
          title="Negative / Actionable"
          value={negative}
          trend={-1.5}
          trendLabel="improved"
          icon={ThumbsDown}
        />
      </div>

      {/* Topic Sentiment Heatmap & Live Feedback Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader
            title="Topic Performance Breakdown"
            subtitle="AI categorizes review themes automatically"
          />
          <div className="p-4 pt-0 space-y-4">
            {[
              { topic: 'Food Quality', score: 92, status: 'positive' as const },
              { topic: 'Portion Size', score: 85, status: 'positive' as const },
              { topic: 'Packaging', score: 88, status: 'positive' as const },
              { topic: 'Delivery Speed', score: 64, status: 'warning' as const },
              { topic: 'Order Accuracy', score: 78, status: 'positive' as const },
            ].map((item) => (
              <div key={item.topic} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-nora-text">{item.topic}</span>
                  <span className={item.score > 80 ? 'text-green-600' : 'text-amber-600'}>{item.score}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.score > 80 ? 'bg-green-500' : 'bg-amber-500'}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
              ⚠️ <strong>Action Required:</strong> Delivery speed scored 64%. Two reviews cited &gt;40 min delivery times during rain.
            </div>
          </div>
        </Card>

        {/* Live Feedback Feed */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Guest Reviews & Sentiment Tags"
            subtitle="Extracted from Swiggy, Zomato, and Direct Dine-in Feedback"
          />
          <div className="p-4 pt-0 divide-y divide-nora-border">
            {mockReviews.map((r) => (
              <div key={r.id} className="py-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-nora-text">{r.customerName}</span>
                    <div className="flex items-center text-amber-500 text-xs">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-nora-muted bg-nora-bg px-2 py-0.5 rounded border border-nora-border">
                      {r.topic}
                    </span>
                    <StatusBadge
                      status={r.sentiment}
                      type={r.sentiment === 'Positive' ? 'success' : r.sentiment === 'Neutral' ? 'warning' : 'danger'}
                    />
                  </div>
                </div>
                <p className="text-sm text-nora-secondary italic">&ldquo;{r.comment}&rdquo;</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
