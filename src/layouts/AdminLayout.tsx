import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ArrowLeftRight, 
  Settings, 
  LogOut,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ADMIN_NAV = [
  { title: 'Dashboard', url: '/adminxyz', icon: LayoutDashboard },
  { title: 'Users', url: '/adminxyz/users', icon: Users },
  { title: 'Transactions', url: '/adminxyz/transactions', icon: ArrowLeftRight },
  { title: 'Settings', url: '/adminxyz/settings', icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-lumina-bg overflow-hidden text-white">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-lumina-surface border-r border-lumina-border shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-lumina-border">
          <Link to="/adminxyz" className="flex items-center gap-3 group w-max">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-red-400 transition-colors duration-300 block leading-tight">
                Lumina
              </span>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest block leading-tight">Admin Portal</span>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 scrollbar-hide">
          <p className="px-4 text-xs font-semibold text-lumina-text-tertiary uppercase tracking-wider mb-2">Management</p>
          {ADMIN_NAV.map((item) => {
            const isActive = location.pathname === item.url || (location.pathname.startsWith(item.url) && item.url !== '/adminxyz');
            // Strict exact match for the index route to prevent all tabs highlighting
            const isStrictActive = item.url === '/adminxyz' ? location.pathname === '/adminxyz' : isActive;
            
            return (
              <Link 
                key={item.title} 
                to={item.url}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                  isStrictActive 
                    ? "bg-red-500/10 text-red-400" 
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-lumina-text-secondary hover:bg-lumina-surface-light hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* TOP HEADER */}
        <header className="h-16 md:h-20 flex items-center justify-between px-4 sm:px-8 border-b border-lumina-border bg-lumina-bg/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Admin</span>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-xl font-semibold text-white">System Administration</h2>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8">
          <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-lumina-surface/95 backdrop-blur-md border-t border-lumina-border z-50 px-2 py-2 pb-safe">
        <div className="flex items-center justify-around">
          {ADMIN_NAV.map((item) => {
            const isActive = location.pathname === item.url || (location.pathname.startsWith(item.url) && item.url !== '/adminxyz');
            const isStrictActive = item.url === '/adminxyz' ? location.pathname === '/adminxyz' : isActive;
            
            return (
              <Link 
                key={item.title} 
                to={item.url}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all gap-1",
                  isStrictActive 
                    ? "text-red-400" 
                    : "text-lumina-text-secondary hover:text-white"
                )}
              >
                <div className={cn("p-1 rounded-full", isStrictActive && "bg-red-500/10")}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{item.title}</span>
              </Link>
            )
          })}
        </div>
      </nav>
      
    </div>
  );
}
