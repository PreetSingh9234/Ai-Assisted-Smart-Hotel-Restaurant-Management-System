"use client";

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { Settings2, Save, Key, User, BellRing, Database } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [restaurantName, setRestaurantName] = useState('Rajdarbar Restaurant');
  const [managerName, setManagerName] = useState('Pritam Singh');
  const [currency, setCurrency] = useState('INR (₹)');
  const [slaTarget, setSlaTarget] = useState('18');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight flex items-center gap-2">
            <Settings2 className="text-coral" /> System & Operational Settings
          </h1>
          <p className="text-nora-muted text-sm">Configure restaurant profile, AI behavior, and operational parameters.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader
            title="Restaurant & Manager Profile"
            subtitle="Visible on receipts and intelligence headers"
          />
          <div className="p-4 pt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-nora-secondary uppercase mb-1">Restaurant Name</label>
                <input
                  type="text"
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="w-full bg-nora-bg border border-nora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-nora-secondary uppercase mb-1">Manager In-Charge</label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  className="w-full bg-nora-bg border border-nora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/20"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* AI & Operations Parameters */}
        <Card>
          <CardHeader
            title="Operational Thresholds & AI Parameters"
            subtitle="Controls SLA alert flags and automated purchasing recommendations"
          />
          <div className="p-4 pt-0 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-nora-secondary uppercase mb-1">Target Prep Time SLA (Minutes)</label>
                <input
                  type="number"
                  value={slaTarget}
                  onChange={(e) => setSlaTarget(e.target.value)}
                  className="w-full bg-nora-bg border border-nora-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coral/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-nora-secondary uppercase mb-1">Operational Currency</label>
                <input
                  type="text"
                  value={currency}
                  disabled
                  className="w-full bg-gray-100 border border-nora-border rounded-lg px-3 py-2 text-sm text-nora-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-green-700" />
                <span className="text-xs font-semibold text-green-900">SQLite Database & Groq LLM API: Connected & Healthy</span>
              </div>
              <span className="text-[10px] bg-green-200 text-green-800 font-bold px-2 py-0.5 rounded-full">ACTIVE</span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-coral text-white rounded-lg text-sm font-semibold hover:bg-coral-dark transition-colors shadow-sm"
          >
            <Save size={15} />
            {saved ? "Settings Saved!" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
