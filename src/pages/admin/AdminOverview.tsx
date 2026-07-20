import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Activity, CreditCard } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function AdminOverview() {
  const [walletEmail, setWalletEmail] = useState('');
  const [walletAmount, setWalletAmount] = useState('');
  const [creditCurrency, setCreditCurrency] = useState('USD');
  const [stats, setStats] = useState<{ totalUsers: number, pendingTransactions: number, balances: { currency: string, balance: number }[] }>({ totalUsers: 0, pendingTransactions: 0, balances: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/overview');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCreditWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletEmail || !walletAmount) return;
    
    setIsLoading(true);
    try {
      await api.post('/admin/credit-wallet', {
        identifier: walletEmail,
        amount: parseFloat(walletAmount),
        currency: creditCurrency
      });
      toast.success(`Successfully credited ${creditCurrency} ${walletAmount} to ${walletEmail}`);
      setWalletEmail('');
      setWalletAmount('');
      fetchStats(); // Refresh stats
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to credit wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Admin Dashboard</h1>
        <p className="text-lumina-text-secondary mt-1">System overview and quick actions.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-lumina-surface border-lumina-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-lumina-text-secondary">Total Users</p>
              <h2 className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-lumina-surface border-lumina-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-lumina-text-secondary">Pending Transactions</p>
              <h2 className="text-2xl font-bold text-white">{stats.pendingTransactions.toLocaleString()}</h2>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-lumina-surface border-lumina-border">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-lumina-text-secondary mb-2">User Balances</p>
              <div className="flex flex-col gap-1 max-h-24 overflow-y-auto pr-2 scrollbar-hide">
                {stats.balances.length === 0 ? (
                  <h2 className="text-2xl font-bold text-white">$0.00</h2>
                ) : (
                  stats.balances.map(b => (
                    <div key={b.currency} className="flex justify-between items-center text-sm font-mono text-white">
                      <span>{b.currency}</span>
                      <span>{b.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Action: Credit Wallet */}
        <Card className="bg-lumina-surface border-lumina-border">
          <CardHeader>
            <CardTitle className="text-lg text-white">Credit User Wallet</CardTitle>
            <CardDescription className="text-lumina-text-secondary">Manually add funds to a user's account.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreditWallet} className="flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-lumina-text-secondary">User Email or ID</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required
                  placeholder="user@example.com"
                  value={walletEmail}
                  onChange={(e) => setWalletEmail(e.target.value)}
                  className="bg-lumina-bg border-lumina-border text-white focus-visible:ring-red-500" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-lumina-text-secondary">Amount</Label>
                <div className="flex gap-2">
                  <Input 
                    id="amount" 
                    type="number" 
                    required
                    min="0.01"
                    step="0.01"
                    placeholder="100.00"
                    value={walletAmount}
                    onChange={(e) => setWalletAmount(e.target.value)}
                    className="bg-lumina-bg border-lumina-border text-white focus-visible:ring-red-500 flex-1" 
                  />
                  <Select value={creditCurrency} onValueChange={setCreditCurrency}>
                    <SelectTrigger className="w-[100px] bg-lumina-bg border-lumina-border text-white">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-lumina-surface border-lumina-border text-white">
                      {['USD', 'EUR', 'GBP', 'NGN'].map(c => (
                        <SelectItem key={c} value={c} className="focus:bg-lumina-surface-light focus:text-white cursor-pointer">
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" disabled={isLoading} className="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold">
                {isLoading ? 'Crediting...' : 'Credit Wallet'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Action: Alerts */}
        <Card className="bg-lumina-surface border-lumina-border">
          <CardHeader>
            <CardTitle className="text-lg text-white">System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="bg-lumina-bg border border-lumina-border p-4 rounded-xl flex gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">Pending Approvals</p>
                  <p className="text-xs text-lumina-text-secondary mt-1">You have {stats.pendingTransactions} pending transaction(s) requiring admin review.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
