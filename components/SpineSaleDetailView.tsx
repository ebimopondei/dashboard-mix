
import React from 'react';
import { Icon } from './Icon';
import { SpineSale, SpineShop } from '../types';

interface SpineSaleDetailViewProps {
  sale: SpineSale;
  shop?: SpineShop; // Passed from parent to find customer name
  onBack: () => void;
  onVoid: (id: string) => void;
}

export const SpineSaleDetailView: React.FC<SpineSaleDetailViewProps> = ({ sale, shop, onBack, onVoid }) => {
  const customer = shop?.customers.find(c => c.id === sale.customerId);
  const isDebt = sale.paymentMethod === 'debt';

  return (
    <div className="fixed inset-0 z-[70] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-slate-800 dark:text-white truncate">Sale Receipt</h1>
        <button className="p-2 -mr-2 rounded-full text-slate-600 dark:text-slate-300"><Icon name="print" /></button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 pb-24">
        {/* Receipt Header */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700 relative overflow-hidden text-center mb-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-background-light dark:bg-background-dark rounded-full shadow-inner"></div>
            
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{sale.timestamp}</p>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white mb-6">₦{sale.totalAmount.toLocaleString()}</h2>
            
            <div className="flex flex-wrap justify-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    isDebt ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20'
                }`}>
                    {isDebt ? 'Unpaid (Credit)' : `Paid via ${sale.paymentMethod}`}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 text-[9px] font-black uppercase tracking-widest">
                    Profit: ₦{sale.totalProfit.toLocaleString()}
                </span>
            </div>
        </div>

        {/* Customer Context (For Debt Sales) */}
        {isDebt && (
            <div className="bg-rose-50 dark:bg-rose-500/5 rounded-3xl p-5 border border-rose-100 dark:border-rose-500/10 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-rose-500/20">
                        {customer?.name[0] || 'C'}
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Owed By</p>
                        <p className="text-sm font-black text-slate-800 dark:text-white">{customer?.name || 'Walk-in Customer'}</p>
                        <p className="text-xs text-slate-500">{customer?.phone}</p>
                    </div>
                </div>
                <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm text-rose-500 active:scale-90 transition-transform">
                    <Icon name="call" />
                </button>
            </div>
        )}

        {/* Item List */}
        <div className="space-y-4 mb-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Inventory Items</h3>
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                {sale.items.map((item, idx) => (
                    <div key={idx} className="p-5 border-b border-slate-50 dark:border-slate-700 last:border-0 flex justify-between items-center group">
                        <div className="flex items-center gap-4">
                            <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                <Icon name="inventory_2" className="text-sm" />
                            </div>
                            <div>
                                <p className="font-black text-slate-800 dark:text-white text-sm">{item.productName}</p>
                                <p className="text-[10px] font-bold text-slate-400">{item.quantity} × {item.unitType} @ ₦{item.priceAtSale.toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="font-black text-slate-900 dark:text-white">₦{(item.priceAtSale * item.quantity).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-4">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Financial Log</h3>
             <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 space-y-4">
                 <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500 font-bold uppercase tracking-tighter">Accrued Revenue</span>
                     <span className="font-black text-slate-800 dark:text-white">₦{sale.totalAmount.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500 font-bold uppercase tracking-tighter">Realized Payment</span>
                     <span className="font-black text-emerald-500">₦{sale.amountPaid.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-500 font-bold uppercase tracking-tighter">Receivable Balance</span>
                     <span className={`font-black ${sale.balanceDue > 0 ? 'text-rose-500' : 'text-slate-400'}`}>₦{sale.balanceDue.toLocaleString()}</span>
                 </div>
                 <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{sale.id}</span>
                 </div>
             </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
            <button 
                onClick={() => onVoid(sale.id)}
                className="py-4 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-2xl active:scale-[0.95] transition-transform flex items-center justify-center gap-2 border border-rose-100 dark:border-rose-900/30"
            >
                <Icon name="cancel" className="text-sm" />
                <span>Void Receipt</span>
            </button>
            <button className="py-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.95] transition-transform flex items-center justify-center gap-2">
                <Icon name="share" className="text-sm" />
                <span>Share PDF</span>
            </button>
        </div>
      </div>
    </div>
  );
};
