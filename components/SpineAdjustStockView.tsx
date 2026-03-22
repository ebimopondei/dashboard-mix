
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { SpineProduct, SpineOutlet } from '../types';

interface SpineAdjustStockViewProps {
  product: SpineProduct;
  outlets: SpineOutlet[];
  onBack: () => void;
  onAdjust: (productId: string, outletId: string, type: 'damage' | 'loss' | 'return' | 'expired', bulkQty: number, pieceQty: number) => void;
}

export const SpineAdjustStockView: React.FC<SpineAdjustStockViewProps> = ({ product, outlets, onBack, onAdjust }) => {
  const [outletId, setOutletId] = useState(outlets[0]?.id || '');
  
  // Auto-detect if we should default to 'expired' based on product state
  const hasNearExpiry = useMemo(() => {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);
    return product.batches?.some(b => {
        if (!b.expiryDate) return false;
        const exp = new Date(b.expiryDate);
        return exp <= thirtyDaysFromNow && (b.bulkQuantity > 0 || b.pieceQuantity > 0);
    });
  }, [product.batches]);

  const [adjustType, setAdjustType] = useState<'damage' | 'loss' | 'return' | 'expired'>(hasNearExpiry ? 'expired' : 'damage');
  const [bulkQty, setBulkQty] = useState('');
  const [pieceQty, setPieceQty] = useState('');
  const [error, setError] = useState<string | null>(null);

  const activeBalance = product.stockBalances.find(b => b.outletId === outletId) || { bulkQuantity: 0, pieceQuantity: 0 };

  const handleSubmit = () => {
      const b = Number(bulkQty) || 0;
      const p = Number(pieceQty) || 0;

      if (b === 0 && p === 0) {
          setError("Please enter quantity to subtract.");
          return;
      }

      if (b > activeBalance.bulkQuantity || p > activeBalance.pieceQuantity) {
          setError("Cannot subtract more than current branch stock.");
          return;
      }

      onAdjust(product.id, outletId, adjustType, b, p);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">Stock Adjustment</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-28">
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
              <Icon name="inventory_2" className="absolute -right-4 -bottom-4 text-9xl opacity-10" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deducting from</p>
              <h2 className="text-2xl font-black">{product.name}</h2>
          </div>

          <section className="space-y-6">
              <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Branch Location</label>
                  <select 
                    value={outletId}
                    onChange={(e) => setOutletId(e.target.value)}
                    className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 appearance-none shadow-sm"
                  >
                      {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <p className="text-[10px] text-slate-400 font-bold ml-1 italic">Available: {activeBalance.bulkQuantity} bulk, {activeBalance.pieceQuantity} pieces</p>
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Reason for removal</label>
                  <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'damage', label: 'Damaged', icon: 'heart_broken' },
                        { id: 'loss', label: 'Missing', icon: 'search_off' },
                        { id: 'expired', label: 'Expired', icon: 'event_busy' },
                        { id: 'return', label: 'Return', icon: 'assignment_return' },
                      ].map(type => (
                          <button 
                            key={type.id}
                            onClick={() => setAdjustType(type.id as any)}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${adjustType === type.id ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-md ring-1 ring-rose-500' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-slate-300'}`}
                          >
                              <Icon name={type.icon} className="mb-1" />
                              <span className="text-[9px] font-black uppercase tracking-tighter">{type.label}</span>
                          </button>
                      ))}
                  </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Quantity Removed</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">{product.bulkUnitName}s</label>
                        <input 
                            type="number"
                            value={bulkQty}
                            onChange={(e) => setBulkQty(e.target.value)}
                            placeholder="0"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">{product.pieceUnitName}s</label>
                        <input 
                            type="number"
                            value={pieceQty}
                            onChange={(e) => setPieceQty(e.target.value)}
                            placeholder="0"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 shadow-inner"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold animate-in shake duration-300">
                        <Icon name="error" className="text-sm" />
                        {error}
                    </div>
                )}
            </div>
          </section>

          <div className="p-4 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-amber-100 dark:border-amber-500/10 flex gap-4 shadow-sm">
            <Icon name="warning" className="text-amber-500 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                Adjusting stock for <b>Expired</b> items will automatically deduct from your earliest expiring batches first to clear shop notifications.
            </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={handleSubmit}
          className="w-full py-4 bg-rose-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Icon name="remove_moderator" />
          <span>Record Adjustment</span>
        </button>
      </div>
    </div>
  );
};
