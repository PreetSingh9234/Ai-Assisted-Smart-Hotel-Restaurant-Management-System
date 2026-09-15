export interface Order {
  id: string;
  customerName: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'New' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Delayed' | 'Cancelled';
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  available: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'Normal' | 'Low' | 'Critical';
  dailyUsage: number;
}

export interface Customer {
  id: string;
  name: string;
  ordersCount: number;
  totalSpend: number;
  favoriteDish: string;
  lastOrderAt: string;
  segment: 'VIP' | 'Regular' | 'New' | 'At Risk';
}
