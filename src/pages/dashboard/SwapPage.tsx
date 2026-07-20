import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDownUp, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const RATES: Record<string, number> = {
  'USD_EUR': 0.92,
  'EUR_USD': 1.09,
  'USD_GBP': 0.79,
  'GBP_USD': 1.27,
  'USD_NGN': 1150.50,
  'NGN_USD': 0.00087,
  'EUR_NGN': 1250.00,
  'NGN_EUR': 0.0008,
  'GBP_NGN': 1450.00,
  'NGN_GBP': 0.00069,
};

// Fallback rates logic if not in RATES table
const getRate = (from: string, to: string) => {
  if (from === to) return 1;
  const key = `${from}_${to}`;
  if (RATES[key]) return RATES[key];
  
  // Try via USD
  if (from !== 'USD' && to !== 'USD') {
    const fromUsd = RATES[`${from}_USD`] || 1;
    const usdTo = RATES[`USD_${to}`] || 1;
    return fromUsd * usdTo;
  }
  return 1; // Default fallback
};

export default function SwapPage() {
  const { user, refreshUser } = useAuth();
  
  const [fromCurrency, setFromCurrency] = useState(user?.wallets?.[0]?.currency || 'USD');
  const [toCurrency, setToCurrency] = useState(user?.wallets?.[1]?.currency || 'EUR');
  
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
  const isInactive = user?.accountStatus === 'INACTIVE';
  const fromWallet = user?.wallets?.find(w => w.currency === fromCurrency);
  const toWallet = user?.wallets?.find(w => w.currency === toCurrency);

  const rate = getRate(fromCurrency, toCurrency);
  const estimatedAmount = amount ? (parseFloat(amount) * rate).toFixed(2) : '0.00';

  const handleSwapClick = () => {
    const fromVal = parseFloat(amount);
    if (!amount || isNaN(fromVal) || fromVal <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if ((fromWallet?.balance || 0) < fromVal) {
      setError('Insufficient funds for this swap.');
      return;
    }
    setError('');
    setPassword('');
    setTwoFactorCode('');
    setSecurityModalOpen(true);
  };

  const handleSwapSubmit = async () => {
    setIsLoading(true);
    setError('');
    try {
      await api.post('/transactions/swap', {
        fromCurrency,
        toCurrency,
        amount: parseFloat(amount),
        password,
        twoFactorCode
      });
      await refreshUser();
      setSecurityModalOpen(false);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Swap failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full pt-12 pb-24 text-center">
        <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-4">
          Swap Successful
        </h1>
        <p className="text-lumina-text-secondary mb-8 max-w-md mx-auto">
          You successfully converted {fromCurrency} {parseFloat(amount).toFixed(2)} to {toCurrency} {estimatedAmount}.
        </p>
        <Button onClick={() => window.location.href = '/dashboard'} className="bg-indigo-500 hover:bg-indigo-600 text-white h-12 px-8 rounded-xl">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full pt-4 md:pt-0 pb-16">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Currency Swap</h1>
        <p className="text-sm text-lumina-text-secondary mt-1">Convert your funds instantly using real-time market rates.</p>
      </div>

      <Card className="bg-lumina-surface border-lumina-border rounded-2xl shadow-xl overflow-hidden relative">
        <CardContent className="p-6 md:p-8 flex flex-col gap-6">
          {isInactive && (
            <div className="text-orange-500 text-sm p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
              Your account is currently inactive. Swaps are disabled.
            </div>
          )}
          {error && <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg">{error}</div>}
          
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider flex justify-between">
              <span>You Pay</span>
              <span className="text-lumina-text-tertiary font-normal normal-case">
                Balance: {(fromWallet?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </label>
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
              <Select onValueChange={setFromCurrency} value={fromCurrency}>
                <SelectTrigger className="w-[120px] h-14 bg-lumina-bg border-lumina-border text-white rounded-xl">
                  <SelectValue placeholder="From" />
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
          </div>

          <div className="relative flex items-center justify-center -my-2">
            <div className="absolute left-0 right-0 h-px bg-lumina-border" />
            <button 
              onClick={() => {
                setFromCurrency(toCurrency);
                setToCurrency(fromCurrency);
                setAmount(estimatedAmount);
              }}
              className="relative w-10 h-10 bg-lumina-bg border border-lumina-border rounded-full flex items-center justify-center text-lumina-text-secondary hover:text-white hover:bg-lumina-surface-light transition-all shadow-md z-10"
            >
              <ArrowDownUp className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-lumina-text-secondary uppercase tracking-wider flex justify-between">
              <span>You Receive</span>
              <span className="text-lumina-text-tertiary font-normal normal-case">
                Balance: {(toWallet?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input 
                  type="number"
                  placeholder="0.00"
                  value={estimatedAmount}
                  readOnly
                  className="bg-lumina-bg/50 border-lumina-border text-white/50 h-14 rounded-xl text-xl font-bold pl-4 cursor-not-allowed"
                />
              </div>
              <Select onValueChange={setToCurrency} value={toCurrency}>
                <SelectTrigger className="w-[120px] h-14 bg-lumina-bg border-lumina-border text-white rounded-xl">
                  <SelectValue placeholder="To" />
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
            
            <div className="mt-2 text-xs text-lumina-text-tertiary flex items-center justify-between">
              <span>Exchange Rate</span>
              <span className="font-medium text-white">1 {fromCurrency} = {rate} {toCurrency}</span>
            </div>
          </div>

          <Button 
            disabled={!amount || parseFloat(amount) <= 0 || fromCurrency === toCurrency || isInactive || isLoading}
            onClick={handleSwapClick}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white h-14 rounded-xl text-sm font-bold transition-transform active:scale-[0.98] mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Confirm Swap'
            )}
          </Button>

        </CardContent>
      </Card>

      {/* Security Verification Modal */}
      <Dialog open={securityModalOpen} onOpenChange={setSecurityModalOpen}>
        <DialogContent className="sm:max-w-md bg-lumina-surface border-lumina-border">
          <DialogHeader>
            <DialogTitle className="text-white">Security Verification</DialogTitle>
            <DialogDescription className="text-lumina-text-secondary">
              Please verify your identity to complete this swap.
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
              onClick={handleSwapSubmit}
              disabled={isLoading || (user?.isTwoFactorEnabled ? twoFactorCode.length < 6 : !password)}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white mt-4 h-12"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Process Swap'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
