import { Order, MenuItem, InventoryItem, Customer } from '@/types';
import { mockOrders, mockMenuItems, mockInventory, mockCustomers } from '@/data/mock';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function getOrders(): Promise<Order[]> {
  if (!BASE) return mockOrders;
  try {
    const res = await fetch(`${BASE}/orders`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  } catch (error) {
    console.error(error);
    return mockOrders; // Fallback to mock on error
  }
}

export async function getMenu(): Promise<MenuItem[]> {
  if (!BASE) return mockMenuItems;
  try {
    const res = await fetch(`${BASE}/menu`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch menu');
    return res.json();
  } catch (error) {
    console.error(error);
    return mockMenuItems;
  }
}

export async function getInventory(): Promise<InventoryItem[]> {
  if (!BASE) return mockInventory;
  try {
    const res = await fetch(`${BASE}/inventory`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch inventory');
    return res.json();
  } catch (error) {
    console.error(error);
    return mockInventory;
  }
}

export async function getCustomers(): Promise<Customer[]> {
  if (!BASE) return mockCustomers;
  try {
    const res = await fetch(`${BASE}/customers`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  } catch (error) {
    console.error(error);
    return mockCustomers;
  }
}

export async function getAnalytics(): Promise<any> {
  try {
    const endpoint = BASE ? `${BASE}/analytics` : '/api/analytics';
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  } catch (error) {
    console.error('[getAnalytics]', error);
    return null;
  }
}

