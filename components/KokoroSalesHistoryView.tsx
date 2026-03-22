import React from 'react';
import { Icon } from './Icon';
// Updated to use SpineSale as KokoroSale alias and ViewType
import { SpineSale as KokoroSale, ViewType } from '../types';

interface KokoroSalesHistoryViewProps {
  sales: KokoroSale[];
  onBack: () => void;
  onNavigate: (view: ViewType, id?: string) => void;
}

export const KokoroSalesHistoryView: React.FC<KokoroSalesHistoryViewProps> = ({ sales, onBack, onNavigate }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1">Sales Log</h1>
        <button className="p-2 -mr-2 rounded-full text-slate-600">
          <Icon name="filter_list" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sales.map(sale => (
          <div 
            key={sale.id}
            // Updated KOKORO_SALE_DETAIL to SPINE_SALE_DETAIL
            onClick={() => onNavigate(ViewType.SPINE_SALE_DETAIL, sale.id)}
            className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 active:bg-slate-50 transition-colors"
          >
            <div className={`size-12 rounded-xl flex items-center justify-center ${
              sale.paymentMethod === 'cash' ? 'bg-emerald-100 text-emerald-600' :
              sale.paymentMethod === 'transfer' ? 'bg-blue-100 text-blue-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              <Icon name={sale.paymentMethod === 'cash' ? 'payments' : 'account_balance'} />
            </div>
            
            <div className="flex-1">
               <div className="flex justify-between items-start mb-1">
                 <h3 className="font-bold text-slate-800 dark:text-white">₦{sale.totalAmount.toLocaleString()}</h3>
                 <span className="text-[10px] text-slate-400 font-bold uppercase">{sale.timestamp}</span>
               </div>
               <p className="text-xs text-slate-500">
                 {sale.items.length} {sale.items.length === 1 ? 'item' : 'items'} • 
                 <span className="text-emerald-500 font-bold ml-1">₦{sale.totalProfit.toLocaleString()} profit</span>
               </p>
            </div>
            
            <Icon name="chevron_right" className="text-slate-300" />
          </div>
        ))}

        {sales.length === 0 && (
          <div className="py-20 text-center">
            <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Icon name="receipt" className="text-4xl" />
            </div>
            <p className="text-slate-500 font-bold">No sales recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};