
import React from 'react';
import { Icon } from './Icon';
// Updated to use SpineProduct as KokoroProduct alias
import { SpineProduct as KokoroProduct } from '../types';

interface KokoroProductDetailViewProps {
  product: KokoroProduct;
  onBack: () => void;
}

export const KokoroProductDetailView: React.FC<KokoroProductDetailViewProps> = ({ product, onBack }) => {
  const profitPerPiece = product.sellingPricePerPiece - product.costPricePerPiece;
  const margin = Math.round((profitPerPiece / product.sellingPricePerPiece) * 100);

  return (
    <div className="fixed inset-0 z-[70] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1 truncate">{product.name}</h1>
        <button className="p-2 -mr-2 rounded-full text-slate-600">
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
                   <p className="text-[10px] text-slate-500 uppercase font-bold">Bulk Units</p>
                </div>
                <div className="h-10 w-px bg-white/20" />
                <div>
                   <h2 className="text-5xl font-black text-emerald-400">{product.pieceQuantity}</h2>
                   <p className="text-[10px] text-slate-500 uppercase font-bold">Pieces</p>
                </div>
             </div>
             <p className="mt-6 text-xs text-slate-500">1 Bulk = {product.unitsPerBulk} Pieces</p>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Price Metrics */}
          <section className="grid grid-cols-2 gap-4">
             <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Cost Price</p>
                <p className="text-xl font-bold text-slate-800 dark:text-white">₦{product.costPricePerPiece}</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Selling Price</p>
                <p className="text-xl font-bold text-primary">₦{product.sellingPricePerPiece}</p>
             </div>
          </section>

          {/* Profit Analysis */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-between">
             <div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-1">Profit per Unit</p>
                <h3 className="text-3xl font-black text-emerald-700 dark:text-emerald-300">₦{profitPerPiece}</h3>
             </div>
             <div className="text-right">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold mb-1">+{margin}%</div>
                <p className="text-[10px] text-emerald-600 font-medium">Margin</p>
             </div>
          </div>

          {/* Details */}
          <section className="space-y-4">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Product Details</h3>
             <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between">
                   <span className="text-sm text-slate-500">Category</span>
                   <span className="text-sm font-bold text-slate-800 dark:text-white">{product.category || 'Uncategorized'}</span>
                </div>
                <div className="p-4 border-b border-slate-50 dark:border-slate-700 flex justify-between">
                   <span className="text-sm text-slate-500">Supplier</span>
                   {/* Fix: cast product to any to access potentially dynamic properties not in interface */}
                   <span className="text-sm font-bold text-slate-800 dark:text-white">{(product as any).supplier || 'N/A'}</span>
                </div>
                <div className="p-4 flex justify-between">
                   <span className="text-sm text-slate-500">Stock Worth</span>
                   <span className="text-sm font-bold text-slate-800 dark:text-white">₦{(product.pieceQuantity * product.costPricePerPiece).toLocaleString()}</span>
                </div>
             </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50">
        <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
          <Icon name="add_shopping_cart" />
          <span>Restock Item</span>
        </button>
      </div>
    </div>
  );
};
