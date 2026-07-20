import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Search, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/transactions/pending');
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await api.post(`/admin/transactions/${id}/approve`);
      setTransactions(transactions.filter(tx => tx.id !== id));
      alert(`Transaction approved successfully.`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to approve');
    }
  };

  const handleDecline = async (id: string) => {
    const reason = prompt("Please enter a reason for declining:");
    if (!reason) return;

    try {
      await api.post(`/admin/transactions/${id}/decline`, { reason });
      setTransactions(transactions.filter(tx => tx.id !== id));
      alert(`Transaction declined.`);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to decline');
    }
  };

  const filteredTransactions = transactions.filter(tx => 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Transaction Control</h1>
          <p className="text-lumina-text-secondary mt-1">Approve pending transactions or reverse completed ones.</p>
        </div>
      </div>

      <div className="relative w-full md:w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-lumina-text-tertiary" />
        <Input 
          placeholder="Search by TX ID or User..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-lumina-surface border-lumina-border focus-visible:ring-red-500 text-white h-10"
        />
      </div>

      <Card className="bg-lumina-surface border-lumina-border overflow-x-auto rounded-xl">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-lumina-border bg-lumina-bg/50">
              <th className="p-4 text-sm font-semibold text-lumina-text-secondary uppercase tracking-wider">TX ID</th>
              <th className="p-4 text-sm font-semibold text-lumina-text-secondary uppercase tracking-wider">User</th>
              <th className="p-4 text-sm font-semibold text-lumina-text-secondary uppercase tracking-wider">Type</th>
              <th className="p-4 text-sm font-semibold text-lumina-text-secondary uppercase tracking-wider">Amount</th>
              <th className="p-4 text-sm font-semibold text-lumina-text-secondary uppercase tracking-wider">Status</th>
              <th className="p-4 text-sm font-semibold text-lumina-text-secondary uppercase tracking-wider">Date</th>
              <th className="p-4 text-sm font-semibold text-lumina-text-secondary uppercase tracking-wider text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lumina-border/40">
            {filteredTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-lumina-surface-light/30 transition-colors">
                <td className="p-4 font-mono text-sm text-lumina-text-secondary">{tx.id.substring(0, 8)}...</td>
                <td className="p-4 font-medium text-white">{tx.user?.fullName} <br/><span className="text-xs text-lumina-text-secondary">{tx.user?.email}</span></td>
                <td className="p-4 text-sm text-lumina-text-secondary">{tx.type}</td>
                <td className="p-4 font-medium text-white">${tx.amount.toFixed(2)}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    tx.status === 'Completed' ? 'bg-green-500/10 text-green-500' :
                    tx.status === 'Pending' || tx.status === 'Flagged' ? 'bg-yellow-500/10 text-yellow-500' :
                    tx.status === 'Reversed' ? 'bg-blue-500/10 text-blue-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {tx.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-lumina-text-secondary">{new Date(tx.createdAt).toLocaleString()}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {tx.status === 'PENDING' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleApprove(tx.id)}
                          className="text-green-500 hover:text-green-400 hover:bg-lumina-surface-light h-8 px-2"
                          title="Approve Transaction"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDecline(tx.id)}
                          className="text-red-500 hover:text-red-400 hover:bg-lumina-surface-light h-8 px-2"
                          title="Decline Transaction"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-lumina-text-secondary">
                  No transactions found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
