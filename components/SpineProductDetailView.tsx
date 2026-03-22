
import React from 'react';
import { Icon } from './Icon';
import { SpineProduct, ViewType } from '../types';

interface SpineProductDetailViewProps {
  product: SpineProduct;
  onBack: () => void;
  onNavigate: (view: ViewType, id?: string) => void;
}

export const SpineProductDetailView: React.FC<SpineProductDetailViewProps> = ({ product, onBack, onNavigate }) => {
  const profitPerPiece = product.sellingPricePerPiece - product.costPricePerPiece;
  const margin = Math.round((profitPerPiece / product.sellingPricePerPiece) * 100);

  const batches = product.batches || [];
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  return (
    <div className="fixed inset-0 z-[70] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1 truncate text-slate-800 dark:text-white">{product.name}</h1>
        <button 
          onClick={() => onNavigate(ViewType.SPINE_ADD_PRODUCT, product.id)}
          className="p-2 -mr-2 rounded-full text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Icon name="edit" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Large Stock Display */}
        <div className="p-8 bg-slate-900 text-white text-center relative overflow-hidden mb-6">
          <div className="absolute top-0 left-0 p-4 opacity-5">
             <Icon name="inventory" className="text-[120px]" />
          </div>
          <div className="relative z-10">
             <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Available Stock</p>
             <div className="flex items-center justify-center gap-6">
                <div>
                   <h2 className="text-5xl font-black">{product.bulkQuantity}</h2>
                   <p className="text-[10px] text-slate-500 uppercase font-bold">{product.bulkUnitName}{product.bulkQuantity !== 1 ? 's' : ''}</p>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div>
                   <h2 className="text-5xl font-black text-emerald-400">{product.pieceQuantity}</h2>
                   <p className="text-[10px] text-slate-500 uppercase font-bold">{product.pieceUnitName}{product.pieceQuantity !== 1 ? 's' : ''}</p>
                </div>
             </div>
             <p className="mt-6 text-xs text-slate-500">1 {product.bulkUnitName} = {product.unitsPerBulk} {product.pieceUnitName}s</p>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Price Metrics */}
          <section className="grid grid-cols-2 gap-4">
             <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Cost Price</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">₦{product.costPricePerPiece.toLocaleString()}</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Selling Price</p>
                <p className="text-xl font-bold text-primary">₦{product.sellingPricePerPiece.toLocaleString()}</p>
             </div>
          </section>

          {/* Profit Analysis */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-between">
             <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-1">Profit per {product.pieceUnitName}</p>
                <h3 className="text-3xl font-black text-emerald-700 dark:text-emerald-300">₦{profitPerPiece.toLocaleString()}</h3>
             </div>
             <div className="text-right">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black mb-1">+{margin}%</div>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">Margin</p>
             </div>
          </div>

          {/* Batches & Expiration Section */}
          <section className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Batches & Expiration</h3>
                <span className="text-[10px] font-bold text-slate-400">{batches.length} active batches</span>
             </div>
             <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm divide-y divide-slate-50 dark:divide-slate-700">
                {batches.length > 0 ? batches.map((batch, idx) => {
                    const exp = batch.expiryDate ? new Date(batch.expiryDate) : null;
                    const isExpiring = exp && exp > now && exp <= thirtyDaysFromNow;
                    const isExpired = exp && exp <= now;
                    
                    return (
                        <button 
                            key={batch.id} 
                            onClick={() => onNavigate(ViewType.SPINE_ADJUST_STOCK, product.id)}
                            className="w-full p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`size-10 rounded-xl flex items-center justify-center transition-all ${isExpired ? 'bg-rose-100 text-rose-600' : isExpiring ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                                    <Icon name={isExpired || isExpiring ? "event_busy" : "inventory_2"} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">Batch {idx + 1}</p>
                                        {(isExpired || isExpiring) && (
                                            <span className="text-[8px] font-black uppercase bg-slate-900 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                                                <Icon name="bolt" className="text-[8px]" /> Resolve
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        {batch.bulkQuantity} bulk, {batch.pieceQuantity} pieces
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className={`text-xs font-black ${isExpired ? 'text-rose-500' : isExpiring ? 'text-orange-500' : 'text-slate-500'}`}>
                                        {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'No Expiry'}
                                    </p>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Expiry Date</p>
                                </div>
                                <Icon name="chevron_right" className="text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                        </button>
                    );
                }) : (
                    <div className="p-10 text-center text-slate-400">
                        <Icon name="history" className="text-4xl opacity-20 mb-2" />
                        <p className="text-xs font-bold">No batch records found</p>
                    </div>
                )}
             </div>
          </section>

          {/* Details */}
          <section className="space-y-4">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Details</h3>
             <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
                   <span className="text-sm text-slate-500">Category</span>
                   <span className="text-sm font-bold text-slate-800 dark:text-white">{product.category || 'Uncategorized'}</span>
                </div>
                <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
                   <span className="text-sm text-slate-500">Stock Code</span>
                   <span className="text-sm font-mono font-bold text-slate-800 dark:text-white uppercase">{product.serialNumber || 'N/A'}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                   <span className="text-sm text-slate-500">Total Stock Value</span>
                   <span className="text-sm font-bold text-slate-800 dark:text-white">₦{((product.bulkQuantity * product.unitsPerBulk + product.pieceQuantity) * product.costPricePerPiece).toLocaleString()}</span>
                </div>
             </div>
          </section>

          {/* Quick Actions Footer */}
          <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate(ViewType.SPINE_STOCK_TRANSFER, product.id)}
                className="py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs font-black uppercase tracking-wider shadow-sm"
              >
                 <Icon name="move_up" className="text-primary" />
                 <span>Transfer</span>
              </button>
              <button 
                onClick={() => onNavigate(ViewType.SPINE_ADJUST_STOCK, product.id)}
                className="py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all text-xs font-black uppercase tracking-wider shadow-sm"
              >
                 <Icon name="history_edu" className="text-rose-500" />
                 <span>Adjust</span>
              </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={() => onNavigate(ViewType.SPINE_ADD_STOCK, product.id)}
          className="w-full py-4 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Icon name="add_shopping_cart" />
          <span>Restock Item</span>
        </button>
      </div>
    </div>
  );
};
