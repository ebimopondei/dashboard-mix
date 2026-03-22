
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { SpineProduct, ViewType } from '../types';

export interface CalculatedItem {
  id: string;
  name: string;
  amount: number;
  profit?: number;
  quantity: number;
  isInventory: boolean;
}

interface SpineCalculatorViewProps {
  products: SpineProduct[];
  onBack: () => void;
  onNavigate?: (view: ViewType, id?: string) => void;
  onPushToSale: (items: CalculatedItem[]) => void;
}

export const SpineCalculatorView: React.FC<SpineCalculatorViewProps> = ({ products, onBack, onNavigate, onPushToSale }) => {
  const [calcMode, setCalcMode] = useState<'quotation' | 'standard'>('quotation');
  const [activeTab, setActiveTab] = useState<'keypad' | 'inventory'>('keypad');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  
  // Quotation Mode State
  const [display, setDisplay] = useState('0');
  const [calcItems, setCalcItems] = useState<CalculatedItem[]>([]);
  const [search, setSearch] = useState('');

  // Standard Mode State
  const [stdDisplay, setStdDisplay] = useState('0');
  const [stdEquation, setStdEquation] = useState('');
  const [lastOperator, setLastOperator] = useState<string | null>(null);
  const [newNumberExpected, setNewNumberExpected] = useState(false);

  const totalAmount = calcItems.reduce((sum, item) => sum + (item.amount * item.quantity), 0);

  // --- QUOTATION LOGIC ---
  const handleDigit = (digit: string) => {
    setDisplay(prev => {
      if (prev === '0') return digit;
      if (prev.length > 10) return prev;
      return prev + digit;
    });
  };

  const handleBackspace = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const addItemManual = () => {
    const amount = parseFloat(display);
    if (amount === 0) return;

    const newItem: CalculatedItem = {
      id: `manual-${Date.now()}`,
      name: 'Manual Entry',
      amount: amount,
      quantity: 1,
      isInventory: false
    };

    setCalcItems([newItem, ...calcItems]);
    setDisplay('0');
  };

  const addInventoryItem = (product: SpineProduct) => {
    const existingIndex = calcItems.findIndex(i => i.isInventory && i.id.split('-')[1] === product.id);
    
    if (existingIndex > -1) {
      updateQuantity(calcItems[existingIndex].id, 1);
    } else {
      const newItem: CalculatedItem = {
        id: `inv-${product.id}-${Date.now()}`,
        name: product.name,
        amount: product.sellingPricePerPiece,
        profit: product.sellingPricePerPiece - product.costPricePerPiece,
        quantity: 1,
        isInventory: true
      };
      setCalcItems([newItem, ...calcItems]);
    }
    setSearch('');
  };

  const updateQuantity = (id: string, delta: number) => {
    setCalcItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCalcItems(prev => prev.filter(item => item.id !== id));
  };

  // --- STANDARD MODE LOGIC ---
  const handleStdDigit = (digit: string) => {
    if (newNumberExpected) {
      setStdDisplay(digit);
      setNewNumberExpected(false);
    } else {
      setStdDisplay(prev => (prev === '0' ? digit : prev + digit));
    }
  };

  const handleStdOperator = (op: string) => {
    setLastOperator(op);
    setStdEquation(stdDisplay + ' ' + op);
    setNewNumberExpected(true);
  };

  const handleStdCalculate = () => {
    if (!lastOperator) return;
    const parts = stdEquation.split(' ');
    const firstNum = parseFloat(parts[0]);
    const secondNum = parseFloat(stdDisplay);
    let result = 0;

    switch (lastOperator) {
      case '+': result = firstNum + secondNum; break;
      case '-': result = firstNum - secondNum; break;
      case '×': result = firstNum * secondNum; break;
      case '÷': result = secondNum !== 0 ? firstNum / secondNum : 0; break;
    }

    setStdDisplay(result.toString());
    setStdEquation('');
    setLastOperator(null);
    setNewNumberExpected(true);
  };

  const handleStdClear = () => {
    setStdDisplay('0');
    setStdEquation('');
    setLastOperator(null);
  };

  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden">
      {/* Header */}
      <header className="flex flex-col shrink-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 p-4 pb-2">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
            <Icon name="close" className="text-2xl" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Business Calculator</h1>
          </div>
          <button 
            onClick={() => { setCalcItems([]); setStdDisplay('0'); setStdEquation(''); }} 
            className="text-xs font-bold text-rose-500 uppercase px-3 py-1 bg-rose-50 dark:bg-rose-500/10 rounded-lg"
          >
            Reset
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="px-4 pb-3">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl shadow-inner border border-slate-200/50 dark:border-slate-800">
            <button 
              onClick={() => setCalcMode('quotation')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${calcMode === 'quotation' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
              Smart Quotation
            </button>
            <button 
              onClick={() => setCalcMode('standard')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${calcMode === 'standard' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
              Standard Calc
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {calcMode === 'quotation' ? (
          <>
            {/* The 'Tape' */}
            <div className={`flex-1 bg-slate-50 dark:bg-black/40 overflow-y-auto p-4 space-y-3 transition-all duration-300`}>
              {calcItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 grayscale p-10">
                  <Icon name="calculate" className="text-7xl mb-4" />
                  <p className="font-bold text-slate-500">Your quotation tape is empty.</p>
                  <p className="text-xs mt-1">Add items manually or from inventory.</p>
                </div>
              ) : (
                calcItems.map((item) => (
                  <div key={item.id} className="flex flex-col p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm animate-in slide-in-from-top-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Icon name="remove_circle" className="text-xl" />
                        </button>
                        <div>
                          <p className={`text-sm font-bold ${item.isInventory ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`}>
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">₦{item.amount.toLocaleString()} per unit</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-900 dark:text-white">₦{(item.amount * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-100 dark:border-slate-700/50">
                       <div className="flex items-center gap-3">
                          <button onClick={() => updateQuantity(item.id, -1)} className="size-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 border border-slate-200 dark:border-slate-700 active:scale-90"><Icon name="remove" className="text-sm" /></button>
                          <span className="w-8 text-center font-black text-slate-800 dark:text-white text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="size-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-primary border border-slate-200 dark:border-slate-700 active:scale-90"><Icon name="add" className="text-sm" /></button>
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Adjust Qty</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Totals Summary */}
            <div className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 p-4 px-6 flex justify-between items-center shadow-lg z-20">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quotation Total</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">₦{totalAmount.toLocaleString()}</p>
              </div>
              
              <button 
                onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                className={`flex items-center justify-center size-10 rounded-full transition-all ${isPanelCollapsed ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
              >
                <Icon name={isPanelCollapsed ? "keyboard_double_arrow_up" : "keyboard_double_arrow_down"} />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className={`bg-slate-100 dark:bg-slate-900 shrink-0 border-t border-slate-200 dark:border-slate-800 transition-all duration-300 ${isPanelCollapsed ? 'h-[72px]' : 'h-auto'}`}>
              
              {!isPanelCollapsed && (
                <div className="flex p-2 gap-2 animate-in fade-in duration-300">
                  <button 
                    onClick={() => setActiveTab('keypad')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'keypad' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
                  >
                    Enter Amount
                  </button>
                  <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-400'}`}
                  >
                    Pick Stock
                  </button>
                </div>
              )}

              <div className={isPanelCollapsed ? 'h-[72px]' : 'h-[280px]'}>
                {isPanelCollapsed ? (
                   <div className="flex gap-2 p-2 h-full">
                      <button 
                        onClick={() => setIsPanelCollapsed(false)}
                        className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-400 font-black text-xs border border-slate-200 dark:border-slate-700 rounded-xl active:brightness-90 flex items-center justify-center gap-2"
                      >
                        <Icon name="expand" className="text-sm" />
                        EXPAND KEYPAD
                      </button>
                      <button 
                        onClick={() => onPushToSale(calcItems)} 
                        disabled={calcItems.length === 0} 
                        className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs rounded-xl shadow-lg active:brightness-90 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <Icon name="shopping_cart_checkout" className="text-sm" />
                        PUSH TO SALE
                      </button>
                   </div>
                ) : activeTab === 'keypad' ? (
                  <div className="grid grid-cols-4 h-full animate-in slide-in-from-bottom duration-300">
                    <div className="col-span-3 bg-white dark:bg-black/20 p-4 flex items-center justify-end">
                       <span className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter truncate">₦{display}</span>
                    </div>
                    <button onClick={handleBackspace} className="bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center"><Icon name="backspace" /></button>
                    {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.', '00'].map((k) => (
                      <button key={k} onClick={() => handleDigit(k)} className="p-3 bg-white dark:bg-slate-800 border-r border-t border-slate-100 dark:border-slate-700 text-lg font-bold text-slate-700 dark:text-slate-200 active:bg-slate-50">{k}</button>
                    ))}
                    <button onClick={addItemManual} className="col-span-2 py-4 bg-primary text-white font-black text-base border-t border-r border-slate-100/10 active:brightness-90 flex items-center justify-center gap-2">
                      <Icon name="add_circle" /> ADD TO TAPE
                    </button>
                    <button onClick={() => onPushToSale(calcItems)} disabled={calcItems.length === 0} className="col-span-2 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-base border-t active:brightness-90 disabled:opacity-50 flex items-center justify-center gap-2">
                      <Icon name="shopping_cart_checkout" /> PUSH TO SALE
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full bg-white dark:bg-background-dark animate-in slide-in-from-bottom duration-300">
                     <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative">
                          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                          <input type="text" placeholder="Search stock..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border-none outline-none focus:ring-1 focus:ring-primary text-slate-800 dark:text-white" />
                        </div>
                     </div>
                     <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {filteredProducts.map(p => (
                          <button key={p.id} onClick={() => addInventoryItem(p)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400"><Icon name="inventory" /></div>
                              <div className="text-left"><p className="text-sm font-bold text-slate-800 dark:text-white">{p.name}</p><p className="text-[10px] text-slate-500 font-bold uppercase">₦{p.sellingPricePerPiece.toLocaleString()}</p></div>
                            </div>
                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Icon name="add" className="text-sm font-bold" />
                            </div>
                          </button>
                        ))}
                     </div>
                     <button onClick={() => onPushToSale(calcItems)} disabled={calcItems.length === 0} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-base border-t active:brightness-90 disabled:opacity-50 flex items-center justify-center gap-2">
                        <Icon name="shopping_cart_checkout" /> PUSH TO SALE
                      </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col animate-in fade-in duration-300">
            {/* Standard Display */}
            <div className="p-8 bg-white dark:bg-black/20 flex flex-col justify-end items-end h-40">
               <p className="text-slate-400 font-mono text-sm h-6">{stdEquation}</p>
               <h2 className="text-6xl font-black text-slate-800 dark:text-white tracking-tighter">
                 {stdDisplay.length > 10 ? stdDisplay.substring(0, 10) : stdDisplay}
               </h2>
            </div>

            {/* Standard Numpad */}
            <div className="flex-1 grid grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800">
               <button onClick={handleStdClear} className="bg-slate-100 dark:bg-slate-900 text-rose-500 font-bold text-xl">C</button>
               <button onClick={() => handleStdOperator('÷')} className="bg-slate-100 dark:bg-slate-900 text-primary font-bold text-xl">÷</button>
               <button onClick={() => handleStdOperator('×')} className="bg-slate-100 dark:bg-slate-900 text-primary font-bold text-xl">×</button>
               <button onClick={() => setStdDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0')} className="bg-slate-100 dark:bg-slate-900 text-slate-500 flex items-center justify-center"><Icon name="backspace" /></button>
               
               {['7', '8', '9'].map(n => (
                 <button key={n} onClick={() => handleStdDigit(n)} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-2xl">{n}</button>
               ))}
               <button onClick={() => handleStdOperator('-')} className="bg-slate-100 dark:bg-slate-900 text-primary font-bold text-2xl">−</button>
               
               {['4', '5', '6'].map(n => (
                 <button key={n} onClick={() => handleStdDigit(n)} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-2xl">{n}</button>
               ))}
               <button onClick={() => handleStdOperator('+')} className="bg-slate-100 dark:bg-slate-900 text-primary font-bold text-2xl">+</button>
               
               {['1', '2', '3'].map(n => (
                 <button key={n} onClick={() => handleStdDigit(n)} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-2xl">{n}</button>
               ))}
               <button onClick={handleStdCalculate} className="row-span-2 bg-primary text-white font-bold text-3xl">=</button>
               
               <button onClick={() => handleStdDigit('0')} className="col-span-2 bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-2xl">0</button>
               <button onClick={() => !stdDisplay.includes('.') && handleStdDigit('.')} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white font-bold text-2xl">.</button>
            </div>
            
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
               <button 
                onClick={() => {
                   const res = parseFloat(stdDisplay);
                   if (res > 0) {
                      setCalcItems([{ id: `std-${Date.now()}`, name: 'Calculated Value', amount: res, quantity: 1, isInventory: false }, ...calcItems]);
                      setCalcMode('quotation');
                      setStdDisplay('0');
                   }
                }}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
               >
                 <Icon name="add_to_photos" />
                 <span>Add Result to Quotation</span>
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
