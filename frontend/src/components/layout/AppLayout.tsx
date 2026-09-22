import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { NoraDrawer } from '@/components/ai/NoraDrawer';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-nora-bg">
      <Sidebar />
      <div className="flex-col flex-1 min-w-0 overflow-y-auto scroll-smooth">
        <Topbar />
        <main className="p-4 md:p-6 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      <NoraDrawer />

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-nora-border flex items-center justify-around z-30 pb-safe">
        {/* We'll populate this later with mobile icons */}
      </div>
    </div>
  );
}
