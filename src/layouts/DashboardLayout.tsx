import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  CreditCard, 
  Clock, 
  User, 
  LogOut,
  ArrowRightLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { title: 'Home', url: '/dashboard', icon: Home },
  { title: 'Cards', url: '/dashboard/cards', icon: CreditCard },
  // History and Profile are added later in the bottom nav to accommodate the center button
  { title: 'History', url: '/dashboard/transactions', icon: Clock },
  { title: 'Swap', url: '/dashboard/swap', icon: ArrowRightLeft },
  { title: 'Profile', url: '/dashboard/settings', icon: User },
];

export function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-lumina-bg overflow-hidden text-white">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-lumina-surface border-r border-lumina-border shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-lumina-border">
          <Link to="/dashboard" className="flex items-center gap-3 group w-max">
            <div className="w-9 h-9 rounded-xl bg-lumina-accent flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-lumina-accent/20">
              <span className="font-bold text-lumina-bg text-xl tracking-tighter">L</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-white group-hover:text-lumina-accent transition-colors duration-300">
              Lumina
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 scrollbar-hide">
          <p className="px-4 text-xs font-semibold text-lumina-text-tertiary uppercase tracking-wider mb-2">Menu</p>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.url || (item.url !== '/dashboard' && location.pathname.startsWith(item.url));
            const isStrictActive = item.url === '/dashboard' ? location.pathname === '/dashboard' : isActive;
            
            return (
              <Link 
                key={item.title} 
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                  isStrictActive 
                    ? "bg-lumina-accent/10 text-lumina-accent" 
                    : "text-lumina-text-secondary hover:bg-lumina-surface-light hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-lumina-border">
          <Link 
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-lumina-text-secondary hover:bg-lumina-danger/10 hover:text-lumina-danger"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-lumina-surface border-t border-lumina-border z-50 px-6 py-2 pb-safe">
        <div className="flex items-center justify-between relative">
          
          {/* Left Side Links */}
          <div className="flex items-center gap-8">
            {NAV_ITEMS.slice(0, 2).map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link 
                  key={item.title} 
                  to={item.url}
                  className={cn(
                    "flex flex-col items-center justify-center transition-all gap-1",
                    isActive ? "text-lumina-accent" : "text-lumina-text-secondary hover:text-white"
                  )}
                >
                  <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.title}</span>
                </Link>
              )
            })}
          </div>

          {/* Floating Center Action Button */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-8">
            <div className="bg-lumina-bg p-2 rounded-full">
              <button className="w-14 h-14 bg-lumina-accent rounded-full flex items-center justify-center shadow-lg shadow-lumina-accent/20 hover:scale-105 active:scale-95 transition-transform">
                <span className="font-bold text-lumina-bg text-3xl tracking-tighter">L</span>
              </button>
            </div>
          </div>

          {/* Right Side Links */}
          <div className="flex items-center gap-8">
            {NAV_ITEMS.slice(2, 4).map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link 
                  key={item.title} 
                  to={item.url}
                  className={cn(
                    "flex flex-col items-center justify-center transition-all gap-1",
                    isActive ? "text-lumina-accent" : "text-lumina-text-secondary hover:text-white"
                  )}
                >
                  <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium">{item.title}</span>
                </Link>
              )
            })}
          </div>

        </div>
      </nav>
      
    </div>
  );
}
