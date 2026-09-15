import { Order, MenuItem, InventoryItem, Customer } from '@/types';

// Helper functions for dynamic relative dates
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 3600000).toISOString();
const daysAgo = (days: number, hoursOffset: number = 0) => new Date(Date.now() - days * 86400000 - hoursOffset * 3600000).toISOString();

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
  { id: 'c1', name: 'Priya Sharma', ordersCount: 14, totalSpend: 5400, favoriteDish: 'Butter Chicken', lastOrderAt: daysAgo(2), segment: 'VIP' },
  { id: 'c2', name: 'Arjun Mehta', ordersCount: 8, totalSpend: 3200, favoriteDish: 'Chicken Biryani', lastOrderAt: daysAgo(5), segment: 'Regular' },
  { id: 'c3', name: 'Rahul Verma', ordersCount: 22, totalSpend: 9800, favoriteDish: 'Peri-Peri Pizza', lastOrderAt: hoursAgo(1), segment: 'VIP' },
  { id: 'c4', name: 'Sneha Patel', ordersCount: 1, totalSpend: 488, favoriteDish: 'Margherita Pizza', lastOrderAt: hoursAgo(2), segment: 'New' },
  { id: 'c5', name: 'Kiran Reddy', ordersCount: 12, totalSpend: 4500, favoriteDish: 'Paneer Tikka', lastOrderAt: daysAgo(17), segment: 'At Risk' },
];

export const mockAiInsights = [
  {
    id: 'ai-1',
    category: 'operations',
    type: 'warning' as const,
    insight: 'Tandoor station is reaching 82% capacity. 3 Butter Chicken and 2 Paneer Tikka pending.',
    actionable: true,
    createdAt: hoursAgo(0.1),
  },
  {
    id: 'ai-2',
    category: 'sales',
    type: 'positive' as const,
    insight: 'Revenue tracking 12% higher than typical Tuesdays. Dinner rush expected between 7:30 PM - 9:30 PM.',
    actionable: false,
    createdAt: hoursAgo(0.5),
  },
  {
    id: 'ai-3',
    category: 'inventory',
    type: 'warning' as const,
    insight: 'Amul Butter depletion rate spiked. Current stock will only last 1.1 days at this rate.',
    actionable: true,
    createdAt: hoursAgo(2),
  },
  {
    id: 'ai-4',
    category: 'sentiment',
    type: 'info' as const,
    insight: 'Recent negative review cluster (2) regarding delayed deliveries to Sector 56.',
    actionable: true,
    createdAt: hoursAgo(3),
  }
];

const customerNames = ["Rahul Verma", "Priya Sharma", "Arjun Mehta", "Sneha Patel", "Kiran Reddy", "Anjali Deshmukh", "Vikram Singh", "Siddharth Rao", "Nisha Gupta", "Rohan Das"];
const baseStatuses = ['New', 'Preparing', 'Ready', 'Delivered', 'Delayed'];

const generateRandomOrders = (count: number): Order[] => {
  return Array.from({ length: count }).map((_, idx) => {
    // Generate dates clustering around now and previous days
    const isToday = idx < 20; // First 20 orders are today
    const dateStr = isToday
      ? hoursAgo(Math.random() * 8) // spread across last 8 hours
      : daysAgo(Math.floor(Math.random() * 5) + 1, Math.random() * 12);

    // Pick 1 to 3 random items
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let totalAmount = 0;

    for (let j = 0; j < numItems; j++) {
      const dbItem = mockMenuItems[Math.floor(Math.random() * mockMenuItems.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      items.push({
        id: dbItem.id,
        name: dbItem.name,
        quantity: qty,
        price: dbItem.price
      });
      totalAmount += (dbItem.price * qty);
    }

    // Determine realistic status based on time
    let status = 'Delivered';
    if (isToday) {
      if (idx < 2) status = 'New';
      else if (idx < 6) status = 'Preparing';
      else if (idx < 8) status = 'Ready';
      else if (idx === 8) status = 'Delayed';
    }

    return {
      id: (2404 + idx).toString(),
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      items,
      totalAmount,
      status: status as Order['status'], // Coerce type here
      createdAt: dateStr,
    };
  });
};

export const mockOrders: Order[] = generateRandomOrders(50);

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  topic: string;
  createdAt: string;
}

export const mockReviews: Review[] = [
  { id: 'r1', customerName: 'Priya S.', rating: 5, comment: 'Absolutely loved the Butter Chicken! Will order again.', sentiment: 'Positive', topic: 'Food Quality', createdAt: hoursAgo(2) },
  { id: 'r2', customerName: 'Rohan D.', rating: 2, comment: 'Delivery was 40 mins late and food was cold.', sentiment: 'Negative', topic: 'Delivery Speed', createdAt: hoursAgo(5) },
  { id: 'r3', customerName: 'Sneha P.', rating: 4, comment: 'Great portion sizes, really worth the price.', sentiment: 'Positive', topic: 'Portion Size', createdAt: daysAgo(1) },
  { id: 'r4', customerName: 'Vikram S.', rating: 3, comment: 'Pizza was slightly burnt on the edges today.', sentiment: 'Neutral', topic: 'Food Quality', createdAt: daysAgo(1, 4) },
  { id: 'r5', customerName: 'Anjali D.', rating: 5, comment: 'Best packaging I have seen from any restaurant.', sentiment: 'Positive', topic: 'Packaging', createdAt: daysAgo(2) },
  { id: 'r6', customerName: 'Arjun M.', rating: 1, comment: 'Forgot to send the extra garlic sauce I paid for.', sentiment: 'Negative', topic: 'Accuracy', createdAt: daysAgo(2, 6) },
  { id: 'r7', customerName: 'Kiran R.', rating: 5, comment: 'Consistent quality as always.', sentiment: 'Positive', topic: 'Food Quality', createdAt: daysAgo(3) },
  { id: 'r8', customerName: 'Siddharth R.', rating: 4, comment: 'Good food, but the app crashed once while ordering.', sentiment: 'Neutral', topic: 'App Experience', createdAt: daysAgo(3, 10) },
  { id: 'r9', customerName: 'Nisha G.', rating: 5, comment: 'The new mango lassi is heavenly!', sentiment: 'Positive', topic: 'Menu Items', createdAt: daysAgo(4) },
  { id: 'r10', customerName: 'Rahul V.', rating: 5, comment: 'Fast delivery, hot food. Perfect.', sentiment: 'Positive', topic: 'Delivery Speed', createdAt: daysAgo(4, 3) },
];
