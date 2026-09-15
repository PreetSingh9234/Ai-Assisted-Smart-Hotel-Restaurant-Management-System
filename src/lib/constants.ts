import { LayoutDashboard, ClipboardList, ChefHat, Truck, UtensilsCrossed, Package, Users, BarChart3, Sparkles, MessageCircle, TrendingUp, SmilePlus, FileText, Settings2 } from 'lucide-react';

export const navItems = [
  {
    section: 'Main',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Operations',
    items: [
      { label: 'Orders', href: '/orders', icon: ClipboardList },
      { label: 'Kitchen', href: '/kitchen', icon: ChefHat },
      { label: 'Delivery', href: '/delivery', icon: Truck },
    ],
  },
  {
    section: 'Restaurant',
    items: [
      { label: 'Menu', href: '/menu', icon: UtensilsCrossed },
      { label: 'Inventory', href: '/inventory', icon: Package },
      { label: 'Customers', href: '/customers', icon: Users },
    ],
  },
  {
    section: 'Analytics',
    items: [
      { label: 'Sales', href: '/analytics/sales', icon: BarChart3 },
      { label: 'AI Insights', href: '/analytics/ai-insights', icon: Sparkles },
    ],
  },
  {
    section: 'AI',
    items: [
      { label: 'NORA', href: '/ai/nora', icon: MessageCircle },
      { label: 'Predictions', href: '/ai/predictions', icon: TrendingUp },
      { label: 'Sentiment', href: '/ai/sentiment', icon: SmilePlus },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Reports', href: '/reports', icon: FileText },
      { label: 'Settings', href: '/settings', icon: Settings2 },
    ],
  },
];
