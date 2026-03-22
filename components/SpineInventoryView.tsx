
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { SpineProduct, ViewType } from '../types';

interface SpineInventoryViewProps {
  products: SpineProduct[];
  onNavigate: (view: ViewType, id?: string) => void;
  onBack: () => void;
}

type FilterType = 'All' | 'Low Stock' | 'Expiring' | 'Categories';

export const SpineInventoryView: React.FC<SpineInventoryViewProps> = ({ products, onNavigate, onBack }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  
  const now = useMemo(() => new Date(), []);
  const thirtyDaysFromNow = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d;
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                         (p.category && p.category.toLowerCase().includes(search.toLowerCase()));
    
    if (!matchesSearch) return false;

    if (activeFilter === 'Low Stock') {
        const total = (p.bulkQuantity * p.unitsPerBulk + p.pieceQuantity);
        return total < 15;
    }

    if (activeFilter === 'Expiring') {
        return p.batches?.some(b => {
            if (!b.expiryDate) return false;
            const exp = new Date(b.expiryDate);
            return exp > now && exp <= thirtyDaysFromNow && (b.bulkQuantity > 0 || b.pieceQuantity > 0);
        });
    }

    return true;
  });

  // Calculate stock overview metrics
  const stats = useMemo(() => {
    const worth = products.reduce((sum, p) => sum + ((p.bulkQuantity * p.unitsPerBulk + p.pieceQuantity) * p.costPricePerPiece), 0);
    const revenue = products.reduce((sum, p) => sum + ((p.bulkQuantity * p.unitsPerBulk + p.pieceQuantity) * p.sellingPricePerPiece), 0);
    
    const outOfStock = products.filter(p => (p.bulkQuantity * p.unitsPerBulk + p.pieceQuantity) === 0);
    const lowStock = products.filter(p => {
        const total = (p.bulkQuantity * p.unitsPerBulk + p.pieceQuantity);
        return total > 0 && total < 15;
    });

    const expiringSoon = products.filter(p => {
        return p.batches?.some(b => {
            if (!b.expiryDate) return false;
            const exp = new Date(b.expiryDate);
            return exp > now && exp <= thirtyDaysFromNow && (b.bulkQuantity > 0 || b.pieceQuantity > 0);
        });
    });
    
    return {
      totalItems: products.length,
      stockWorth: worth,
      expectedRevenue: revenue,
      potentialProfit: revenue - worth,
      outOfStock,
      lowStock,
      expiringSoonCount: expiringSoon.length,
      lowStockCount: outOfStock.length + lowStock.length
    };
  }, [products, now, thirtyDaysFromNow]);

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">My Stock</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onNavigate(ViewType.SPINE_ADD_STOCK)} 
            className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Icon name="add_shopping_cart" className="text-sm" />
            <span>Restock</span>
          </button>
          <button onClick={() => onNavigate(ViewType.SPINE_ADD_PRODUCT)} className="size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform">
            <Icon name="add" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-10">
        {products.length > 0 ? (
          <>
            {/* Stock Overview Section */}
            <section className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-md border border-white/5 relative overflow-hidden">
                   <Icon name="inventory_2" className="absolute -right-2 -bottom-2 text-5xl opacity-10" />
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Stock Worth</p>
                   <p className="text-xl font-black">₦{stats.stockWorth.toLocaleString()}</p>
                   <p className="text-[9px] text-slate-500 mt-1">Cost value of inventory</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                   <Icon name="trending_up" className="absolute -right-2 -bottom-2 text-5xl opacity-5 text-emerald-500" />
                   <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Est. Profit</p>
                   <p className="text-xl font-black text-emerald-500">₦{stats.potentialProfit.toLocaleString()}</p>
                   <p className="text-[9px] text-slate-400 mt-1">Potential earnings</p>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                 <button 
                    onClick={() => setActiveFilter('All')}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl border flex items-center gap-3 transition-all ${activeFilter === 'All' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm'}`}
                 >
                    <div className={`size-8 rounded-lg flex items-center justify-center ${activeFilter === 'All' ? 'bg-white/20' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600'}`}>
                       <Icon name="category" className="text-sm" />
                    </div>
                    <div className="text-left">
                       <p className="text-xs font-bold">{stats.totalItems}</p>
                       <p className="text-[9px] uppercase font-bold tracking-tighter opacity-70">All Products</p>
                    </div>
                 </button>

                 <button 
                    onClick={() => setActiveFilter('Low Stock')}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl border flex items-center gap-3 transition-all ${activeFilter === 'Low Stock' ? 'bg-amber-500 text-white border-transparent shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 shadow-sm'}`}
                 >
                    <div className={`size-8 rounded-lg flex items-center justify-center ${activeFilter === 'Low Stock' ? 'bg-white/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600'}`}>
                       <Icon name="warning" className="text-sm" />
                    </div>
                    <div className="text-left">
                       <p className="text-xs font-bold">{stats.lowStockCount}</p>
                       <p className="text-[9px] uppercase font-bold tracking-tighter opacity-70">Low Stock</p>
                    </div>
                 </button>

                 <button 
                    onClick={() => setActiveFilter('Expiring')}
                    className={`flex-shrink-0 px-4 py-3 rounded-xl border flex items-center gap-3 transition-all ${activeFilter === 'Expiring' ? 'bg-orange-500 text-white border-transparent shadow-lg' : 'bg-white dark:bg-slate-800 border-orange-200 dark:border-orange-500/30 shadow-sm'}`}
                 >
                    <div className={`size-8 rounded-lg flex items-center justify-center ${activeFilter === 'Expiring' ? 'bg-white/20 text-white' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600'}`}>
                       <Icon name="event_busy" className="text-sm" />
                    </div>
                    <div className="text-left">
                       <p className="text-xs font-bold">{stats.expiringSoonCount}</p>
                       <p className="text-[9px] uppercase font-bold tracking-tighter opacity-70">Expiring</p>
                    </div>
                 </button>
              </div>
            </section>

            {/* Search Bar */}
            <div className="px-4 mb-4">
              <div className="relative">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeFilter === 'All' ? 'items' : activeFilter.toLowerCase()}...`} 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary shadow-sm text-slate-800 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            {/* Product List */}
            <div className="px-4 space-y-3">
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Inventory List ({activeFilter})</h3>
                 <span className="text-[10px] font-bold text-slate-400">{filteredProducts.length} Results</span>
              </div>

              {filteredProducts.map(product => {
                const totalPieces = (product.bulkQuantity * product.unitsPerBulk + product.pieceQuantity);
                const isLow = totalPieces > 0 && totalPieces < 15;
                const isOut = totalPieces === 0;

                const isExpiring = product.batches?.some(b => {
                    if (!b.expiryDate) return false;
                    const exp = new Date(b.expiryDate);
                    return exp > now && exp <= thirtyDaysFromNow && (b.bulkQuantity > 0 || b.pieceQuantity > 0);
                });

                return (
                  <div 
                    key={product.id}
                    onClick={() => onNavigate(ViewType.SPINE_PRODUCT_DETAIL, product.id)}
                    className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4 active:bg-slate-50 dark:active:bg-slate-700/50 transition-all active:scale-[0.99] cursor-pointer group ${isOut ? 'opacity-70 grayscale' : ''}`}
                  >
                    <div className={`size-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${
                        isOut ? 'bg-rose-100 text-rose-600' :
                        isExpiring ? 'bg-orange-100 text-orange-600' :
                        isLow ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 
                        'bg-slate-50 dark:bg-slate-900 text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 group-hover:text-blue-500'
                    }`}>
                      <Icon name={isOut ? "block" : isExpiring ? "event_busy" : isLow ? "warning" : "inventory"} className="text-2xl" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 dark:text-white truncate pr-2">{product.name}</h3>
                        <span className="font-black text-primary whitespace-nowrap">₦{product.sellingPricePerPiece.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          {product.bulkQuantity} {product.bulkUnitName}{product.bulkQuantity !== 1 ? 's' : ''}
                        </div>
                        <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isOut ? 'bg-rose-100 text-rose-600' :
                            isLow ? 'bg-amber-100 text-amber-600' :
                            'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                        }`}>
                            {product.pieceQuantity} {product.pieceUnitName}{product.pieceQuantity !== 1 ? 's' : ''}
                        </div>
                        {isExpiring && (
                            <div className="bg-orange-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm animate-pulse">Expiring</div>
                        )}
                      </div>
                    </div>
                    
                    <Icon name="chevron_right" className="text-slate-300 group-hover:text-primary transition-all shrink-0" />
                  </div>
                );
              })}

              {filteredProducts.length === 0 && (
                  <div className="py-20 text-center opacity-30 flex flex-col items-center">
                      <Icon name="inventory_2" className="text-6xl mb-4" />
                      <p className="font-black uppercase tracking-widest text-sm">No items found for this filter</p>
                  </div>
              )}
            </div>
          </>
        ) : (
          /* ZERO DATA STATE */
          <div className="flex flex-col items-center justify-center p-8 text-center min-h-[60vh] animate-in zoom-in-95 duration-500">
             <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6 shadow-inner border border-slate-200 dark:border-slate-800">
                <Icon name="inventory_2" className="text-5xl" />
             </div>
             <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">No Stock Recorded</h2>
             <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[240px] leading-relaxed mb-8 font-bold">
                Spine needs products in your vault before you can start recording sales.
             </p>
             <button 
                onClick={() => onNavigate(ViewType.SPINE_ADD_PRODUCT)}
                className="w-full max-w-xs py-4 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2"
             >
                <Icon name="add" />
                Add Your First Item
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
