"use client";

import React, { useState } from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { FileText, Download, Calendar, Filter, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const reports = [
    { id: 'daily-sales', title: 'Daily Sales & Revenue Summary', freq: 'Daily', format: 'PDF / CSV', size: '2.4 MB' },
    { id: 'inventory-audit', title: 'Weekly Inventory Consumption & Waste Audit', freq: 'Weekly', format: 'Excel (XLSX)', size: '1.8 MB' },
    { id: 'kitchen-sla', title: 'Kitchen SLA & Station Bottlenecks Report', freq: 'Monthly', format: 'PDF', size: '3.1 MB' },
    { id: 'tax-gst', title: 'GST & Financial Compliance Export', freq: 'Monthly', format: 'JSON / CSV', size: '850 KB' },
    { id: 'customer-retention', title: 'VIP Guest Retention & Churn Analysis', freq: 'Bi-Weekly', format: 'PDF', size: '1.2 MB' },
  ];

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      alert('Report generated and downloaded successfully!');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight flex items-center gap-2">
            <FileText className="text-coral" /> Operational & Financial Reports
          </h1>
          <p className="text-nora-muted text-sm">Download aggregated data exports and audit summaries for Rajdarbar Restaurant.</p>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Generated System Reports"
          subtitle="Click to download immediate audit reports compiled from live SQLite logs"
        />
        <div className="p-4 pt-0 divide-y divide-nora-border">
          {reports.map((r) => (
            <div key={r.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-nora-bg border border-nora-border flex items-center justify-center text-coral">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-nora-text">{r.title}</p>
                  <span className="text-xs text-nora-muted">{r.freq} • {r.format} • {r.size}</span>
                </div>
              </div>
              <button
                onClick={() => handleDownload(r.id)}
                disabled={downloading === r.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-nora-bg border border-nora-border rounded-lg text-xs font-semibold text-nora-text transition-colors shadow-sm"
              >
                <Download size={13} className={downloading === r.id ? "animate-bounce" : ""} />
                {downloading === r.id ? "Exporting..." : "Download"}
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
