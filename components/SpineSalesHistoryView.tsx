
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { SpineSale, ViewType, SpineShop } from '../types';

interface SpineSalesHistoryViewProps {
  sales: SpineSale[];
  shop?: SpineShop; // Passed to resolve customer names
  onBack: () => void;
  onNavigate: (view: ViewType, id?: string) => void;
}

type PeriodType = 'daily' | 'weekly' | 'monthly';

export const SpineSalesHistoryView: React.FC<SpineSalesHistoryViewProps> = ({ sales, shop, onBack, onNavigate }) => {
  const [period, setPeriod] = useState<PeriodType>('daily');

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const ts = sale.timestamp.toLowerCase();
      if (period === 'daily') return ts.includes('today') || ts.includes('now');
      if (period === 'weekly') {
        return ts.includes('today') || ts.includes('now') || ts.includes('yesterday') || 
               ts.includes('2 days') || ts.includes('3 days') ||
               ts.includes('4 days') || ts.includes('5 days') ||
               ts.includes('6 days') || ts.includes('7 days') ||
               ts.includes('1 week');
      }
      // Monthly: Show everything in mock (all mock data fits within a month)
      return true;
    });
  }, [sales, period]);

  const metrics = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalProfit = filteredSales.reduce((sum, s) => sum + s.totalProfit, 0);
    
    // Cash Collected includes all money actually received (Cash sales + amountPaid for others)
    const cashCollected = filteredSales.reduce((sum, s) => sum + s.amountPaid, 0);
    const receivables = filteredSales.reduce((sum, s) => sum + s.balanceDue, 0);
    
    return {
      revenue: totalRevenue,
      cashCollected,
      receivables,
      profit: totalProfit,
      volume: filteredSales.length
    };
  }, [filteredSales]);

  const groupedSales = useMemo(() => {
    const groups: { [key: string]: SpineSale[] } = {};
    filteredSales.forEach(sale => {
      let dateKey = sale.timestamp.split(',')[0].trim();
      if (dateKey.toLowerCase().includes('now')) dateKey = 'Today';
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(sale);
    });
    return groups;
  }, [filteredSales]);

  const sortedDates = Object.keys(groupedSales).sort((a, b) => {
      const order = [
        'Today', 'Yesterday', '2 days ago', '3 days ago', '4 days ago', 
        '5 days ago', '6 days ago', '7 days ago', '1 week ago', 
        '10 days ago', '14 days ago', '20 days ago', '25 days ago', '30 days ago'
      ];
      const aIdx = order.indexOf(a);
      const bIdx = order.indexOf(b);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return b.localeCompare(a);
  });

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-20 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white flex-1">Sales Log</h1>
        <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Icon name="search" className="text-slate-400" /></button>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Statistics Banner */}
        <section className="p-4 space-y-4">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
             <div className="absolute top-0 right-0 p-8 opacity-10"><Icon name="account_balance" className="text-[12rem]" /></div>
             <div className="relative z-10">
                <div className="flex p-1 bg-white/5 rounded-xl mb-6 border border-white/5">
                    {(['daily', 'weekly', 'monthly'] as PeriodType[]).map((p) => (
                        <button key={p} onClick={() => setPeriod(p)} className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${period === p ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>
                            {p}
                        </button>
                    ))}
                </div>
                
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1">Period Inflow (Actual Cash)</p>
                <h2 className="text-5xl font-black mb-8 leading-tight tracking-tighter">₦{metrics.cashCollected.toLocaleString()}</h2>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                        <p className="text-[9px] font-black uppercase text-emerald-400 tracking-tighter mb-1">Total Sales</p>
                        <p className="text-xl font-black text-emerald-400 leading-none">₦{metrics.revenue.toLocaleString()}</p>
                    </div>
                    <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                        <p className="text-[9px] font-black uppercase text-rose-400 tracking-tighter mb-1">Owed to Shop</p>
                        <p className="text-xl font-black text-rose-400 leading-none">₦{metrics.receivables.toLocaleString()}</p>
                    </div>
                </div>
             </div>
          </div>
        </section>

        {/* Sales List */}
        <div className="px-4 space-y-10 mt-4">
          {sortedDates.length > 0 ? (
            sortedDates.map((date) => {
              const items = groupedSales[date];
              
              // Daily summary calculations
              const dailyTotal = items.reduce((sum, s) => sum + s.totalAmount, 0);
              const dailyCash = items.reduce((sum, s) => sum + s.amountPaid, 0);
              const dailyDebt = items.reduce((sum, s) => sum + s.balanceDue, 0);

              return (
                <div key={date} className="space-y-4">
                  <div className="space-y-3 px-1">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary" />
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">
                          {date}
                        </h3>
                    </div>
                    
                    {/* Daily Breakdown Strip - Only for Weekly/Monthly view to keep it clean */}
                    {(period === 'weekly' || period === 'monthly') && (
                        <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-900/50 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-inner">
                            <div className="text-center">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">Day Total</p>
                                <p className="text-xs font-black text-slate-700 dark:text-slate-300">₦{dailyTotal.toLocaleString()}</p>
                            </div>
                            <div className="text-center border-x border-slate-200 dark:border-slate-800">
                                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter mb-1">Cash In</p>
                                <p className="text-xs font-black text-emerald-500">₦{dailyCash.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] font-black text-rose-500 uppercase tracking-tighter mb-1">New Debt</p>
                                <p className="text-xs font-black text-rose-500">₦{dailyDebt.toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {items.map(sale => {
                      const isDebt = sale.paymentMethod === 'debt';
                      const isRepayment = sale.id.startsWith('REP-');
                      const isSettled = isDebt && sale.balanceDue === 0;
                      const customer = shop?.customers.find(c => c.id === sale.customerId);
                      
                      return (
                        <div 
                          key={sale.id}
                          onClick={() => onNavigate(ViewType.SPINE_SALE_DETAIL, sale.id)}
                          className={`bg-white dark:bg-slate-800 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group ${isRepayment ? 'bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/10' : ''}`}
                        >
                          <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                            isRepayment ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                            isSettled ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' :
                            isDebt ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 
                            'bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:text-primary transition-colors'
                          }`}>
                            <Icon name={isRepayment ? 'verified' : isDebt ? 'person_search' : 'receipt'} className="text-xl" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start mb-1">
                               <p className="font-black text-slate-800 dark:text-white text-lg leading-none">₦{sale.totalAmount.toLocaleString()}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                 {sale.timestamp.toLowerCase().includes('now') ? 'Just now' : sale.timestamp.split(',')[1]?.trim()}
                               </p>
                             </div>
                             
                             <div className="flex items-center gap-2 truncate">
                                {isRepayment ? (
                                    <span className="text-[9px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">Inflow</span>
                                ) : isSettled ? (
                                    <span className="text-[9px] font-black text-white bg-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">Settled</span>
                                ) : isDebt ? (
                                    <span className="text-[9px] font-black text-white bg-rose-500 px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">Credit</span>
                                ) : (
                                    <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-full">{sale.paymentMethod}</span>
                                )}
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                                    {isRepayment ? `Repayment: ${customer?.name || 'Walk-in'}` : 
                                     isDebt ? (customer?.name || 'Walk-in Credit') : 
                                     `${sale.items[0].productName}${sale.items.length > 1 ? ` +${sale.items.length - 1}` : ''}`}
                                </p>
                             </div>
                          </div>
                          <Icon name="chevron_right" className="text-slate-300 group-hover:text-primary transition-all shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center animate-in fade-in">
              <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Icon name="receipt_long" className="text-4xl opacity-50" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold">No records for this period</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
