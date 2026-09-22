"use client";
import React from 'react';
import { Card, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { AiInsightChip } from '@/components/ui/AiInsightChip';
import { ArrowLeft, Clock, User, MapPin, Phone, Utensils, CheckCircle2, Package, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { formatCurrency, timeAgo } from '@/lib/utils';
import { mockOrders } from '@/data/mock';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const lifecycleSteps = [
  { key: 'New', icon: Package, label: 'Order Placed' },
  { key: 'Preparing', icon: Utensils, label: 'Preparing' },
  { key: 'Ready', icon: CheckCircle2, label: 'Ready' },
  { key: 'Out for Delivery', icon: Truck, label: 'Out for Delivery' },
  { key: 'Delivered', icon: CheckCircle2, label: 'Delivered' },
];

const statusOrder = ['New', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const order = mockOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <Package size={48} className="mx-auto mb-4 text-nora-muted opacity-40" />
        <h2 className="text-xl font-bold text-nora-text mb-2">Order Not Found</h2>
        <p className="text-nora-muted mb-6">The order &quot;{orderId}&quot; doesn&apos;t exist or has been removed.</p>
        <Link href="/orders" className="text-sm font-medium text-nora-accent hover:underline">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';
  const isDelayed = order.status === 'Delayed';

  // Simulated customer info derived from order
  const customer = {
    name: order.customerName,
    phone: '+91 98765 43210',
    address: 'Sector 44, Chandigarh',
    orders: 12,
    segment: 'Regular',
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back + Header */}
      <div>
        <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-nora-muted hover:text-nora-text mb-4 transition-colors">
          <ArrowLeft size={14} /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-nora-text tracking-tight">{order.id}</h1>
            <div className="flex items-center gap-3 mt-1">
              <StatusBadge status={order.status} icon />
              <span className="text-sm text-nora-muted">{timeAgo(order.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isDelayed && (
              <AiInsightChip text="NORA: This order may need escalation" type="warning" />
            )}
            {!isCancelled && !isDelayed && currentStepIndex >= 2 && (
              <AiInsightChip text="On track for delivery" type="positive" />
            )}
          </div>
        </div>
      </div>

      {/* Order Lifecycle */}
      <Card>
        <CardHeader title="Order Lifecycle" subtitle={isCancelled ? 'This order was cancelled' : isDelayed ? 'This order is delayed' : undefined} />
        {isCancelled ? (
          <div className="flex items-center justify-center py-8 gap-3 text-nora-danger">
            <XCircle size={24} />
            <span className="font-semibold">Order Cancelled</span>
          </div>
        ) : (
          <div className="flex items-center justify-between relative px-4 py-6">
            {/* Progress Line */}
            <div className="absolute left-16 right-16 top-1/2 h-0.5 bg-nora-border -translate-y-1/2 z-0" />
            <div
              className="absolute left-16 top-1/2 h-0.5 bg-nora-success -translate-y-1/2 z-0 transition-all duration-700"
              style={{ width: `${Math.max(0, (isDelayed ? 1 : currentStepIndex) / (lifecycleSteps.length - 1)) * 100}%`, maxWidth: 'calc(100% - 128px)' }}
            />

            {lifecycleSteps.map((step, i) => {
              const isCompleted = !isDelayed && currentStepIndex >= i;
              const isCurrent = !isDelayed && currentStepIndex === i;
              const Icon = step.icon;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-nora-success border-nora-success text-white'
                      : isCurrent
                        ? 'bg-white border-nora-accent text-nora-accent shadow-md'
                        : 'bg-white border-nora-border text-nora-muted'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    isCompleted ? 'text-nora-success' : isCurrent ? 'text-nora-accent' : 'text-nora-muted'
                  }`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <Card className="lg:col-span-2">
          <CardHeader title="Order Items" subtitle={`${order.items.length} items`} />
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-nora-bg/50 rounded-lg border border-nora-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-nora-border flex items-center justify-center font-bold text-xs text-nora-secondary">
                    {item.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-nora-muted">Qty: {item.quantity}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{formatCurrency(item.price * item.quantity)}</div>
                  <div className="text-xs text-nora-muted">{formatCurrency(item.price)} each</div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="mt-4 pt-4 border-t border-nora-border flex justify-between items-center">
            <span className="font-semibold text-nora-text">Total Amount</span>
            <span className="text-xl font-bold text-nora-text">{formatCurrency(order.totalAmount)}</span>
          </div>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader title="Customer" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-nora-accent-lt flex items-center justify-center font-bold text-nora-accent">
                {customer.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold">{customer.name}</div>
                <div className="text-xs text-nora-muted">{customer.segment} Customer</div>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-nora-secondary">
                <Phone size={14} className="text-nora-muted" />
                {customer.phone}
              </div>
              <div className="flex items-center gap-2 text-nora-secondary">
                <MapPin size={14} className="text-nora-muted" />
                {customer.address}
              </div>
              <div className="flex items-center gap-2 text-nora-secondary">
                <ShoppingBag size={14} className="text-nora-muted" />
                {customer.orders} previous orders
              </div>
            </div>

            <div className="pt-3 border-t border-nora-border">
              <Link
                href={`/customers`}
                className="text-xs font-medium text-nora-accent hover:underline"
              >
                View Customer Profile →
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Order Timeline */}
      <Card>
        <CardHeader title="Order Timeline" />
        <div className="relative pl-6 space-y-6">
          <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-nora-border" />

          {[
            { time: order.createdAt, event: 'Order placed', detail: `${order.items.length} items, ${formatCurrency(order.totalAmount)}`, icon: Package },
            ...(currentStepIndex >= 1 ? [{ time: new Date(new Date(order.createdAt).getTime() + 120000).toISOString(), event: 'Kitchen started preparing', detail: 'Assigned to Tandoor & Curry stations', icon: Utensils }] : []),
            ...(currentStepIndex >= 2 ? [{ time: new Date(new Date(order.createdAt).getTime() + 1200000).toISOString(), event: 'Order ready for pickup', detail: 'All items prepared', icon: CheckCircle2 }] : []),
            ...(currentStepIndex >= 3 ? [{ time: new Date(new Date(order.createdAt).getTime() + 1500000).toISOString(), event: 'Out for delivery', detail: 'Assigned to Rahul S.', icon: Truck }] : []),
            ...(currentStepIndex >= 4 ? [{ time: new Date(new Date(order.createdAt).getTime() + 3000000).toISOString(), event: 'Delivered successfully', detail: 'Customer confirmed receipt', icon: CheckCircle2 }] : []),
            ...(isDelayed ? [{ time: new Date().toISOString(), event: 'Order delayed', detail: 'Kitchen backlog — estimated 10 min additional wait', icon: Clock }] : []),
            ...(isCancelled ? [{ time: new Date().toISOString(), event: 'Order cancelled', detail: 'Cancelled by customer', icon: XCircle }] : []),
          ].map((entry, i) => {
            const Icon = entry.icon;
            return (
              <div key={i} className="relative flex gap-3">
                <div className="absolute -left-6 w-4 h-4 rounded-full bg-white border-2 border-nora-accent flex items-center justify-center z-10">
                  <div className="w-1.5 h-1.5 rounded-full bg-nora-accent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Icon size={14} className="text-nora-secondary" />
                    <span className="font-medium text-sm">{entry.event}</span>
                  </div>
                  <div className="text-xs text-nora-muted mt-0.5">{entry.detail}</div>
                  <div className="text-[10px] text-nora-muted mt-1">{timeAgo(entry.time)}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
