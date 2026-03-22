import React from 'react';
import { Icon } from './Icon';
// Updated to use Spine types as aliases to satisfy missing Kokoro definitions
import { ViewType, SpineProduct as KokoroProduct, SpineSale as KokoroSale } from '../types';

interface KokoroDashboardViewProps {
  onNavigate: (view: ViewType, id?: string) => void;
  products: KokoroProduct[];
  sales: KokoroSale[];
}

export const KokoroDashboardView: React.FC<KokoroDashboardViewProps> = ({ onNavigate, products, sales }) => {
  const todaySalesCount = sales.length;
  const todayRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayProfit = sales.reduce((sum, s) => sum + s.totalProfit, 0);
  
  const lowStockItems = products.filter(p => p.pieceQuantity < 10 && p.bulkQuantity === 0);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      {/* Summary Header */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Icon name="monitoring" className="text-9xl" />
        </div>
        <div className="relative z-10">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Today's Sales</p>
          <h2 className="text-4xl font-extrabold mb-6">₦{todayRevenue.toLocaleString()}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/5">
              <p className="text-[10px] text-slate-300 uppercase font-bold mb-1">Items Sold</p>
              <p className="text-2xl font-bold">{todaySalesCount}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md border border-white/5">
              <p className="text-[10px] text-slate-300 uppercase font-bold mb-1">Net Profit</p>
              <p className="text-2xl font-bold text-emerald-400">₦{todayProfit.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          // Updated KOKORO_POS to SPINE_POS
          onClick={() => onNavigate(ViewType.SPINE_POS)}
          className="flex flex-col items-center justify-center p-6 bg-primary rounded-3xl text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform"
        >
          <div className="size-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <Icon name="shopping_basket" className="text-3xl" />
          </div>
          <span className="font-bold text-lg">Sell Item</span>
        </button>

        <button 
          // Updated KOKORO_ADD_PRODUCT to SPINE_ADD_PRODUCT
          onClick={() => onNavigate(ViewType.SPINE_ADD_PRODUCT)}
          className="flex flex-col items-center justify-center p-6 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform"
        >
          <div className="size-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
            <Icon name="add_shopping_cart" className="text-3xl" />
          </div>
          <span className="font-bold text-lg">Add Stock</span>
        </button>
      </div>

      {/* Secondary Actions Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          // Updated KOKORO_INVENTORY to SPINE_INVENTORY
          onClick={() => onNavigate(ViewType.SPINE_INVENTORY)}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:bg-slate-50 transition-colors"
        >
          <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Icon name="inventory_2" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">Inventory</span>
        </button>

        <button 
          // Updated KOKORO_SALES_HISTORY to SPINE_SALES_HISTORY
          onClick={() => onNavigate(ViewType.SPINE_SALES_HISTORY)}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:bg-slate-50 transition-colors"
        >
          <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300">
            <Icon name="receipt" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">Sales Log</span>
        </button>
      </div>

      {/* Calculator & Growth Row */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          // Updated KOKORO_CALCULATOR to SPINE_CALCULATOR
          onClick={() => onNavigate(ViewType.SPINE_CALCULATOR)}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:bg-slate-50 transition-colors"
        >
          <div className="size-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Icon name="calculate" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">Calculator</span>
        </button>

        <button 
          // Updated KOKORO_GROWTH to SPINE_GROWTH
          onClick={() => onNavigate(ViewType.SPINE_GROWTH)}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm active:bg-slate-50 transition-colors"
        >
          <div className="size-10 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Icon name="trending_up" />
          </div>
          <span className="font-bold text-slate-800 dark:text-white">Growth</span>
        </button>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Icon name="warning" className="text-amber-500" />
              Low Stock Alerts
            </h3>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full">{lowStockItems.length}</span>
          </div>

          <div className="flex flex-col gap-3">
            {lowStockItems.map(item => (
              <div key={item.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-l-amber-500 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.pieceQuantity} pieces remaining</p>
                </div>
                <button 
                  // Updated KOKORO_ADD_PRODUCT to SPINE_ADD_PRODUCT
                  onClick={() => onNavigate(ViewType.SPINE_ADD_PRODUCT, item.id)}
                  className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl shadow-sm active:scale-95"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Business Memory Tip */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <Icon name="psychology" className="absolute -right-4 -bottom-4 text-8xl opacity-10" />
        <h4 className="font-bold mb-1 flex items-center gap-2">
          <Icon name="auto_awesome" />
          Spine Tip
        </h4>
        <p className="text-xs text-white/80 leading-relaxed">
          You sell 40% more of "Classic Ankara" on weekends. Consider stocking up by Friday to maximize your profit.
        </p>
      </div>
    </div>
  );
};