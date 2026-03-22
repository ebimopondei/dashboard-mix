
import React, { useState } from 'react';
import { Icon } from './Icon';
import { SpineProduct, SpineOutlet } from '../types';

interface SpineStockTransferViewProps {
  product: SpineProduct;
  outlets: SpineOutlet[];
  onBack: () => void;
  onTransfer: (productId: string, fromId: string, toId: string, bulkQty: number, pieceQty: number) => void;
}

export const SpineStockTransferView: React.FC<SpineStockTransferViewProps> = ({ product, outlets, onBack, onTransfer }) => {
  const [fromOutletId, setFromOutletId] = useState(outlets[0]?.id || '');
  const [toOutletId, setToOutletId] = useState(outlets[1]?.id || '');
  const [bulkQty, setBulkQty] = useState('');
  const [pieceQty, setPieceQty] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const sourceBalance = product.stockBalances.find(b => b.outletId === fromOutletId) || { bulkQuantity: 0, pieceQuantity: 0 };
  
  const fromOutletName = outlets.find(o => o.id === fromOutletId)?.name || 'Source';
  const toOutletName = outlets.find(o => o.id === toOutletId)?.name || 'Destination';

  const handleTransferSubmit = () => {
    const bMove = Number(bulkQty) || 0;
    const pMove = Number(pieceQty) || 0;

    if (fromOutletId === toOutletId) {
        setError("Source and destination branch cannot be the same.");
        return;
    }

    if (bMove === 0 && pMove === 0) {
        setError("Please enter a quantity to move.");
        return;
    }

    if (bMove > sourceBalance.bulkQuantity || pMove > sourceBalance.pieceQuantity) {
        setError("Not enough stock available at source branch.");
        return;
    }

    setError(null);
    setIsProcessing(true);

    // Simulate network delay
    setTimeout(() => {
        onTransfer(product.id, fromOutletId, toOutletId, bMove, pMove);
        setIsProcessing(false);
        setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark flex flex-col animate-in zoom-in-95 duration-500 overflow-y-auto">
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20 animate-bounce">
            <Icon name="check_circle" className="text-6xl" />
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Transfer Successful!</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs leading-relaxed">
            You have successfully moved stock between branches. The inventory levels have been updated across your shop.
          </p>

          <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl p-6 space-y-4 mb-8">
             <div className="flex flex-col items-center gap-2 pb-4 border-b border-slate-50 dark:border-slate-700/50">
                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Item Moved</span>
                <span className="text-xl font-black text-slate-800 dark:text-white">{product.name}</span>
             </div>
             
             <div className="grid grid-cols-2 gap-4 py-2">
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">From</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{fromOutletName}</p>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">To</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{toOutletName}</p>
                </div>
             </div>

             <div className="pt-2 border-t border-slate-100 dark:border-slate-700/50">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Quantity</span>
                    <div className="flex gap-2">
                        {Number(bulkQty) > 0 && <span className="font-bold text-slate-800 dark:text-white">{bulkQty} {product.bulkUnitName}s</span>}
                        {Number(pieceQty) > 0 && <span className="font-bold text-emerald-500">{pieceQty} {product.pieceUnitName}s</span>}
                    </div>
                </div>
             </div>
          </div>

          <button 
            onClick={onBack}
            className="w-full max-w-xs py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[80] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-slate-800 dark:text-white truncate">Move Inventory</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-28">
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
            <Icon name="move_item" className="absolute -right-4 -bottom-4 text-9xl opacity-10" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Product to move</p>
            <h2 className="text-2xl font-black">{product.name}</h2>
            <p className="text-xs text-slate-400 mt-1">1 {product.bulkUnitName} = {product.unitsPerBulk} {product.pieceUnitName}s</p>
        </div>

        <section className="space-y-6">
            <div className="grid grid-cols-1 gap-6 relative">
                {/* SOURCE */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">From Branch</label>
                    <select 
                        value={fromOutletId}
                        onChange={(e) => setFromOutletId(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary appearance-none"
                    >
                        {outlets.map(o => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Available Stock Here</span>
                        <div className="flex gap-3 text-xs font-black text-slate-700 dark:text-slate-300">
                            <span>{sourceBalance.bulkQuantity} Bulk</span>
                            <span>{sourceBalance.pieceQuantity} Pieces</span>
                        </div>
                    </div>
                </div>

                {/* TRANSFER ICON */}
                <div className="absolute left-1/2 top-[45%] -translate-x-1/2 z-10 size-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg ring-4 ring-background-light dark:ring-background-dark">
                    <Icon name="arrow_downward" />
                </div>

                {/* DESTINATION */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">To Branch</label>
                    <select 
                        value={toOutletId}
                        onChange={(e) => setToOutletId(e.target.value)}
                        className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary appearance-none"
                    >
                        {outlets.map(o => (
                            <option key={o.id} value={o.id}>{o.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* QUANTITY ENTRY */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Quantity to Move</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">{product.bulkUnitName}s</label>
                        <input 
                            type="number"
                            value={bulkQty}
                            onChange={(e) => setBulkQty(e.target.value)}
                            placeholder="0"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1">{product.pieceUnitName}s</label>
                        <input 
                            type="number"
                            value={pieceQty}
                            onChange={(e) => setPieceQty(e.target.value)}
                            placeholder="0"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-lg font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
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

        <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-2xl border border-blue-100 dark:border-blue-500/10 flex gap-4">
            <Icon name="info" className="text-blue-500" />
            <p className="text-[10px] text-slate-500 leading-relaxed">
                Stock movements are logged as internal transfers and do not count as sales. Stock worth will remain the same for the entire shop but shift between branch balances.
            </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={handleTransferSubmit}
          disabled={isProcessing}
          className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
             <>
               <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               <span>Processing...</span>
             </>
          ) : (
            <>
              <Icon name="swap_horiz" />
              <span>Confirm Movement</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
