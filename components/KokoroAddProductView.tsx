
import React, { useState } from 'react';
import { Icon } from './Icon';

interface KokoroAddProductViewProps {
  onBack: () => void;
  existingProductId?: string | null;
}

export const KokoroAddProductView: React.FC<KokoroAddProductViewProps> = ({ onBack, existingProductId }) => {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [name, setName] = useState('');
  const [bulkQty, setBulkQty] = useState('');
  const [unitsPerBulk, setUnitsPerBulk] = useState('12');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');

  const handleVoiceToggle = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setTimeout(() => {
        setName('Red Ankara Prints');
        setCostPrice('12000');
        setIsVoiceActive(false);
      }, 2000);
    }
  };

  const unitCost = (Number(costPrice) || 0) / (Number(unitsPerBulk) || 1);

  return (
    <div className="fixed inset-0 z-[70] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600">
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1">{existingProductId ? 'Restock Item' : 'New Product'}</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-28">
        <div className="flex justify-center mb-4">
           <button 
             onClick={handleVoiceToggle}
             className={`size-24 rounded-full flex flex-col items-center justify-center gap-1 transition-all ${
               isVoiceActive ? 'bg-rose-500 scale-110 shadow-lg shadow-rose-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
             }`}
           >
              <Icon name={isVoiceActive ? "graphic_eq" : "mic"} className={isVoiceActive ? "text-white" : "text-3xl"} />
              <span className={`text-[10px] font-bold uppercase ${isVoiceActive ? 'text-white' : ''}`}>{isVoiceActive ? 'Listening...' : 'Voice Entry'}</span>
           </button>
        </div>

        <section className="space-y-5">
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Item Name</label>
             <input 
               type="text" 
               value={name}
               onChange={(e) => setName(e.target.value)}
               placeholder="What are you adding?" 
               className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
             />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bulk Qty</label>
                <input 
                  type="number" 
                  value={bulkQty}
                  onChange={(e) => setBulkQty(e.target.value)}
                  placeholder="0" 
                  className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Pcs per Bulk</label>
                <input 
                  type="number" 
                  value={unitsPerBulk}
                  onChange={(e) => setUnitsPerBulk(e.target.value)}
                  className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Bulk Cost Price</label>
             <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                <input 
                  type="number" 
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                />
             </div>
             <p className="text-[10px] text-slate-400 font-bold ml-1 uppercase tracking-tight">Est. Unit Cost: ₦{unitCost.toFixed(2)}</p>
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Selling Price (per Piece)</label>
             <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
                <input 
                  type="number" 
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-primary outline-none focus:ring-2 focus:ring-primary"
                />
             </div>
           </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 z-50">
        <button 
          onClick={onBack}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all"
        >
          {existingProductId ? 'Confirm Restock' : 'Save Product'}
        </button>
      </div>
    </div>
  );
};
