import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { 
  EyeOff, 
  ArrowDownLeft, 
  ArrowUpRight, 
  MessageCircle,
  Bell,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Briefcase,
  Wallet,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';



const CURRENCY_META: Record<string, { name: string, symbol: string, flag: string }> = {
  'USD': { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  'EUR': { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  'GBP': { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  'NGN': { name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬' },
  'CAD': { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  'AUD': { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  'JPY': { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  'ZAR': { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  'BRL': { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  'INR': { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  'CNY': { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  'MXN': { name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  'RUB': { name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  'KRW': { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  'TRY': { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
};

export default function DashboardOverview() {
  const { user } = useAuth();
  const [activeCurrencyCode, setActiveCurrencyCode] = useState('USD');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [currentTime, setCurrentTime] = useState(new Date());

  const activeWallet = user?.wallets?.find(w => w.currency === activeCurrencyCode) || user?.wallets?.[0];
  const activeMeta = activeWallet ? CURRENCY_META[activeWallet.currency] || { name: activeWallet.currency, symbol: activeWallet.currency, flag: '🌐' } : CURRENCY_META['USD'];

  useEffect(() => {
    if (user?.wallets?.length && !user.wallets.find(w => w.currency === activeCurrencyCode)) {
      setActiveCurrencyCode(user.wallets[0].currency);
    }
  }, [user, activeCurrencyCode]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountryTimezone = (code: string | undefined) => {
    const map: Record<string, string> = {
      'US': 'America/New_York',
      'GB': 'Europe/London',
      'CA': 'America/Toronto',
      'AU': 'Australia/Sydney',
      'EU': 'Europe/Berlin',
      'JP': 'Asia/Tokyo',
      'NG': 'Africa/Lagos',
      'ZA': 'Africa/Johannesburg',
      'BR': 'America/Sao_Paulo',
      'IN': 'Asia/Kolkata',
      'CN': 'Asia/Shanghai',
      'MX': 'America/Mexico_City',
      'RU': 'Europe/Moscow',
      'KR': 'Asia/Seoul',
      'TR': 'Europe/Istanbul',
      'SE': 'Europe/Stockholm'
    };
    return map[code || ''] || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  };

  const timeString = new Intl.DateTimeFormat('en-US', {
    timeZone: getCountryTimezone(user?.country),
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(currentTime);

  const currentHour = parseInt(new Intl.DateTimeFormat('en-US', {
    timeZone: getCountryTimezone(user?.country),
    hour: 'numeric',
    hour12: false,
  }).format(currentTime));

  let greeting = 'Good evening';
  if (currentHour >= 5 && currentHour < 12) greeting = 'Good morning';
  else if (currentHour >= 12 && currentHour < 17) greeting = 'Good afternoon';

  const isKycApproved = user?.kycStatus === 'APPROVED';

  useEffect(() => {
    // Fetch transactions when component mounts
    const fetchHistory = async () => {
      try {
        const res = await api.get('/transactions/history');
        setTransactions(res.data.transactions.slice(0, 4)); // Only top 4
      } catch (err) {
        console.error("Failed to fetch transactions");
      }
    };
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.notifications);
      } catch (err) {
        console.error("Failed to fetch notifications");
      }
    };
    fetchHistory();
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark all as read");
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pt-2 md:pt-0 pb-12 relative">
      
      {/* KYC LOCKING OVERLAY REMOVED - Using Inline Banner instead */}
      {!isKycApproved && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-4 mb-2 animate-in fade-in">
          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Verification Required</h3>
            <p className="text-sm text-red-200 mt-1">To unlock full access to withdrawals and global transfers, please complete your identity verification.</p>
          </div>
          <Button onClick={() => navigate('/dashboard/kyc')} className="bg-red-500 hover:bg-red-600 text-white shrink-0">
            Complete KYC
          </Button>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="flex items-center justify-between relative z-10">
        <div 
          onClick={() => navigate('/dashboard/settings')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md border border-white/10 group-hover:scale-105 transition-transform">
            {user?.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight group-hover:text-lumina-accent transition-colors">{greeting}, {user?.fullName?.split(' ')[0] || 'User'}</h1>
            <p className="text-xs text-lumina-text-secondary mt-0.5">
              Welcome back to Lumina. <span className="ml-2 px-2 py-0.5 rounded-full bg-lumina-surface border border-lumina-border text-lumina-text-tertiary">🕑 {timeString}</span>
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-lumina-surface border border-lumina-border text-lumina-text-secondary hover:text-white">
            <MessageCircle className="w-4 h-4" />
          </Button>
          
          <div className="relative" ref={notifRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-10 h-10 rounded-full bg-lumina-surface border border-lumina-border text-lumina-accent relative hover:text-white"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </Button>

            {notificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-lumina-surface border border-lumina-border rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-lumina-border flex justify-between items-center">
                  <h3 className="font-bold text-white text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs text-indigo-400 hover:text-indigo-300">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-lumina-text-secondary text-sm">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        onClick={() => !notif.read && markAsRead(notif.id)}
                        className={`p-4 border-b border-lumina-border/50 cursor-pointer transition-colors ${notif.read ? 'bg-transparent' : 'bg-indigo-500/5 hover:bg-indigo-500/10'}`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className={`text-sm font-semibold ${notif.read ? 'text-white' : 'text-indigo-400'}`}>{notif.title}</h4>
                          {!notif.read && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 shrink-0" />}
                        </div>
                        <p className="text-xs text-lumina-text-secondary mt-1">{notif.message}</p>
                        <p className="text-[10px] text-lumina-text-tertiary mt-2">
                          {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2`}>
        
        {/* LEFT COLUMN (Balance & Transactions) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* Main Balance Area (DIRECTLY ON BACKGROUND) */}
          <div className="flex flex-col gap-6 py-2">
            
            <div className="flex items-center justify-between">
              
              {/* Custom Currency Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-lumina-surface border border-lumina-border hover:bg-lumina-surface-light px-4 py-2.5 rounded-full transition-colors"
                >
                  <span className="text-base">{activeMeta.flag}</span>
                  <span className="font-semibold text-white text-sm">{activeWallet?.currency || 'USD'} Balance</span>
                  <ChevronDown className="w-4 h-4 text-lumina-text-secondary ml-1" />
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-lumina-surface border border-lumina-border rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                    {user?.wallets?.map((wallet) => {
                      const meta = CURRENCY_META[wallet.currency] || { name: wallet.currency, symbol: wallet.currency, flag: '🌐' };
                      return (
                        <button
                          key={wallet.currency}
                          onClick={() => {
                            setActiveCurrencyCode(wallet.currency);
                            setDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-lumina-surface-light transition-colors ${activeCurrencyCode === wallet.currency ? 'bg-lumina-surface-light/50' : ''}`}
                        >
                          <span className="text-lg">{meta.flag}</span>
                          <div className="flex flex-col">
                            <span className="font-semibold text-white text-sm">{wallet.currency}</span>
                            <span className="text-xs text-lumina-text-secondary">{meta.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tighter">
                {activeMeta.symbol}{(activeWallet?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h1>
              <Button variant="ghost" size="icon" className="text-lumina-text-tertiary hover:text-white mt-2">
                <EyeOff className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex items-center gap-3 w-full max-w-sm mt-2">
              <Button className="flex-1 bg-white hover:bg-gray-100 text-[#0d1117] h-14 rounded-2xl text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <ArrowDownLeft className="w-5 h-5 mr-1.5" strokeWidth={2.5} /> Add Money
              </Button>
              <Button 
                onClick={() => navigate('/dashboard/withdraw')}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white h-14 rounded-2xl text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <ArrowUpRight className="w-5 h-5 mr-1.5" strokeWidth={2.5} /> Send
              </Button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-white tracking-tight">Recent Transactions</h2>
              <Button variant="link" className="text-indigo-400 hover:text-indigo-300 font-medium text-sm h-auto p-0">
                View All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            <Card className="bg-lumina-surface border-lumina-border rounded-2xl overflow-hidden shadow-sm">
              <div className="flex flex-col">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-lumina-text-secondary">
                    No recent transactions found.
                  </div>
                ) : (
                  transactions.map((tx: any, idx: number) => (
                    <div 
                      key={tx.id} 
                      className={`flex items-center justify-between p-4 hover:bg-lumina-surface-light/50 transition-colors cursor-pointer group ${
                        idx !== transactions.length - 1 ? 'border-b border-lumina-border/60' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-lumina-bg border border-lumina-border flex items-center justify-center shrink-0">
                          {tx.type === 'DEPOSIT' ? <Briefcase className="w-4 h-4 text-blue-400" /> : <ShoppingBag className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{tx.destination}</p>
                          <p className="text-xs text-lumina-text-secondary mt-0.5">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className={`font-semibold text-sm ${tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-white'}`}>
                        {tx.type === 'DEPOSIT' ? '+' : '-'}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: tx.currency || 'USD' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Withdraw Funds */}
          <Card className="bg-lumina-surface border-lumina-border rounded-2xl shadow-sm">
            <CardHeader className="pb-2 pt-5 px-5">
              <CardTitle className="text-base text-white font-bold">Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 px-5 pb-5">
              <p className="text-sm text-lumina-text-secondary leading-relaxed">
                Move money from your Lumina balance to your Bank Account, PayPal, or CashApp instantly.
              </p>
              <Button 
                onClick={() => navigate('/dashboard/withdraw')} 
                className="w-full bg-white hover:bg-gray-100 text-[#0d1117] h-12 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Withdrawal <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Active Card Mini View */}
          <Card className="bg-lumina-surface border-lumina-border rounded-2xl overflow-hidden shadow-sm group cursor-pointer">
            <CardContent className="p-0">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-white">Your Card</h3>
                  <Wallet className="w-4 h-4 text-lumina-text-secondary" />
                </div>
                
                <div className="w-full aspect-[1.586] rounded-xl bg-gradient-to-tr from-gray-900 via-gray-800 to-black p-5 relative overflow-hidden border border-white/10 shadow-lg group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl -mr-8 -mt-8"></div>
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="w-10 h-7 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded flex items-center px-1 opacity-90">
                      <div className="w-full h-px bg-black/20 my-1"></div>
                    </div>
                    <span className="text-white/50 font-bold tracking-widest text-xs">LUMINA</span>
                  </div>
                  
                  <div className="absolute bottom-5 left-5 right-5 z-10">
                    <p className="text-white font-mono text-lg tracking-[0.15em] mb-2 opacity-90">
                      •••• •••• •••• 8164
                    </p>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-white text-xs font-medium tracking-widest uppercase mt-0.5">
                          REQUEST ACCESS
                        </p>
                      </div>
                      <div className="flex -space-x-1.5 opacity-80">
                        <div className="w-6 h-6 rounded-full bg-red-500/80 mix-blend-screen"></div>
                        <div className="w-6 h-6 rounded-full bg-orange-500/80 mix-blend-screen"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-5 py-3 border-t border-lumina-border bg-white/[0.02] flex justify-between items-center group-hover:bg-white/[0.04] transition-colors">
                <span className="text-xs font-medium text-lumina-text-secondary">Card Settings</span>
                <ChevronRight className="w-4 h-4 text-lumina-text-tertiary group-hover:text-white transition-colors" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
