"use client";
import React from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AiInsightChip } from '@/components/ui/AiInsightChip';
import { MapPin, Clock, Phone, Truck, Navigation, Package, CheckCircle2, AlertTriangle, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Rider {
  id: string;
  name: string;
  phone: string;
  status: 'In Transit' | 'At Restaurant' | 'Delivering' | 'Available' | 'Offline';
  currentOrder?: string;
  destination?: string;
  eta?: string;
  completedToday: number;
  avgTime: string;
  lat: number;
  lng: number;
}

const riders: Rider[] = [
  { id: 'R1', name: 'Rahul Sharma', phone: '+91 98765 43210', status: 'In Transit', currentOrder: 'ORD-004', destination: 'Sector 44, Chandigarh', eta: '12 min', completedToday: 8, avgTime: '26m', lat: 30.7333, lng: 76.7794 },
  { id: 'R2', name: 'Amit Patel', phone: '+91 87654 32109', status: 'At Restaurant', currentOrder: 'ORD-005', destination: 'Sector 30, Chandigarh', eta: 'Waiting', completedToday: 6, avgTime: '28m', lat: 30.7420, lng: 76.7680 },
  { id: 'R3', name: 'Vikram Mehta', phone: '+91 76543 21098', status: 'Delivering', currentOrder: 'ORD-003', destination: 'MG Road', eta: '2 min', completedToday: 10, avgTime: '24m', lat: 30.7350, lng: 76.7850 },
  { id: 'R4', name: 'Suresh Kumar', phone: '+91 65432 10987', status: 'Available', completedToday: 5, avgTime: '30m', lat: 30.7400, lng: 76.7750 },
  { id: 'R5', name: 'Deepak Singh', phone: '+91 54321 09876', status: 'Offline', completedToday: 7, avgTime: '27m', lat: 30.7380, lng: 76.7720 },
];

const statusColors: Record<string, string> = {
  'In Transit': 'bg-blue-50 text-blue-700 border-blue-200',
  'At Restaurant': 'bg-amber-50 text-amber-700 border-amber-200',
  'Delivering': 'bg-green-50 text-green-700 border-green-200',
  'Available': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Offline': 'bg-gray-50 text-gray-500 border-gray-200',
};

const statusDotColors: Record<string, string> = {
  'In Transit': 'bg-blue-500',
  'At Restaurant': 'bg-amber-500',
  'Delivering': 'bg-green-500',
  'Available': 'bg-emerald-500 animate-pulse',
  'Offline': 'bg-gray-400',
};

export default function DeliveryPage() {
  const activeRiders = riders.filter(r => r.status !== 'Offline');
  const onDelivery = riders.filter(r => ['In Transit', 'Delivering'].includes(r.status));
  const totalDelivered = riders.reduce((sum, r) => sum + r.completedToday, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-nora-text tracking-tight">Delivery Management</h1>
          <p className="text-nora-muted">Track riders, deliveries, and fleet performance in real-time.</p>
        </div>
        <AiInsightChip
          text={`${onDelivery.length} riders on delivery, avg time 27m`}
          type="info"
        />
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-accent-lt flex items-center justify-center text-nora-accent">
            <Truck size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{activeRiders.length}</div>
            <div className="text-xs text-nora-muted font-medium">Active Riders</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-success/10 flex items-center justify-center text-nora-success">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{totalDelivered}</div>
            <div className="text-xs text-nora-muted font-medium">Delivered Today</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-amber/10 flex items-center justify-center text-nora-amber">
            <Timer size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">27m</div>
            <div className="text-xs text-nora-muted font-medium">Avg Delivery Time</div>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-nora-bg flex items-center justify-center text-nora-secondary">
            <Navigation size={18} />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{onDelivery.length}</div>
            <div className="text-xs text-nora-muted font-medium">On Route</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader title="Live Delivery Map" subtitle="Real-time rider locations" />
          <div className="relative bg-nora-bg rounded-lg border border-nora-border overflow-hidden" style={{ height: 400 }}>
            {/* Map placeholder — Leaflet integration would go here */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative w-full h-full">
                {/* Simple visual map placeholder */}
                <svg viewBox="0 0 400 300" className="w-full h-full opacity-10" preserveAspectRatio="xMidYMid slice">
                  <path d="M0,150 Q100,50 200,150 T400,150" fill="none" stroke="currentColor" strokeWidth="2" className="text-nora-secondary" />
                  <path d="M50,100 Q150,200 250,100 T350,200" fill="none" stroke="currentColor" strokeWidth="1" className="text-nora-secondary" />
                  <circle cx="100" cy="120" r="40" fill="none" stroke="currentColor" strokeWidth="1" className="text-nora-border" />
                  <circle cx="300" cy="180" r="50" fill="none" stroke="currentColor" strokeWidth="1" className="text-nora-border" />
                </svg>

                {/* Rider pins */}
                {activeRiders.map((rider, i) => (
                  <div
                    key={rider.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${20 + i * 18}%`,
                      top: `${30 + (i % 3) * 20}%`,
                    }}
                  >
                    <div className="relative group">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white z-10 relative",
                        rider.status === 'In Transit' ? 'bg-blue-500' : rider.status === 'Delivering' ? 'bg-green-500' : rider.status === 'At Restaurant' ? 'bg-amber-500' : 'bg-emerald-500'
                      )}>
                        {rider.name.substring(0, 1)}
                      </div>
                      {['In Transit', 'Delivering'].includes(rider.status) && (
                        <div className="absolute inset-0 w-8 h-8 rounded-full animate-ping opacity-20"
                          style={{ backgroundColor: rider.status === 'In Transit' ? '#3b82f6' : '#22c55e' }}
                        />
                      )}
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <div className="bg-nora-text text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap">
                          {rider.name} • {rider.status}
                          {rider.eta && ` • ${rider.eta}`}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-nora-border shadow-sm">
                <div className="flex items-center gap-4 text-[10px]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> In Transit</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Delivering</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> At Restaurant</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Available</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Rider List */}
        <Card>
          <CardHeader title="Fleet Status" subtitle={`${activeRiders.length} of ${riders.length} riders active`} />
          <div className="space-y-3">
            {riders.map(rider => (
              <div key={rider.id} className={cn(
                "p-3 rounded-lg border transition-colors",
                rider.status === 'Offline' ? 'bg-gray-50/50 border-gray-200' : 'bg-nora-bg/50 border-nora-border hover:border-nora-accent/30'
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white",
                      rider.status === 'Offline' ? 'bg-gray-400' : 'bg-nora-accent'
                    )}>
                      {rider.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className={cn("font-medium text-sm", rider.status === 'Offline' && 'text-nora-muted')}>{rider.name}</div>
                      <div className="flex items-center gap-1 text-[10px] text-nora-muted">
                        <Phone size={8} /> {rider.phone}
                      </div>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    statusColors[rider.status]
                  )}>
                    <span className="flex items-center gap-1">
                      <span className={cn("w-1.5 h-1.5 rounded-full", statusDotColors[rider.status])} />
                      {rider.status}
                    </span>
                  </span>
                </div>

                {rider.currentOrder && (
                  <div className="text-xs space-y-1 pl-10">
                    <div className="flex items-center gap-1 text-nora-text">
                      <Package size={10} className="text-nora-muted" />
                      Order: <span className="font-medium">{rider.currentOrder}</span>
                    </div>
                    {rider.destination && (
                      <div className="flex items-center gap-1 text-nora-secondary">
                        <MapPin size={10} className="text-nora-muted" />
                        {rider.destination}
                      </div>
                    )}
                    {rider.eta && (
                      <div className="flex items-center gap-1 text-nora-secondary">
                        <Clock size={10} className="text-nora-muted" />
                        ETA: <span className="font-medium">{rider.eta}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-nora-border/50 text-[10px] text-nora-muted pl-10">
                  <span>{rider.completedToday} deliveries today</span>
                  <span>Avg: {rider.avgTime}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader title="Recent Deliveries" subtitle="Last completed deliveries" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-nora-muted uppercase bg-nora-bg/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Rider</th>
                <th className="px-4 py-3 font-semibold">Destination</th>
                <th className="px-4 py-3 font-semibold">Time Taken</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { order: 'ORD-001', rider: 'Rahul S.', dest: 'Sector 17, Chandigarh', time: '24m', status: 'Delivered' },
                { order: 'ORD-002', rider: 'Vikram M.', dest: 'IT Park, Chandigarh', time: '31m', status: 'Delivered' },
                { order: 'ORD-006', rider: 'Suresh K.', dest: 'Sector 22, Chandigarh', time: '28m', status: 'Delivered' },
                { order: 'ORD-007', rider: 'Amit P.', dest: 'Elante Mall', time: '35m', status: 'Delivered' },
                { order: 'ORD-008', rider: 'Deepak S.', dest: 'Panchkula', time: '42m', status: 'Delivered' },
              ].map((d, i) => (
                <tr key={i} className="border-b border-nora-border last:border-0 hover:bg-nora-bg/30">
                  <td className="px-4 py-3 font-medium">{d.order}</td>
                  <td className="px-4 py-3 text-nora-secondary">{d.rider}</td>
                  <td className="px-4 py-3 text-nora-secondary">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-nora-muted" /> {d.dest}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "font-medium",
                      parseInt(d.time) > 30 ? 'text-nora-amber' : 'text-nora-success'
                    )}>
                      {d.time}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
