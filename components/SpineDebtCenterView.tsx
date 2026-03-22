
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { SpineShop, SpineSale } from '../types';

interface SpineDebtCenterViewProps {
  shop: SpineShop;
  sales: SpineSale[];
  onBack: () => void;
  onRepayment: (customerId: string, amount: number, method: string) => void;
  onAddCustomer: (name: string, phone: string) => string;
}

export const SpineDebtCenterView: React.FC<SpineDebtCenterViewProps> = ({ shop, sales, onBack, onRepayment, onAddCustomer }) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'debtors'>('debtors');
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(null);
  const [expandedSaleId, setExpandedSaleId] = useState<string | null>(null);
  
  // Repayment Flow State
  const [repaymentTarget, setRepaymentTarget] = useState<{customerId: string, saleId?: string, amount: number} | null>(null);
  const [repaymentAmount, setRepaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'wallet'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // New Registration State
  const [isRegistering, setIsRegistering] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [isRegisteringInProgress, setIsRegisteringInProgress] = useState(false);

  const totalOwedAmount = shop.customers.reduce((sum, d) => sum + d.totalOwed, 0);
  const debtorsCount = shop.customers.filter(c => c.totalOwed > 0).length;
  const isCleared = totalOwedAmount === 0;

  const displayCustomers = useMemo(() => {
      let base = activeTab === 'debtors' ? shop.customers.filter(c => c.totalOwed > 0) : shop.customers;
      return base.filter(d => 
        d.name.toLowerCase().includes(search.toLowerCase()) || 
        d.phone.includes(search)
      );
  }, [shop.customers, activeTab, search]);

  const getCustomerHistory = (customerId: string) => {
    return sales.filter(s => s.customerId === customerId);
  };

  const getCustomerStats = (customerId: string) => {
    const history = getCustomerHistory(customerId);
    const totalSpent = history.reduce((sum, s) => sum + (s.id.startsWith('REP-') ? 0 : s.totalAmount), 0);
    const totalPaid = history.reduce((sum, s) => sum + s.amountPaid, 0);
    return { totalSpent, totalPaid };
  };

  const getStaffName = (userId: string) => {
    return shop.users.find(u => u.id === userId)?.name || 'Unknown Staff';
  };

  const startRepayment = (customerId: string, amount: number, saleId?: string) => {
    setRepaymentTarget({ customerId, saleId, amount });
    setRepaymentAmount(amount.toString());
    setShowSuccess(false);
  };

  const confirmRepayment = () => {
    if (!repaymentTarget) return;
    const amount = Number(repaymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
        onRepayment(repaymentTarget.customerId, amount, paymentMethod);
        setIsProcessing(false);
        setShowSuccess(true);
        setTimeout(() => {
            setRepaymentTarget(null);
            setShowSuccess(false);
        }, 2000);
    }, 1500);
  };

  const handleRegisterCustomer = () => {
      if (!newName || !newPhone) return;
      setIsRegisteringInProgress(true);
      setTimeout(() => {
          onAddCustomer(newName, newPhone);
          setIsRegisteringInProgress(false);
          setIsRegistering(false);
          setNewName('');
          setNewPhone('');
      }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">Customer Base</h1>
        <button onClick={() => setIsRegistering(true)} className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center active:scale-90 transition-transform">
            <Icon name="person_add" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
        {/* Dynamic Summary Card - Red when Owed, Green when Cleared */}
        <div className={`rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden transition-colors duration-700 ${isCleared ? 'bg-emerald-500' : 'bg-rose-500'}`}>
             <Icon name={isCleared ? "verified_user" : "groups"} className="absolute -right-4 -bottom-4 text-[12rem] opacity-10" />
             <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-1 ${isCleared ? 'text-emerald-100' : 'text-rose-100'}`}>
                            {isCleared ? 'Balance Status' : 'Total Receivables'}
                        </p>
                        <h2 className="text-5xl font-black text-white leading-none tracking-tighter">
                            {isCleared ? 'CLEARED' : `₦${totalOwedAmount.toLocaleString()}`}
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className={`text-[10px] font-black uppercase tracking-[0.25em] mb-1 ${isCleared ? 'text-emerald-200' : 'text-rose-200'}`}>Total Base</p>
                        <h2 className="text-2xl font-black">{shop.customers.length}</h2>
                    </div>
                </div>
                
                <div className="flex p-1 bg-black/10 rounded-2xl border border-white/10 shadow-inner">
                    <button 
                        onClick={() => setActiveTab('debtors')}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'debtors' ? 'bg-white shadow-lg ' + (isCleared ? 'text-emerald-600' : 'text-rose-600') : (isCleared ? 'text-emerald-100' : 'text-rose-100')}`}
                    >
                        Active Debts ({debtorsCount})
                    </button>
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'all' ? 'bg-white shadow-lg ' + (isCleared ? 'text-emerald-600' : 'text-rose-600') : (isCleared ? 'text-emerald-100' : 'text-rose-100')}`}
                    >
                        All Customers
                    </button>
                </div>
             </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search name or phone..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary shadow-sm text-slate-800 dark:text-white placeholder-slate-400 font-bold"
            />
        </div>

        {/* Customers List */}
        <div className="space-y-4">
            {displayCustomers.length > 0 ? (
                displayCustomers.map(debtor => {
                    const isExpanded = expandedCustomerId === debtor.id;
                    const hasDebt = debtor.totalOwed > 0;
                    const history = getCustomerHistory(debtor.id);
                    const stats = getCustomerStats(debtor.id);
                    
                    return (
                        <div key={debtor.id} className="space-y-2 animate-in slide-in-from-bottom duration-400">
                            <div 
                                onClick={() => {
                                    setExpandedCustomerId(isExpanded ? null : debtor.id);
                                    if (isExpanded) setExpandedSaleId(null);
                                }}
                                className={`bg-white dark:bg-slate-800 p-5 rounded-[2rem] border transition-all ${isExpanded ? 'border-primary ring-1 ring-primary shadow-2xl' : 'border-slate-100 dark:border-slate-700 shadow-sm'} flex items-center justify-between group active:scale-[0.98] cursor-pointer`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-14 rounded-full flex items-center justify-center font-black text-xl shadow-inner ${isExpanded ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                                        {debtor.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-800 dark:text-white text-base leading-none mb-1.5">{debtor.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{debtor.phone}</p>
                                            {hasDebt && (
                                                <span className="size-1.5 rounded-full bg-rose-500 animate-pulse" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button 
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                            isExpanded 
                                            ? 'bg-primary text-white shadow-lg' 
                                            : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-100 dark:border-slate-600'
                                        }`}
                                    >
                                        {isExpanded ? 'Hide Records' : 'View Records'}
                                    </button>
                                    {hasDebt && !isExpanded && (
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">₦{debtor.totalOwed.toLocaleString()} Owed</p>
                                    )}
                                </div>
                            </div>

                            {/* Expanded Customer Area - Record Sheet */}
                            {isExpanded && (
                                <div className="mx-2 space-y-4 animate-in slide-in-from-top-4 duration-500">
                                    {/* Lifetime Stats */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-lg border border-white/5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Lifetime Value</p>
                                            <p className="text-xl font-black">₦{stats.totalSpent.toLocaleString()}</p>
                                            <p className="text-[8px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Total purchases</p>
                                        </div>
                                        <div className={`rounded-3xl p-5 shadow-lg border ${hasDebt ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-900/30' : 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-900/30'}`}>
                                            <p className={`text-[9px] font-black uppercase tracking-[0.2em] mb-1 ${hasDebt ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>Current Balance</p>
                                            <p className={`text-xl font-black ${hasDebt ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                {hasDebt ? `₦${debtor.totalOwed.toLocaleString()}` : 'CLEARED'}
                                            </p>
                                            <p className={`text-[8px] mt-1 uppercase font-bold tracking-widest ${hasDebt ? 'text-rose-400/60' : 'text-emerald-400/60'}`}>{hasDebt ? 'Owed to shop' : 'No pending debt'}</p>
                                        </div>
                                    </div>

                                    {/* Interaction Feed */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between px-2">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Interaction History</h4>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">{history.length} Record{history.length !== 1 ? 's' : ''}</span>
                                        </div>
                                        
                                        {history.length > 0 ? (
                                            history.map(sale => {
                                                const isSaleExpanded = expandedSaleId === sale.id;
                                                const isRepayment = sale.id.startsWith('REP-');
                                                const isDebt = sale.paymentMethod === 'debt';
                                                const isPaid = isDebt && sale.balanceDue === 0;
                                                
                                                return (
                                                    <div key={sale.id} className="space-y-1">
                                                        <div 
                                                            onClick={() => setExpandedSaleId(isSaleExpanded ? null : sale.id)}
                                                            className={`bg-white dark:bg-slate-800/80 p-4 rounded-2xl border transition-all cursor-pointer ${isSaleExpanded ? 'border-primary ring-1 ring-primary shadow-lg' : 'border-slate-100 dark:border-slate-800 shadow-sm'} flex items-center justify-between group`}
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${isRepayment ? 'bg-emerald-500 text-white' : isDebt ? (isPaid ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-500') : 'bg-slate-50 dark:bg-slate-900 text-slate-400'}`}>
                                                                    <Icon name={isRepayment ? 'verified' : isDebt ? (isPaid ? 'task_alt' : 'person_search') : 'payments'} className="text-base" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-black text-slate-800 dark:text-white leading-none mb-1">
                                                                        {isRepayment ? 'Debt Repayment' : isDebt ? (isPaid ? 'Credit Purchase (Paid)' : 'Credit Purchase') : 'Cash Purchase'}
                                                                    </p>
                                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sale.timestamp}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-base font-black text-slate-800 dark:text-white">₦{sale.totalAmount.toLocaleString()}</p>
                                                                <div className="flex items-center justify-end gap-1.5 mt-0.5">
                                                                    <span className="text-[8px] font-black text-primary uppercase tracking-widest">
                                                                        {isSaleExpanded ? 'Hide' : 'Details'}
                                                                    </span>
                                                                    <Icon name={isSaleExpanded ? "expand_less" : "expand_more"} className="text-primary text-xs" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {isSaleExpanded && (
                                                            <div className="mx-2 p-4 bg-slate-50 dark:bg-slate-900 border-x border-b border-primary/20 rounded-b-2xl animate-in slide-in-from-top-2 duration-200 shadow-inner">
                                                                <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <Icon name="person" className="text-slate-400 text-xs" />
                                                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Recorded by: <span className="text-slate-800 dark:text-slate-200">{getStaffName(sale.recordedByUserId)}</span></p>
                                                                    </div>
                                                                    <span className="text-[9px] font-mono text-slate-400 uppercase">{sale.id}</span>
                                                                </div>
                                                                
                                                                <div className="space-y-3">
                                                                    {sale.items.map((item, idx) => (
                                                                        <div key={idx} className="flex justify-between items-center text-xs">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="size-6 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700">
                                                                                    <span className="text-[10px] font-black text-slate-400">{idx + 1}</span>
                                                                                </div>
                                                                                <div>
                                                                                    <p className="font-bold text-slate-800 dark:text-white leading-tight">{item.productName}</p>
                                                                                    <div className="flex items-center gap-1.5">
                                                                                        <span className="text-[10px] font-black text-primary">{item.quantity}×</span>
                                                                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{item.unitType}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <span className="font-black text-slate-800 dark:text-white">₦{(item.priceAtSale * item.quantity).toLocaleString()}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700">
                                                                    <div className="flex justify-between items-center mb-1">
                                                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Amount Paid</span>
                                                                        <span className="text-sm font-black text-emerald-500">₦{sale.amountPaid.toLocaleString()}</span>
                                                                    </div>
                                                                    {sale.balanceDue > 0 && (
                                                                        <div className="flex justify-between items-center mb-4">
                                                                            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tighter">Balance Due</span>
                                                                            <span className="text-sm font-black text-rose-500">₦{sale.balanceDue.toLocaleString()}</span>
                                                                        </div>
                                                                    )}
                                                                    
                                                                    {sale.balanceDue > 0 && (
                                                                        <button 
                                                                            onClick={(e) => { e.stopPropagation(); startRepayment(debtor.id, sale.balanceDue, sale.id); }}
                                                                            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                                                                        >
                                                                            <Icon name="payments" className="text-sm" />
                                                                            Settle Part
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700 shadow-inner">
                                                <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                    <Icon name="history" className="text-3xl" />
                                                </div>
                                                <p className="text-xs text-slate-400 font-black uppercase tracking-widest">No lifetime history recorded</p>
                                            </div>
                                        )}
                                        
                                        {hasDebt && (
                                            <button 
                                                onClick={() => startRepayment(debtor.id, debtor.totalOwed)}
                                                className="w-full mt-4 py-4 bg-rose-500 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-[1.5rem] shadow-xl shadow-rose-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                                            >
                                                <Icon name="payments" className="text-base" />
                                                Clear Full Debt (₦{debtor.totalOwed.toLocaleString()})
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <div className="py-20 text-center animate-in fade-in">
                    <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Icon name="search_off" className="text-4xl" />
                    </div>
                    <p className="text-slate-500 font-bold">No {activeTab === 'debtors' ? 'active debts' : 'customers'} found matching "{search}"</p>
                </div>
            )}
        </div>
      </div>
      
      {/* Repayment Modal */}
      {repaymentTarget && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => !isProcessing && setRepaymentTarget(null)} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-400 border-t border-white/10 flex flex-col">
                {showSuccess ? (
                    <div className="py-10 text-center animate-in zoom-in duration-300">
                        <div className="size-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
                            <Icon name="check_circle" className="text-5xl" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Payment Received!</h2>
                        <p className="text-slate-500 dark:text-slate-400">Customer balance updated successfully.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <Icon name="payments" className="text-emerald-500" />
                                Settlement
                            </h2>
                            <button onClick={() => setRepaymentTarget(null)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                                <Icon name="close" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2 text-center">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Amount to Settle</p>
                                <div className="relative inline-block w-full">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-400">₦</span>
                                    <input 
                                        type="number" 
                                        value={repaymentAmount}
                                        onChange={(e) => setRepaymentAmount(e.target.value)}
                                        className="w-full text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-4xl font-black text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-emerald-500 outline-none"
                                        placeholder="0.00"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-2 justify-center mt-3">
                                    <button onClick={() => setRepaymentAmount((repaymentTarget.amount / 2).toString())} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:bg-slate-200 transition-colors">
                                        Half (₦{(repaymentTarget.amount / 2).toLocaleString()})
                                    </button>
                                    <button onClick={() => setRepaymentAmount(repaymentTarget.amount.toString())} className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:bg-slate-200 transition-colors">
                                        Full (₦{repaymentTarget.amount.toLocaleString()})
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Payment Channel</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'cash', icon: 'payments', label: 'Cash' },
                                        { id: 'transfer', icon: 'account_balance', label: 'Transfer' },
                                        { id: 'wallet', icon: 'account_balance_wallet', label: 'Wallet' },
                                    ].map(m => (
                                        <button 
                                            key={m.id}
                                            onClick={() => setPaymentMethod(m.id as any)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                                                paymentMethod === m.id 
                                                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md scale-105' 
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                                            }`}
                                        >
                                            <Icon name={m.icon} className="mb-1" />
                                            <span className="text-[9px] font-black uppercase">{m.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={confirmRepayment}
                                disabled={isProcessing || !repaymentAmount}
                                className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isProcessing ? (
                                    <>
                                        <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Confirming...</span>
                                    </>
                                ) : (
                                    <>
                                        <Icon name="done_all" />
                                        <span>Confirm Payment</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
                <div className="h-8" />
            </div>
        </div>
      )}

      {/* New Customer Registration Modal */}
      {isRegistering && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => !isRegisteringInProgress && setIsRegistering(false)} />
              <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-300 border-t border-white/10 flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                          <Icon name="person_add" className="text-primary" />
                          New Customer
                      </h2>
                      <button onClick={() => setIsRegistering(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                          <Icon name="close" />
                      </button>
                  </div>

                  <div className="space-y-6">
                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                            type="text" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter Name"
                            className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-lg font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-primary outline-none"
                            autoFocus
                          />
                      </div>

                      <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <input 
                            type="tel" 
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            placeholder="+234..."
                            className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-lg font-bold text-slate-800 dark:text-white border-none focus:ring-2 focus:ring-primary outline-none"
                          />
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 flex gap-4">
                        <Icon name="info" className="text-blue-500" />
                        <p className="text-[10px] text-slate-500 leading-relaxed italic">
                            Registering a customer allows you to build a business history for better credit terms. You can record sales for them at checkout.
                        </p>
                      </div>

                      <button 
                        onClick={handleRegisterCustomer}
                        disabled={isRegisteringInProgress || !newName || !newPhone}
                        className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                          {isRegisteringInProgress ? (
                              <span className="size-5 border-2 border-slate-400 border-t-slate-100 rounded-full animate-spin" />
                          ) : (
                              <>
                                <Icon name="how_to_reg" />
                                <span>Register Customer</span>
                              </>
                          )}
                      </button>
                  </div>
                  <div className="h-8" />
              </div>
          </div>
      )}

      {/* Global Action Footer */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 fixed bottom-0 left-0 right-0 max-w-md mx-auto z-20">
          <p className="text-center text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-4 font-bold">Business Registry</p>
          <button 
            onClick={() => setIsRegistering(true)}
            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest rounded-[1.5rem] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-2xl"
          >
              <Icon name="person_add" />
              <span>Add New Customer</span>
          </button>
      </div>
    </div>
  );
};
