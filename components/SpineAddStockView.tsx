
import React, { useState } from 'react';
import { Icon } from './Icon';
import { SpineProduct, SpineOutlet, SpineBatch } from '../types';

interface SpineAddStockViewProps {
  products: SpineProduct[];
  outlets: SpineOutlet[];
  onBack: () => void;
  onAddStock: (productId: string, outletId: string, bulkQty: number, pieceQty: number, costPrice: number, expiryDate: string) => void;
  initialProductId?: string | null;
}

export const SpineAddStockView: React.FC<SpineAddStockViewProps> = ({ products, outlets, onBack, onAddStock, initialProductId }) => {
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || (products[0]?.id || ''));
  const [outletId, setOutletId] = useState(outlets[0]?.id || '');
  const [bulkQty, setBulkQty] = useState('');
  const [pieceQty, setPieceQty] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = products.find(p => p.id === selectedProductId);

  const handleSubmit = () => {
      const b = Number(bulkQty) || 0;
      const p = Number(pieceQty) || 0;
      const c = Number(costPrice) || 0;

      if (!selectedProductId) {
          setError("Please select a product.");
          return;
      }

      if (b === 0 && p === 0) {
          setError("Please enter quantity to add.");
          return;
      }

      onAddStock(selectedProductId, outletId, b, p, c, expiryDate);
  };

  const unitCost = selectedProduct ? (Number(costPrice) || 0) / (selectedProduct.unitsPerBulk || 1) : 0;

  return (
    <div className="fixed inset-0 z-[80] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">Add New Stock</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-28">
          <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
              <Icon name="add_shopping_cart" className="absolute -right-4 -bottom-4 text-9xl opacity-10" />
              <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Restocking Operation</p>
              <h2 className="text-2xl font-black">Record Purchase</h2>
          </div>

          <section className="space-y-6">
              <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Select Product</label>
                  <div className="relative">
                    <Icon name="inventory_2" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                        value={selectedProductId}
                        onChange={(e) => setSelectedProductId(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary appearance-none shadow-sm"
                    >
                        <option value="" disabled>Choose a product...</option>
                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Receiving Branch</label>
                  <div className="relative">
                    <Icon name="store" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                        value={outletId}
                        onChange={(e) => setOutletId(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary appearance-none shadow-sm"
                    >
                        {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <Icon name="expand_more" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Quantity Received</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">{selectedProduct?.bulkUnitName || 'Bulk'}s</label>
                        <input 
                            type="number"
                            value={bulkQty}
                            onChange={(e) => setBulkQty(e.target.value)}
                            placeholder="0"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">{selectedProduct?.pieceUnitName || 'Piece'}s</label>
                        <input 
                            type="number"
                            value={pieceQty}
                            onChange={(e) => setPieceQty(e.target.value)}
                            placeholder="0"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        />
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Batch Cost Price (Total)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                        <input 
                            type="number"
                            value={costPrice}
                            onChange={(e) => setCostPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                    </div>
                    {selectedProduct && (
                        <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-tight">
                            Est. Cost per {selectedProduct.pieceUnitName}: <span className="text-slate-600 dark:text-slate-300">₦{unitCost.toFixed(2)}</span>
                        </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Batch Expiry Date</label>
                    <div className="relative">
                        <Icon name="event" className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400" />
                        <input 
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-sm"
                        />
                    </div>
                    <p className="text-[9px] text-slate-500 italic ml-1">Leave empty if item does not expire.</p>
                  </div>
              </div>

              {error && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold animate-in shake duration-300">
                      <Icon name="error" className="text-sm" />
                      {error}
                  </div>
              )}
          </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Icon name="add_task" />
          <span>Confirm Restock</span>
        </button>
      </div>
    </div>
  );
};
