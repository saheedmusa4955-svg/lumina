import { useState, useEffect } from 'react';
import { Search, Calendar, Filter, Download, ArrowDownLeft, ArrowUpRight, Tv, ArrowRightLeft, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import api from '@/lib/api';

// Helper to group transactions by date
const groupTransactionsByDate = (transactions: any[]) => {
  const groups: { [key: string]: any[] } = {};
  transactions.forEach((tx) => {
    const date = new Date(tx.createdAt);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(tx);
  });

  return Object.keys(groups).map((date) => ({
    date,
    transactions: groups[date]
  }));
};

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionGroups, setTransactionGroups] = useState<{date: string, transactions: any[]}[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get('/transactions/history');
        const grouped = groupTransactionsByDate(res.data.transactions);
        setTransactionGroups(grouped);
      } catch (err) {
        console.error("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pt-2 md:pt-0 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">History</h1>
          <p className="text-sm text-lumina-text-secondary mt-1">Track your spending and income.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-lumina-border bg-lumina-surface text-white hover:bg-lumina-surface-light h-10 rounded-xl">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button variant="outline" size="icon" className="border-lumina-border bg-lumina-surface text-white hover:bg-lumina-surface-light h-10 w-10 rounded-xl">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-lumina-border bg-lumina-surface text-white hover:bg-lumina-surface-light h-10 w-10 rounded-xl">
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-lumina-border w-full">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`py-3 px-6 text-sm font-semibold transition-colors relative ${
            activeTab === 'transactions' 
              ? 'text-white' 
              : 'text-lumina-text-secondary hover:text-white'
          }`}
        >
          All Transactions
          {activeTab === 'transactions' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`py-3 px-6 text-sm font-semibold transition-colors relative ${
            activeTab === 'insights' 
              ? 'text-white' 
              : 'text-lumina-text-secondary hover:text-white'
          }`}
        >
          Spending Insights
          {activeTab === 'insights' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === 'transactions' && (
        <div className="flex flex-col gap-6">
          
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lumina-text-tertiary" />
            <Input 
              placeholder="Search by name, category, or amount..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 bg-lumina-surface border-lumina-border focus-visible:ring-indigo-500 text-white h-12 rounded-xl text-sm"
            />
          </div>

          {/* Transaction List (Grouped by Date) */}
          <div className="flex flex-col gap-8 mt-2">
            {loading ? (
              <div className="text-center py-10 text-lumina-text-secondary">Loading transactions...</div>
            ) : transactionGroups.length === 0 ? (
              <div className="text-center py-10 text-lumina-text-secondary">No transactions found.</div>
            ) : transactionGroups.map((group) => (
              <div key={group.date} className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-lumina-text-secondary uppercase tracking-widest ml-1">{group.date}</h3>
                
                <Card className="bg-lumina-surface border-lumina-border rounded-2xl overflow-hidden shadow-sm">
                  <div className="flex flex-col">
                    {group.transactions.map((tx, idx) => {
                      const isIncome = tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN';
                      const isTransfer = tx.type === 'TRANSFER' || tx.type === 'TRANSFER_OUT';
                      const TxIcon = isIncome ? ArrowDownLeft : (isTransfer ? ArrowRightLeft : ArrowUpRight);
                      const txColor = isIncome ? 'text-emerald-400' : (isTransfer ? 'text-indigo-400' : 'text-white');
                      const txTime = new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

                      return (
                        <div 
                          key={tx.id} 
                          onClick={() => setSelectedTx(tx)}
                          className={`flex items-center justify-between p-4 hover:bg-lumina-surface-light/50 transition-colors cursor-pointer group ${
                            idx !== group.transactions.length - 1 ? 'border-b border-lumina-border/60' : ''
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className="w-11 h-11 rounded-full bg-lumina-bg border border-lumina-border flex items-center justify-center shrink-0">
                                <Clock className={`w-4 h-4 ${txColor}`} />
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-lumina-surface border border-lumina-border flex items-center justify-center">
                                <TxIcon className={`w-3 h-3 ${txColor}`} strokeWidth={3} />
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-semibold text-white text-sm group-hover:text-lumina-accent transition-colors">{tx.destination || tx.type}</p>
                              <p className="text-xs text-lumina-text-secondary mt-0.5">{tx.status}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className={`font-semibold text-sm ${txColor}`}>
                              {isIncome ? '+' : '-'}{Math.abs(tx.amount).toLocaleString('en-US', { style: 'currency', currency: tx.currency || 'USD' })}
                            </p>
                            <p className="text-xs text-lumina-text-secondary mt-0.5">{txTime}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="py-24 text-center text-lumina-text-secondary flex flex-col items-center justify-center bg-lumina-surface border border-lumina-border rounded-2xl mt-2">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
            <Tv className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Insights Coming Soon</h2>
          <p className="max-w-xs text-sm text-lumina-text-secondary">We're building beautiful charts to help you analyze your spending patterns.</p>
        </div>
      )}

    </div>

      {/* Transaction Receipt Modal */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="sm:max-w-md bg-lumina-surface border-lumina-border overflow-hidden p-0">
          {selectedTx && (
            <div className="flex flex-col relative">
              {/* Receipt Top Pattern */}
              <div className="h-4 w-full bg-[radial-gradient(circle_at_50%_0,transparent_2px,#1c1e26_3px)] bg-[length:12px_12px] bg-repeat-x rotate-180 absolute top-0"></div>
              
              <div className="px-6 py-8 flex flex-col items-center mt-2">
                <div className="w-14 h-14 rounded-full bg-lumina-bg border border-lumina-border flex items-center justify-center mb-4">
                  {selectedTx.type === 'DEPOSIT' || selectedTx.type === 'TRANSFER_IN' ? (
                    <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
                  ) : selectedTx.type === 'TRANSFER' || selectedTx.type === 'TRANSFER_OUT' ? (
                    <ArrowRightLeft className="w-6 h-6 text-indigo-400" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-white" />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold tracking-tight text-white mb-1">
                  {Math.abs(selectedTx.amount).toLocaleString('en-US', { style: 'currency', currency: selectedTx.currency || 'USD' })}
                </h2>
                
                <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6 ${
                  selectedTx.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                  selectedTx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {selectedTx.status}
                </div>

                <div className="w-full border-t border-dashed border-lumina-border my-2"></div>

                <div className="w-full space-y-4 my-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-lumina-text-secondary">Date & Time</span>
                    <span className="text-sm font-medium text-white">{new Date(selectedTx.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-lumina-text-secondary">Type</span>
                    <span className="text-sm font-medium text-white">{selectedTx.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-lumina-text-secondary">Destination/Source</span>
                    <span className="text-sm font-medium text-white">{selectedTx.destination || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-lumina-text-secondary">Transaction ID</span>
                    <span className="text-xs font-mono text-lumina-text-tertiary">{selectedTx.id}</span>
                  </div>
                  {selectedTx.adminReason && (
                    <div className="flex justify-between items-start mt-2 pt-4 border-t border-lumina-border/50">
                      <span className="text-sm text-lumina-text-secondary">Note</span>
                      <span className="text-sm font-medium text-red-400 text-right max-w-[200px]">{selectedTx.adminReason}</span>
                    </div>
                  )}
                </div>

                <div className="w-full border-t border-dashed border-lumina-border mt-2 mb-6"></div>
                
                <div className="flex flex-col items-center gap-1">
                  <div className="h-10 w-full max-w-[200px] bg-lumina-text-secondary opacity-20 rounded-sm" style={{ backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 2px, white 2px, white 4px)', backgroundSize: '10px 100%' }}></div>
                  <span className="text-[10px] text-lumina-text-tertiary uppercase tracking-widest mt-1">LUMINA BANK INC</span>
                </div>
              </div>
              
              {/* Receipt Bottom Pattern */}
              <div className="h-4 w-full bg-[radial-gradient(circle_at_50%_0,transparent_2px,#1c1e26_3px)] bg-[length:12px_12px] bg-repeat-x absolute bottom-0"></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
