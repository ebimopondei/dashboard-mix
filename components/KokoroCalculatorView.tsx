import React, { useState } from 'react';
import { Icon } from './Icon';
// Updated to use SpineProduct as KokoroProduct alias
import { SpineProduct as KokoroProduct } from '../types';

interface KokoroCalculatorViewProps {
  products: KokoroProduct[];
  onBack: () => void;
}

export const KokoroCalculatorView: React.FC<KokoroCalculatorViewProps> = ({ products, onBack }) => {
  const [display, setDisplay] = useState('0');
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleDigit = (digit: string) => {
    setDisplay(prev => prev === '0' ? digit : prev + digit);
  };

  const handleOp = (op: string) => {
    setDisplay(prev => prev + ' ' + op + ' ');
  };

  const clear = () => {
    setDisplay('0');
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(display.replace(/₦/g, ''));
      setHistory(prev => [display + ' = ' + result, ...prev].slice(0, 5));
      setDisplay(result.toString());
    } catch (e) {
      setDisplay('Error');
    }
  };

  const addFromStock = (product: KokoroProduct) => {
    setDisplay(prev => {
        const val = prev === '0' ? '' : prev;
        const op = (val.length > 0 && ![' ', '+', '-', '*', '/'].includes(val.slice(-1))) ? ' + ' : '';
        return val + op + product.sellingPricePerPiece;
    });
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white flex-1">Shop Calculator</h1>
        <div className="size-10 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 flex items-center justify-center">
            <Icon name="calculate" />
        </div>
      </header>

      {/* Calculator Display */}
      <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-right">
        <div className="h-6 text-slate-400 text-xs font-mono mb-1 overflow-hidden">
            {history[0] || ''}
        </div>
        <div className="text-5xl font-black text-slate-800 dark:text-white truncate">
            {display}
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Numpad */}
          <div className="p-4 grid grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/50">
            {['7', '8', '9', '/'].map(k => (
                <button key={k} onClick={() => k === '/' ? handleOp('/') : handleDigit(k)} className="aspect-square rounded-2xl bg-white dark:bg-slate-800 shadow-sm text-xl font-bold dark:text-white active:bg-slate-100">{k}</button>
            ))}
            {['4', '5', '6', '*'].map(k => (
                <button key={k} onClick={() => k === '*' ? handleOp('*') : handleDigit(k)} className="aspect-square rounded-2xl bg-white dark:bg-slate-800 shadow-sm text-xl font-bold dark:text-white active:bg-slate-100">{k}</button>
            ))}
            {['1', '2', '3', '-'].map(k => (
                <button key={k} onClick={() => k === '-' ? handleOp('-') : handleDigit(k)} className="aspect-square rounded-2xl bg-white dark:bg-slate-800 shadow-sm text-xl font-bold dark:text-white active:bg-slate-100">{k}</button>
            ))}
            {['C', '0', '=', '+'].map(k => (
                <button 
                    key={k} 
                    onClick={() => k === 'C' ? clear() : k === '=' ? calculate() : k === '+' ? handleOp('+') : handleDigit(k)} 
                    className={`aspect-square rounded-2xl shadow-sm text-xl font-bold active:opacity-80 ${k === '=' ? 'bg-primary text-white' : k === 'C' ? 'bg-rose-100 text-rose-600' : 'bg-white dark:bg-slate-800 dark:text-white'}`}
                >
                    {k}
                </button>
            ))}
          </div>

          {/* Inventory Integration */}
          <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative">
                      <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input 
                        type="text" 
                        placeholder="Add stock item to calc..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
                      />
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {filteredProducts.map(p => (
                      <button 
                        key={p.id}
                        onClick={() => addFromStock(p)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                          <div className="flex items-center gap-3">
                              <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 text-xs">
                                  <Icon name="inventory" />
                              </div>
                              <div className="text-left">
                                  <p className="text-xs font-bold text-slate-800 dark:text-white">{p.name}</p>
                                  <p className="text-[10px] text-slate-500">₦{p.sellingPricePerPiece}</p>
                              </div>
                          </div>
                          <Icon name="add_circle" className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};