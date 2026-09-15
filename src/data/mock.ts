import { Order, MenuItem, InventoryItem, Customer } from '@/types';

export const mockOrders: Order[] = [
  {
    id: '2403',
    customerName: 'Rahul Verma',
    items: [
      { id: 'm1', name: 'Peri-Peri Pizza', quantity: 2, price: 389 },
      { id: 'm11', name: 'Mango Lassi', quantity: 2, price: 129 }
    ],
    totalAmount: 1036,
    status: 'Delayed',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: '2402',
    customerName: 'Priya Sharma',
    items: [
      { id: 'm3', name: 'Butter Chicken', quantity: 1, price: 349 },
      { id: 'm6', name: 'Garlic Bread', quantity: 1, price: 149 }
    ],
    totalAmount: 498,
    status: 'Preparing',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: '2401',
    customerName: 'Arjun Mehta',
    items: [
      { id: 'm4', name: 'Chicken Biryani', quantity: 2, price: 329 }
    ],
    totalAmount: 658,
    status: 'Delayed',
    createdAt: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: '2400',
    customerName: 'Sneha Patel',
    items: [
      { id: 'm2', name: 'Margherita Pizza', quantity: 1, price: 299 },
      { id: 'm7', name: 'Loaded Fries', quantity: 1, price: 189 }
    ],
    totalAmount: 488,
    status: 'Ready',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
  },
  {
    id: '2399',
    customerName: 'Kiran Reddy',
    items: [
      { id: 'm5', name: 'Paneer Tikka', quantity: 2, price: 279 }
    ],
    totalAmount: 558,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  }
];

export const mockMenuItems: MenuItem[] = [
  { id: 'm1', name: 'Peri-Peri Pizza', category: 'Pizza', price: 389, rating: 4.7, available: true },
  { id: 'm2', name: 'Margherita Pizza', category: 'Pizza', price: 299, rating: 4.5, available: true },
  { id: 'm3', name: 'Butter Chicken', category: 'Indian Mains', price: 349, rating: 4.8, available: true },
  { id: 'm4', name: 'Chicken Biryani', category: 'Indian Mains', price: 329, rating: 4.6, available: true },
  { id: 'm5', name: 'Paneer Tikka', category: 'Starters', price: 279, rating: 4.4, available: true },
  { id: 'm6', name: 'Garlic Bread', category: 'Starters', price: 149, rating: 4.3, available: true },
  { id: 'm7', name: 'Loaded Fries', category: 'Starters', price: 189, rating: 4.2, available: true },
  { id: 'm8', name: 'Masala Pasta', category: 'Mains', price: 259, rating: 4.1, available: false },
  { id: 'm9', name: 'Chicken Burger', category: 'Burgers', price: 249, rating: 4.3, available: true },
  { id: 'm10', name: 'Chocolate Brownie', category: 'Desserts', price: 179, rating: 4.6, available: true },
  { id: 'm11', name: 'Mango Lassi', category: 'Beverages', price: 129, rating: 4.5, available: true },
  { id: 'm12', name: 'Masala Chai', category: 'Beverages', price: 69, rating: 4.4, available: true },
];

export const mockInventory: InventoryItem[] = [
  { id: 'i1', name: 'Tomatoes', quantity: 25, unit: 'kg', status: 'Normal', dailyUsage: 3.2 },
  { id: 'i2', name: 'Cheese', quantity: 8, unit: 'kg', status: 'Low', dailyUsage: 1.8 },
  { id: 'i3', name: 'Chicken', quantity: 3, unit: 'kg', status: 'Critical', dailyUsage: 4.5 },
  { id: 'i4', name: 'Flour', quantity: 40, unit: 'kg', status: 'Normal', dailyUsage: 2.1 },
  { id: 'i5', name: 'Paneer', quantity: 6, unit: 'kg', status: 'Low', dailyUsage: 2.0 },
  { id: 'i6', name: 'Rice', quantity: 30, unit: 'kg', status: 'Normal', dailyUsage: 3.5 },
  { id: 'i7', name: 'Onions', quantity: 15, unit: 'kg', status: 'Normal', dailyUsage: 2.8 },
  { id: 'i8', name: 'Butter', quantity: 2, unit: 'kg', status: 'Critical', dailyUsage: 1.2 },
  { id: 'i9', name: 'Cooking Oil', quantity: 18, unit: 'L', status: 'Normal', dailyUsage: 1.5 },
  { id: 'i10', name: 'Mango Pulp', quantity: 4, unit: 'L', status: 'Low', dailyUsage: 1.8 },
];

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Priya Sharma', ordersCount: 14, totalSpend: 5400, favoriteDish: 'Butter Chicken', lastOrderAt: new Date(Date.now() - 2 * 86400000).toISOString(), segment: 'VIP' },
  { id: 'c2', name: 'Arjun Mehta', ordersCount: 8, totalSpend: 3200, favoriteDish: 'Chicken Biryani', lastOrderAt: new Date(Date.now() - 5 * 86400000).toISOString(), segment: 'Regular' },
  { id: 'c3', name: 'Rahul Verma', ordersCount: 22, totalSpend: 9800, favoriteDish: 'Peri-Peri Pizza', lastOrderAt: new Date().toISOString(), segment: 'VIP' },
  { id: 'c4', name: 'Sneha Patel', ordersCount: 1, totalSpend: 488, favoriteDish: 'Margherita Pizza', lastOrderAt: new Date().toISOString(), segment: 'New' },
  { id: 'c5', name: 'Kiran Reddy', ordersCount: 12, totalSpend: 4500, favoriteDish: 'Paneer Tikka', lastOrderAt: new Date(Date.now() - 17 * 86400000).toISOString(), segment: 'At Risk' },
];

export const mockAiInsights = [
  {
    id: 'ai-1',
    category: 'operations',
    type: 'warning' as const,
    insight: 'Tandoor station is reaching 82% capacity. 3 Butter Chicken and 2 Paneer Tikka pending.',
    actionable: true,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ai-2',
    category: 'sales',
    type: 'positive' as const,
    insight: 'Revenue tracking 12% higher than typical Tuesdays. Dinner rush expected between 7:30 PM - 9:30 PM.',
    actionable: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'ai-3',
    category: 'inventory',
    type: 'warning' as const,
    insight: 'Amul Butter depletion rate spiked. Current stock will only last 1.1 days at this rate.',
    actionable: true,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: 'ai-4',
    category: 'sentiment',
    type: 'info' as const,
    insight: 'Recent negative review cluster (2) regarding delayed deliveries to Sector 56.',
    actionable: true,
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
  }
];
