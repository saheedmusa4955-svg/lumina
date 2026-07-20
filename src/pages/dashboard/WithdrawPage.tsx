import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Building, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Custom SVG Logos for Brands
const PaypalLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#00457C]">
    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.641.641 0 0 1 .633-.532h5.736c2.754 0 4.704.59 5.8 1.956 1.134 1.417 1.305 3.513.684 5.922-.72 2.793-2.525 4.67-4.662 5.503-1.12.436-2.433.616-3.834.616H7.957a.641.641 0 0 0-.633.533l-.248 4.04z" />
    <path fill="#152C5B" d="M9.167 13.184c-1.402 0-2.715-.18-3.835-.616a.641.641 0 0 0-.82.417l-.822 4.148-.25 4.04a.641.641 0 0 0 .633.74h4.606a.641.641 0 0 0 .633-.533l.942-5.96a.641.641 0 0 1 .633-.532h1.345c2.138 0 3.943-1.877 4.662-4.67.62-2.41.45-4.505-.684-5.922C14.773 13.065 12.333 13.184 9.167 13.184z" />
  </svg>
);

const CashAppLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#00D632]">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2H9v-2h4v-2H9V9h2V7h2v2h2v2h-4v2h4v4h-2v2z" />
  </svg>
);

const WesternUnionLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
    <rect width="24" height="24" rx="4" fill="#FFD100" />
    <path d="M5 8h4.5l2 5 2-5H18l-4 9H9.5l-2-5-1.5 5H4l3-9z" fill="#000000" />
  </svg>
);

const WiseLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#9FE870]">
    <path d="M11.5 2L16 12H8.5L7 16H3L7.5 5.5H11.5L13.5 1.5L11.5 2z" />
    <path fill="#00B9FF" d="M16 12h-4.5L10 16h4.5L16 12z" />
  </svg>
);

const LuminaLogo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WITHDRAW_METHODS = [
  { id: 'lumina', name: 'Lumina User', time: 'Instant & Free', icon: null, customIcon: LuminaLogo, color: '', bg: 'bg-indigo-500/10 text-indigo-400' },
  { id: 'bank', name: 'Bank Transfer', time: '1-3 business days', icon: Building, customIcon: null, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'paypal', name: 'PayPal', time: 'Instant', icon: null, customIcon: PaypalLogo, color: '', bg: 'bg-white' },
  { id: 'cashapp', name: 'CashApp', time: 'Instant', icon: null, customIcon: CashAppLogo, color: '', bg: 'bg-white' },
  { id: 'western_union', name: 'Western Union', time: 'Minutes', icon: null, customIcon: WesternUnionLogo, color: '', bg: 'bg-black' },
  { id: 'wise', name: 'Wise', time: 'Instant', icon: null, customIcon: WiseLogo, color: '', bg: 'bg-[#121B24]' },
];


export default function WithdrawPage() {
  const { user, refreshUser } = useAuth();
  const [method, setMethod] = useState(WITHDRAW_METHODS[0].id);
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState<any[]>([]);
  const [currency, setCurrency] = useState(user?.wallets?.[0]?.currency || 'USD');
  
  useEffect(() => {
    if (user?.wallets?.length && !user.wallets.find(w => w.currency === currency)) {
      setCurrency(user.wallets[0].currency);
    }
  }, [user, currency]);

  const activeWallet = user?.wallets?.find(w => w.currency === currency);
  
  // Security Modal State
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
  // Name Resolution State
  const [resolvedName, setResolvedName] = useState<string | null>(null);
  const [resolvingName, setResolvingName] = useState(false);

  const isInactive = user?.accountStatus === 'INACTIVE';

  useEffect(() => {
    api.get('/transactions/contacts')
      .then(res => setContacts(res.data.contacts))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (method === 'lumina' && recipient.length === 8) {
      setResolvingName(true);
      setResolvedName(null);
      const timer = setTimeout(() => {
        api.get(`/transactions/lookup/${recipient}`)
          .then(res => setResolvedName(res.data.name))
          .catch(() => setResolvedName(null))
          .finally(() => setResolvingName(false));
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setResolvedName(null);
    }
  }, [recipient, method]);

  const initiateTransaction = () => {
    setError('');
    setPassword('');
    setTwoFactorCode('');
    setSecurityModalOpen(true);
  };

  const submitTransaction = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      if (method === 'lumina') {
        await api.post('/transactions/transfer', { amount: parseFloat(amount), destination: recipient, password, twoFactorCode, currency });
      } else {
        await api.post('/transactions/withdraw', { amount: parseFloat(amount), destination: recipient, method, password, twoFactorCode, currency });
      }
      
      await refreshUser(); // Update balance
      setSecurityModalOpen(false);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full pt-12 pb-24 text-center">
        <div className={`w-24 h-24 rounded-full ${isInactive ? 'bg-orange-500/10' : 'bg-emerald-500/10'} flex items-center justify-center mb-6`}>
          <CheckCircle2 className={`w-12 h-12 ${isInactive ? 'text-orange-400' : 'text-emerald-400'}`} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">
          {isInactive ? 'Transaction Pending' : 'Transaction Processing'}
        </h1>
        <p className="text-lumina-text-secondary mb-8 max-w-md mx-auto">
          {isInactive ? 
            `Your request to send ${parseFloat(amount || '0').toLocaleString('en-US', { style: 'currency', currency: currency || 'USD' })} via ${WITHDRAW_METHODS.find(m => m.id === method)?.name} has been submitted and is pending admin approval.` :
            `Your request to send ${parseFloat(amount || '0').toLocaleString('en-US', { style: 'currency', currency: currency || 'USD' })} via ${WITHDRAW_METHODS.find(m => m.id === method)?.name} has been submitted.`
          }
        </p>
        <Button onClick={() => window.location.href = '/dashboard'} className="bg-indigo-500 hover:bg-indigo-600 text-white h-12 px-8 rounded-xl">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full pt-4 md:pt-0 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Send & Withdraw</h1>
        <p className="text-sm text-lumina-text-secondary mt-1">Transfer funds instantly to friends or withdraw to external accounts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Method Selection */}
        <div className="flex flex-col gap-4">
          <h2 className="text-sm font-bold text-lumina-text-secondary uppercase tracking-wider">Select Destination</h2>
          
          <div className="flex flex-col gap-3">
            {WITHDRAW_METHODS.map(m => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  method === m.id 
                    ? 'bg-indigo-500/10 border-indigo-500 ring-1 ring-indigo-500/50' 
                    : 'bg-lumina-surface border-lumina-border hover:bg-lumina-surface-light'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full ${m.bg} flex items-center justify-center shrink-0 shadow-sm border border-white/10`}>
                    {m.customIcon ? <m.customIcon /> : <m.icon className={`w-5 h-5 ${m.color}`} />}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-white text-sm">{m.name}</p>
                    <p className="text-xs text-lumina-text-secondary mt-0.5">{m.time}</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  method === m.id ? 'border-indigo-500' : 'border-lumina-border'
                }`}>
                  {method === m.id && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full" />}
                </div>
              </button>
            ))}
          </div>

          {/* Recent Contacts (Only for Lumina Transfers) */}
          {method === 'lumina' && contacts.length > 0 && (
            <div className="flex flex-col gap-4 animate-in fade-in pt-4">
              <h2 className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider">Recent Contacts</h2>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {contacts.map(contact => (
                  <button 
                    key={contact.id} 
                    onClick={() => setRecipient(contact.accountNumber)}
                    className="flex flex-col items-center gap-2 min-w-[72px]"
                  >
                    <div className={`w-14 h-14 rounded-full ${contact.color} flex items-center justify-center text-white font-bold text-lg shadow-sm border border-white/10 ring-2 ring-transparent transition-all hover:ring-indigo-500/50`}>
                      {contact.avatar}
                    </div>
                    <span className="text-xs text-lumina-text-secondary font-medium truncate w-full text-center">
                      {contact.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Amount & Details */}
        <div className="flex flex-col gap-6">
          <Card className="bg-lumina-surface border-lumina-border rounded-2xl shadow-xl overflow-hidden">
            <CardContent className="p-6 md:p-8 flex flex-col gap-6">
              {isInactive && (
                <div className="text-orange-500 text-sm p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  Your account is currently inactive. Outbound transfers and withdrawals have been disabled.
                </div>
              )}
              {error && <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">{error}</div>}
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider">Amount & Currency</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input 
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-lumina-bg border-lumina-border text-white h-14 rounded-xl text-xl font-bold pl-4"
                    />
                  </div>
                  <Select onValueChange={setCurrency} value={currency}>
                    <SelectTrigger className="w-[110px] h-14 bg-lumina-bg border-lumina-border text-white rounded-xl">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-lumina-surface border-lumina-border text-white">
                      {user?.wallets?.map(w => (
                        <SelectItem key={w.currency} value={w.currency} className="focus:bg-lumina-surface-light focus:text-white cursor-pointer">
                          {w.currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-lumina-text-tertiary mt-1 text-right">
                  Available balance: {currency} {(activeWallet?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              {method === 'lumina' && (
                <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                  <label className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider">Recipient</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lumina-text-tertiary" />
                    <Input 
                      placeholder="8-Digit Account Number" 
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className={`pl-10 bg-lumina-bg border-lumina-border h-12 rounded-xl text-white font-mono tracking-widest ${resolvedName ? 'border-emerald-500/50 focus-visible:ring-emerald-500/50' : ''}`} 
                      maxLength={8}
                    />
                  </div>
                  {resolvingName ? (
                    <p className="text-xs text-lumina-text-secondary animate-pulse ml-2">Looking up account...</p>
                  ) : resolvedName ? (
                    <p className="text-xs text-emerald-400 font-medium ml-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {resolvedName}
                    </p>
                  ) : recipient.length === 8 && !resolvingName && !resolvedName ? (
                    <p className="text-xs text-red-400 font-medium ml-2">Account not found</p>
                  ) : null}
                </div>
              )}

              {method === 'bank' && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider">Routing Number</label>
                    <Input placeholder="Enter routing number" className="bg-lumina-bg border-lumina-border h-12 rounded-xl text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider">Account Number</label>
                    <Input placeholder="Enter account number" className="bg-lumina-bg border-lumina-border h-12 rounded-xl text-white" />
                  </div>
                </div>
              )}

              {(method === 'paypal' || method === 'cashapp' || method === 'wise') && (
                <div className="flex flex-col gap-2 animate-in fade-in duration-300">
                  <label className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider">
                    {method === 'paypal' ? 'PayPal Email' : method === 'cashapp' ? 'CashApp $Cashtag' : 'Wise Email'}
                  </label>
                  <Input placeholder={method === 'paypal' || method === 'wise' ? "email@example.com" : "$username"} className="bg-lumina-bg border-lumina-border h-12 rounded-xl text-white" />
                </div>
              )}

              {method === 'western_union' && (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider">Recipient Full Name</label>
                    <Input placeholder="John Doe" className="bg-lumina-bg border-lumina-border h-12 rounded-xl text-white" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider">Destination Country</label>
                    <Input placeholder="United Kingdom" className="bg-lumina-bg border-lumina-border h-12 rounded-xl text-white" />
                  </div>
                </div>
              )}

              <Button 
                disabled={!amount || parseFloat(amount) <= 0 || (method === 'lumina' && (!recipient || recipient.length !== 8 || !resolvedName)) || isLoading}
                onClick={initiateTransaction}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white h-14 rounded-xl text-sm font-bold transition-transform active:scale-[0.98] mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Continue {amount ? parseFloat(amount).toLocaleString('en-US', { style: 'currency', currency: currency || 'USD' }) : ''} <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </Button>

            </CardContent>
          </Card>
        </div>

      </div>

      {/* Security Verification Modal */}
      <Dialog open={securityModalOpen} onOpenChange={setSecurityModalOpen}>
        <DialogContent className="sm:max-w-md bg-lumina-surface border-lumina-border">
          <DialogHeader>
            <DialogTitle className="text-white">Security Verification</DialogTitle>
            <DialogDescription className="text-lumina-text-secondary">
              Please verify your identity to complete this transaction.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            {error && <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">{error}</div>}
            
            {user?.isTwoFactorEnabled ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-lumina-text-secondary">Authenticator Code</label>
                <Input 
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="bg-lumina-bg border-lumina-border text-white text-center text-2xl tracking-widest h-14"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-lumina-text-secondary">Account Password</label>
                <Input 
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-lumina-bg border-lumina-border text-white h-12"
                />
              </div>
            )}
            
            <Button 
              onClick={submitTransaction}
              disabled={isLoading || (user?.isTwoFactorEnabled ? twoFactorCode.length < 6 : !password)}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white mt-4 h-12"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Confirm Transaction'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
