
import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from './Icon';
import { SpineProduct, SpineSaleItem, ViewType, SpineSale, SpineCustomer } from '../types';

interface CartItem extends SpineSaleItem {
  bulkUnitName: string;
  pieceUnitName: string;
  unitsPerBulk: number;
  originalPiecePrice: number;
  originalBulkPrice?: number;
}

interface SpinePOSViewProps {
  products: SpineProduct[];
  customers: SpineCustomer[];
  onBack: () => void;
  onNavigate: (view: ViewType, id?: string) => void;
  onRecordSale: (sale: SpineSale) => void;
  onAddCustomer: (name: string, phone: string) => string;
  startAtCheckout?: boolean;
  initialCart?: SpineSaleItem[];
}

type PaymentMethodType = 'cash' | 'transfer' | 'wallet' | 'debt' | 'multi';

export const SpinePOSView: React.FC<SpinePOSViewProps> = ({ products, customers, onBack, onNavigate, onRecordSale, onAddCustomer, startAtCheckout = false, initialCart = [] }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(startAtCheckout);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Barcode Scanning state
  const [isScanning, setIsScanning] = useState(false);
  const [scanToast, setScanToast] = useState<string | null>(null);

  // Customer Selection State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [isRegisteringCustomer, setIsRegisteringCustomer] = useState(false);
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);

  // Calculator Modal State
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [calcTab, setCalcTab] = useState<'math' | 'stock'>('math');
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcEquation, setCalcEquation] = useState('');
  const [calcNewNumber, setCalcNewNumber] = useState(true);
  const [calcSearch, setCalcSearch] = useState('');

  // Bargaining State
  const [editingPriceIndex, setEditingPriceIndex] = useState<number | null>(null);
  const [editPriceValue, setEditPriceValue] = useState('');
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  // Multi-pay state
  const [splitAmounts, setSplitAmounts] = useState({
    cash: '',
    transfer: '',
    wallet: ''
  });

  // Handle Initial Cart
  useEffect(() => {
      if (initialCart.length > 0 && cart.length === 0) {
          const mappedItems: CartItem[] = initialCart.map(i => {
              const product = products.find(p => p.id === i.productId);
              return {
                  ...i,
                  bulkUnitName: product?.bulkUnitName || 'Bulk',
                  pieceUnitName: product?.pieceUnitName || 'Piece',
                  unitsPerBulk: product?.unitsPerBulk || 1,
                  originalPiecePrice: product?.sellingPricePerPiece || i.priceAtSale,
                  originalBulkPrice: product?.sellingPricePerBulk,
              };
          });
          setCart(mappedItems);
      }
  }, [initialCart, products]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const topSellingItems = useMemo(() => products.slice(0, 4), [products]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.serialNumber && p.serialNumber.toLowerCase() === searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  const customerResults = useMemo(() => {
      if (!customerSearch.trim()) return customers;
      return customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch));
  }, [customers, customerSearch]);

  const calcStockResults = useMemo(() => {
    if (!calcSearch.trim()) return products.slice(0, 10);
    return products.filter(p => p.name.toLowerCase().includes(calcSearch.toLowerCase()));
  }, [calcSearch, products]);

  // --- Calculator Logic ---
  const handleCalcDigit = (digit: string) => {
    if (calcNewNumber) {
      setCalcDisplay(digit);
      setCalcNewNumber(false);
    } else {
      setCalcDisplay(prev => prev === '0' ? digit : prev + digit);
    }
  };

  const handleCalcOp = (op: string) => {
    setCalcEquation(calcDisplay + ' ' + op);
    setCalcNewNumber(true);
  };

  const handleCalcEqual = () => {
    try {
      const equation = calcEquation + ' ' + calcDisplay;
      const parts = equation.split(' ');
      const n1 = parseFloat(parts[0]);
      const n2 = parseFloat(parts[2]);
      const op = parts[1];
      let res = 0;
      if (op === '+') res = n1 + n2;
      if (op === '-') res = n1 - n2;
      if (op === '*') res = n1 * n2;
      if (op === '/') res = n2 !== 0 ? n1 / n2 : 0;
      
      setCalcDisplay(res.toString());
      setCalcEquation('');
      setCalcNewNumber(true);
    } catch (e) {
      setCalcDisplay('Error');
    }
  };

  const addManualCharge = () => {
    const amount = parseFloat(calcDisplay);
    if (amount > 0) {
      const manualItem: CartItem = {
        productId: 'manual-' + Date.now(),
        productName: 'Manual Charge',
        quantity: 1,
        unitType: 'piece',
        bulkUnitName: 'Bulk',
        pieceUnitName: 'Charge',
        unitsPerBulk: 1,
        originalPiecePrice: amount,
        priceAtSale: amount
      };
      setCart([manualItem, ...cart]);
      setIsCalcOpen(false);
      setCalcDisplay('0');
      setCalcEquation('');
    }
  };

  const addToCart = (product: SpineProduct) => {
    const existingIndex = cart.findIndex(i => i.productId === product.id && i.unitType === 'piece');
    
    if (existingIndex > -1) {
      updateQuantity(existingIndex, 1);
    } else {
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitType: 'piece',
        bulkUnitName: product.bulkUnitName,
        pieceUnitName: product.pieceUnitName,
        unitsPerBulk: product.unitsPerBulk,
        originalPiecePrice: product.sellingPricePerPiece,
        originalBulkPrice: product.sellingPricePerBulk,
        priceAtSale: product.sellingPricePerPiece
      };
      setCart([newItem, ...cart]);
    }
    setSearchQuery('');
    setCalcSearch('');
  };

  const handleScanInPOS = () => {
      setIsScanning(true);
      setTimeout(() => {
          const codes = products.map(p => p.serialNumber).filter(Boolean);
          const shouldSucceed = Math.random() > 0.2; // High success rate
          
          if (shouldSucceed && codes.length > 0) {
              const mockCode = codes[Math.floor(Math.random() * codes.length)];
              const found = products.find(p => p.serialNumber === mockCode);
              if (found) {
                  addToCart(found);
                  setScanToast(`Added ${found.name} to cart`);
              } else {
                  setScanToast("Product not found");
              }
          } else {
              setScanToast("Scan failed or item unknown");
          }
          
          setIsScanning(false);
          setTimeout(() => setScanToast(null), 3000);
      }, 1500);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const item = newCart[index];
      const newQty = Math.max(1, item.quantity + delta);
      newCart[index] = { ...item, quantity: newQty };
      return newCart;
    });
  };

  const toggleUnitType = (index: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const item = newCart[index];
      const newType = item.unitType === 'piece' ? 'bulk' : 'piece';
      
      let newPrice = 0;
      if (newType === 'bulk') {
          newPrice = item.originalBulkPrice || (item.originalPiecePrice * item.unitsPerBulk);
      } else {
          newPrice = item.originalPiecePrice;
      }
        
      newCart[index] = { 
        ...item, 
        unitType: newType,
        priceAtSale: newPrice
      };
      return newCart;
    });
  };

  const handlePriceOverride = (index: number) => {
      const newPrice = parseFloat(editPriceValue);
      if (!isNaN(newPrice)) {
          setCart(prev => {
              const next = [...prev];
              next[index] = { ...next[index], priceAtSale: newPrice };
              return next;
          });
      }
      setEditingPriceIndex(null);
      setEditPriceValue('');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, i) => sum + (i.priceAtSale * i.quantity), 0);
  const total = Math.max(0, subtotal - globalDiscount);
  
  const totalSplitPaid = useMemo(() => {
    return (Number(splitAmounts.cash) || 0) + 
           (Number(splitAmounts.transfer) || 0) + 
           (Number(splitAmounts.wallet) || 0);
  }, [splitAmounts]);

  const effectiveAmountPaid = paymentMethod === 'multi' ? totalSplitPaid : (paymentMethod === 'debt' ? 0 : (Number(amountPaid) || 0));
  const changeDue = Math.max(0, effectiveAmountPaid - total);
  const remainingDue = Math.max(0, total - effectiveAmountPaid);

  const handleRegisterCustomer = () => {
    if (!customerSearch || !newCustomerPhone) return;
    const newId = onAddCustomer(customerSearch, newCustomerPhone);
    setSelectedCustomerId(newId);
    setIsRegisteringCustomer(false);
    setNewCustomerPhone('');
  };

  const handleFinish = () => {
    const sale: SpineSale = {
        id: `S${Date.now()}`,
        items: cart.map(i => ({
            productId: i.productId,
            productName: i.productName,
            quantity: i.quantity,
            priceAtSale: i.priceAtSale,
            unitType: i.unitType
        })),
        totalAmount: total,
        totalProfit: total * 0.25, 
        paymentMethod: paymentMethod === 'multi' ? 'cash' : paymentMethod as any,
        amountPaid: effectiveAmountPaid,
        balanceDue: paymentMethod === 'debt' ? total : remainingDue,
        customerId: selectedCustomerId || undefined, // Always link customer if selected
        timestamp: 'Just now',
        outletId: 'o1', 
        recordedByUserId: 'u1' 
    };
    onRecordSale(sale);
  };

  const handleSplitChange = (method: keyof typeof splitAmounts, value: string) => {
    setSplitAmounts(prev => ({ ...prev, [method]: value }));
  };

  const selectedCustomer = useMemo(() => customers.find(c => c.id === selectedCustomerId), [customers, selectedCustomerId]);

  if (showCheckout) {
    return (
      <div className="fixed inset-0 z-[110] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-bottom duration-500">
        <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light dark:bg-background-dark z-10 border-b border-slate-200 dark:border-slate-800">
          <button onClick={() => setShowCheckout(false)} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
            <Icon name="arrow_back" className="text-2xl" />
          </button>
          <h1 className="text-lg font-bold flex-1 text-slate-800 dark:text-white">Checkout</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-10">
          <div className="text-center">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Final Total</p>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white">₦{total.toLocaleString()}</h2>
            {globalDiscount > 0 && (
                <p className="text-xs font-bold text-emerald-500 mt-2">Bargained down from ₦{subtotal.toLocaleString()}</p>
            )}
          </div>

          {/* Persistent Customer Selection Section */}
          <section className="space-y-3">
             <div className="flex items-center justify-between px-1">
                 <label className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Customer Link</label>
                 {selectedCustomerId && (
                     <button onClick={() => setSelectedCustomerId('')} className="text-[10px] font-bold text-rose-500 uppercase">Remove</button>
                 )}
             </div>

             {selectedCustomer ? (
                 <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl animate-in zoom-in-95 duration-200">
                     <div className="flex items-center gap-4">
                         <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-black">
                             {selectedCustomer.name[0]}
                         </div>
                         <div>
                             <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedCustomer.name}</p>
                             <p className="text-[10px] text-slate-500">{selectedCustomer.phone}</p>
                         </div>
                     </div>
                     <button onClick={() => setShowCustomerPicker(true)} className="size-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-700">
                         <Icon name="sync" className="text-sm" />
                     </button>
                 </div>
             ) : (
                <button 
                    onClick={() => setShowCustomerPicker(true)}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:border-primary transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <Icon name="person_add" className="group-hover:text-primary transition-colors" />
                        <span className="text-sm font-bold">Tag a Customer (Optional)</span>
                    </div>
                    <Icon name="chevron_right" className="text-slate-300" />
                </button>
             )}
          </section>

          <section className="space-y-4">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block ml-1">Payment Method</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'cash', icon: 'payments', label: 'Cash' },
                { id: 'transfer', icon: 'account_balance', label: 'Transfer' },
                { id: 'wallet', icon: 'account_balance_wallet', label: 'Mix Wallet' },
                { id: 'debt', icon: 'person_search', label: 'Pay Later' },
                { id: 'multi', icon: 'call_split', label: 'Multi Pay' },
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    paymentMethod === m.id 
                    ? 'bg-primary text-white border-primary shadow-lg scale-105' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Icon name={m.icon} className="mb-2" />
                  <span className="text-[10px] font-bold uppercase">{m.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Payment Method Specific UI */}
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
            {paymentMethod === 'transfer' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-3xl p-6 border border-blue-100 dark:border-blue-800/50 shadow-sm space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <Icon name="account_balance" className="text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold text-slate-800 dark:text-blue-100">Bank Transfer Details</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Bank Name</p>
                            <p className="text-sm font-black text-slate-800 dark:text-white">Providus Bank</p>
                        </div>
                        <Icon name="business" className="text-slate-300" />
                    </div>
                    <div 
                        onClick={() => handleCopy('9928374821', 'acc_no')}
                        className="flex justify-between items-center bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-blue-100/50 dark:border-blue-800/20 cursor-pointer active:scale-95 transition-transform"
                    >
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Account Number</p>
                            <p className="text-lg font-black text-slate-800 dark:text-white tracking-widest">9928374821</p>
                        </div>
                        <Icon name={copiedField === 'acc_no' ? "check" : "content_copy"} className={copiedField === 'acc_no' ? "text-emerald-500" : "text-blue-500"} />
                    </div>
                    <div className="flex justify-between items-center bg-white dark:bg-slate-800/50 p-3 rounded-xl border border-blue-100/50 dark:border-blue-800/20">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Account Name</p>
                            <p className="text-sm font-black text-slate-800 dark:text-white">Bisi Textiles - Spine</p>
                        </div>
                    </div>
                </div>
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-800/50 shadow-sm space-y-6 flex flex-col items-center">
                <div className="w-full flex items-center gap-3 self-start">
                    <Icon name="account_balance_wallet" className="text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-slate-800 dark:text-emerald-100">Mix Wallet Payment</h3>
                </div>

                <div className="relative p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-inner border border-emerald-100 dark:border-emerald-800">
                    <div className="size-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden rounded-xl">
                        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20">
                            {Array.from({ length: 64 }).map((_, i) => (
                                <div key={i} className={`border border-black/10 ${Math.random() > 0.5 ? 'bg-black' : ''}`} />
                            ))}
                        </div>
                        <div className="relative z-10 size-16 bg-white dark:bg-emerald-500 rounded-2xl shadow-xl flex items-center justify-center">
                            <Icon name="token" className="text-emerald-600 dark:text-white text-3xl" />
                        </div>
                    </div>
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg border-2 border-white dark:border-slate-900 animate-pulse">
                        SCAN TO PAY
                    </div>
                </div>

                <div className="w-full text-center space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Business ID</p>
                    <div 
                        onClick={() => handleCopy('MIX-BISI-902', 'mix_id')}
                        className="flex items-center justify-center gap-2 group cursor-pointer active:scale-95 transition-transform"
                    >
                        <span className="text-xl font-black text-slate-800 dark:text-white">MIX-BISI-902</span>
                        <Icon name={copiedField === 'mix_id' ? "check" : "content_copy"} className={copiedField === 'mix_id' ? "text-emerald-500" : "text-emerald-600 dark:text-emerald-400"} />
                    </div>
                </div>
              </div>
            )}

            {paymentMethod === 'debt' && !selectedCustomerId && (
                <div className="bg-rose-50 dark:bg-rose-900/20 rounded-3xl p-6 border border-rose-200 dark:border-rose-800/50 shadow-sm flex flex-col items-center gap-3 animate-in shake duration-300">
                    <div className="size-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-500">
                        <Icon name="person_search" className="text-2xl" />
                    </div>
                    <p className="text-sm font-bold text-rose-600 dark:text-rose-400 text-center">Please link a customer to record a credit sale.</p>
                    <button onClick={() => setShowCustomerPicker(true)} className="px-6 py-2 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg">Link Now</button>
                </div>
            )}
          </div>

          {paymentMethod === 'multi' ? (
            <section className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Split Payments</span>
                        <span className={`text-xs font-bold ${remainingDue === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {remainingDue === 0 ? 'Fully Paid' : `Remaining: ₦${remainingDue.toLocaleString()}`}
                        </span>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            { id: 'cash', label: 'Cash', icon: 'payments' },
                            { id: 'transfer', icon: 'account_balance', label: 'Transfer' },
                            { id: 'wallet', icon: 'account_balance_wallet', label: 'Wallet' }
                        ].map(sm => (
                            <div key={sm.id} className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                    <Icon name={sm.icon} className="text-slate-400 text-sm" />
                                    <span className="text-sm font-bold text-slate-400">₦</span>
                                </div>
                                <input 
                                    type="number"
                                    value={splitAmounts[sm.id as keyof typeof splitAmounts]}
                                    onChange={(e) => handleSplitChange(sm.id as any, e.target.value)}
                                    placeholder={`${sm.label} amount`}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
          ) : (
            paymentMethod !== 'debt' && (
                <section className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block ml-1">Amount Paid ({paymentMethod === 'wallet' ? 'Mix Wallet' : paymentMethod})</label>
                    <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₦</span>
                    <input 
                        type="number" 
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(e.target.value)}
                        placeholder={total.toString()}
                        className="w-full pl-10 pr-4 py-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-3xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    />
                    </div>
                    {changeDue > 0 && (
                    <p className="text-sm text-emerald-500 font-bold ml-1 flex items-center gap-1">
                        <Icon name="info" className="text-sm" /> Return Balance: ₦{changeDue.toLocaleString()}
                    </p>
                    )}
                </section>
            )
          )}

          <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Items ({cart.length})</span>
              <span className="font-bold text-slate-800 dark:text-white">₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
           <button 
             onClick={handleFinish}
             disabled={(paymentMethod !== 'debt' && effectiveAmountPaid < total) || (paymentMethod === 'debt' && (!selectedCustomerId || isRegisteringCustomer))}
             className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
           >
             {paymentMethod === 'debt' ? 'Record Credit Sale' : 'Finish & Record Sale'}
           </button>
        </div>

        {/* Global Customer Picker Modal */}
        {showCustomerPicker && (
            <div className="fixed inset-0 z-[120] flex items-end justify-center px-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => !isRegisteringCustomer && setShowCustomerPicker(false)} />
                <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[3rem] p-10 shadow-2xl animate-in slide-in-from-bottom duration-400 border-t border-white/10 flex flex-col max-h-[85vh]">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                            <Icon name="group_add" className="text-primary" />
                            Select Customer
                        </h2>
                        <button onClick={() => setShowCustomerPicker(false)} className="p-2 -mr-2 text-slate-400 hover:text-slate-600">
                            <Icon name="close" />
                        </button>
                    </div>

                    {!isRegisteringCustomer ? (
                        <>
                            <div className="relative mb-6 shrink-0">
                                <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                                <input 
                                    type="text"
                                    placeholder="Search by name or phone..."
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                    className="w-full pl-9 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                                    autoFocus
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-6">
                                {customerResults.map(customer => (
                                    <button 
                                        key={customer.id}
                                        onClick={() => { setSelectedCustomerId(customer.id); setShowCustomerPicker(false); }}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                            selectedCustomerId === customer.id 
                                            ? 'bg-primary/5 border-primary shadow-md' 
                                            : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`size-10 rounded-full flex items-center justify-center font-black ${selectedCustomerId === customer.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700'}`}>
                                                {customer.name[0]}
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-bold">{customer.name}</p>
                                                <p className="text-[10px] opacity-70">{customer.phone}</p>
                                            </div>
                                        </div>
                                        {selectedCustomerId === customer.id && <Icon name="check_circle" className="text-primary" />}
                                    </button>
                                ))}
                                
                                {customerSearch.trim() && (
                                    <button 
                                        onClick={() => setIsRegisteringCustomer(true)}
                                        className="w-full flex flex-col items-center gap-1 p-6 rounded-2xl border-2 border-dashed border-primary/30 text-primary bg-primary/5 active:scale-[0.98] transition-all"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon name="person_add" className="text-xl" />
                                            <span className="font-black text-sm uppercase tracking-widest">Register "{customerSearch}"</span>
                                        </div>
                                        <p className="text-[10px] opacity-70">Add this new customer to your database</p>
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6 animate-in zoom-in-95 duration-200">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={customerSearch}
                                    onChange={(e) => setCustomerSearch(e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    placeholder="+234..."
                                    value={newCustomerPhone}
                                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                                    className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={() => setIsRegisteringCustomer(false)}
                                    className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleRegisterCustomer}
                                    disabled={!newCustomerPhone}
                                    className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg disabled:opacity-50"
                                >
                                    Register & Link
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="h-8 shrink-0" />
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      
      {/* Scanning Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/20 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary shadow-[0_0_15px_#10B981] animate-scan-line" />
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
            </div>
            <p className="mt-8 text-white font-black text-xs uppercase tracking-[0.3em] animate-pulse">Scanning Product...</p>
            <button onClick={() => setIsScanning(false)} className="mt-12 text-slate-500 font-bold uppercase text-[10px]">Cancel</button>
        </div>
      )}

      {scanToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[250] bg-slate-900 border border-white/10 px-4 py-2 rounded-full shadow-2xl animate-in slide-in-from-top-4">
              <p className="text-xs font-black uppercase tracking-widest text-primary">
                  {scanToast}
              </p>
          </div>
      )}

      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1 text-slate-800 dark:text-white">New Sale</h1>
        <div className="flex items-center gap-2">
            <button 
                onClick={handleScanInPOS}
                className="size-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                title="Scan Barcode"
            >
                <Icon name="qr_code_scanner" />
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-500 uppercase">Audit On</span>
            </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 relative">
        {/* Global Stock Search */}
        <section className="relative z-30">
          <div className="relative">
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search item name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {searchResults.length > 0 ? (
                searchResults.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => addToCart(p)}
                    className="w-full p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                        <Icon name="inventory_2" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-slate-800 dark:text-white">{p.name}</p>
                        <p className="text-[10px] text-slate-500">₦{p.sellingPricePerPiece} / {p.pieceUnitName}</p>
                      </div>
                    </div>
                    <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Icon name="add_circle" className="text-sm font-bold" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <p>No items found</p>
                </div>
              )}
            </div>
          )}
        </section>

        {!searchQuery && (
          <section>
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 px-1 flex items-center gap-2">
              <Icon name="trending_up" className="text-primary text-sm" />
              Quick Pick
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {topSellingItems.map(p => (
                <button 
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center gap-2 active:bg-primary/5 active:border-primary transition-all text-center group"
                >
                  <div className="size-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                    <Icon name="shopping_bag" className="text-3xl" />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="font-bold text-slate-800 dark:text-white text-sm truncate">{p.name}</p>
                    <p className="text-xs text-primary font-extrabold mt-0.5">₦{p.sellingPricePerPiece}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Cart Items ({cart.length})</h3>
            {cart.length > 0 && (
              <button 
                onClick={() => setCart([])}
                className="text-xs font-bold text-rose-500 hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="space-y-3 pb-48">
            {cart.map((item, idx) => (
              <div 
                key={`${item.productId}-${item.unitType}`} 
                className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm animate-in slide-in-from-bottom-2 duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="font-bold text-slate-800 dark:text-white truncate text-base">{item.productName}</p>
                    {editingPriceIndex === idx ? (
                        <div className="mt-2 flex items-center gap-2 animate-in slide-in-from-left-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₦</span>
                                <input 
                                    type="number"
                                    value={editPriceValue}
                                    onChange={(e) => setEditPriceValue(e.target.value)}
                                    className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-900 border border-amber-500 rounded-lg text-sm font-bold text-amber-600 outline-none"
                                    autoFocus
                                    onBlur={() => handlePriceOverride(idx)}
                                    onKeyDown={(e) => e.key === 'Enter' && handlePriceOverride(idx)}
                                />
                            </div>
                            <button onClick={() => setEditingPriceIndex(null)} className="p-2 text-slate-400"><Icon name="close" className="text-sm" /></button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => { setEditingPriceIndex(idx); setEditPriceValue(item.priceAtSale.toString()); }}
                            className="flex items-center gap-2 mt-1 px-2 py-1 -ml-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group"
                        >
                            <span className={`text-xs font-bold ${item.priceAtSale !== (item.unitType === 'piece' ? item.originalPiecePrice : (item.originalBulkPrice || item.originalPiecePrice * item.unitsPerBulk)) ? 'text-amber-500' : 'text-slate-500'}`}>
                                ₦{item.priceAtSale.toLocaleString()} / {item.unitType === 'piece' ? item.pieceUnitName : item.bulkUnitName}
                            </span>
                            <Icon name="edit" className="text-[14px] text-slate-300 group-hover:text-primary transition-colors" />
                        </button>
                    )}
                  </div>
                  <button onClick={() => removeFromCart(idx)} className="p-2 -mt-2 -mr-2 text-slate-300 hover:text-rose-500">
                    <Icon name="delete" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl w-36 shrink-0">
                    <button 
                      onClick={() => item.unitType !== 'piece' && toggleUnitType(idx)}
                      className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${item.unitType === 'piece' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}
                    >
                      {item.pieceUnitName}
                    </button>
                    <button 
                      onClick={() => item.unitType !== 'bulk' && toggleUnitType(idx)}
                      className={`flex-1 py-1.5 text-[9px] font-black uppercase rounded-lg transition-all ${item.unitType === 'bulk' ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-400'}`}
                    >
                      {item.bulkUnitName}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                    <button onClick={() => updateQuantity(idx, -1)} className="size-10 rounded-lg flex items-center justify-center text-slate-500"><Icon name="remove" /></button>
                    <span className="w-8 text-center font-black text-slate-800 dark:text-white text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(idx, 1)} className="size-10 rounded-lg flex items-center justify-center text-primary"><Icon name="add" /></button>
                  </div>
                  
                  <div className="text-right flex-1">
                    <p className="text-base font-black text-slate-800 dark:text-white">₦{(item.priceAtSale * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}

            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center opacity-30">
                <Icon name="receipt_long" className="text-6xl mb-4" />
                <p className="font-bold text-slate-500">Cart is empty</p>
              </div>
            )}
          </div>
        </section>

        {!showCheckout && !isCalcOpen && (
          <button 
            onClick={() => setIsCalcOpen(true)}
            className="fixed bottom-32 right-6 size-14 rounded-full bg-amber-500 text-white shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all"
          >
            <Icon name="calculate" className="text-2xl" />
          </button>
        )}
      </div>

      {isCalcOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center px-4 pb-24">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCalcOpen(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 border border-white/10 flex flex-col max-h-[85vh]">
              <div className="flex justify-between items-center mb-4 shrink-0">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale Utility</span>
                  <button onClick={() => setIsCalcOpen(false)} className="text-slate-400 hover:text-white p-2 -mr-2"><Icon name="close" /></button>
              </div>

              <div className="flex p-1 bg-white/5 rounded-xl mb-4 shrink-0">
                  <button 
                    onClick={() => setCalcTab('math')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${calcTab === 'math' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                  >
                    Keypad
                  </button>
                  <button 
                    onClick={() => setCalcTab('stock')}
                    className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${calcTab === 'stock' ? 'bg-white/10 text-white' : 'text-slate-500'}`}
                  >
                    Inventory
                  </button>
              </div>
              
              {calcTab === 'math' ? (
                <div className="flex flex-col animate-in fade-in duration-300">
                    <div className="bg-black/40 rounded-2xl p-4 mb-4 text-right">
                        <p className="text-xs text-slate-500 font-mono h-4">{calcEquation}</p>
                        <p className="text-4xl font-black text-white truncate">₦{parseFloat(calcDisplay).toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','C','+'].map(k => (
                            <button 
                            key={k} 
                            onClick={() => {
                                if (k === 'C') { setCalcDisplay('0'); setCalcEquation(''); setCalcNewNumber(true); }
                                else if (['/','*','-','+'].includes(k)) handleCalcOp(k);
                                else handleCalcDigit(k);
                            }}
                            className={`aspect-square rounded-xl text-lg font-bold transition-all active:scale-90 ${
                                ['/','*','-','+'].includes(k) ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-white hover:bg-white/10'
                            }`}
                            >
                            {k === '*' ? '×' : k === '/' ? '÷' : k}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={handleCalcEqual}
                            className="py-3.5 bg-slate-700 text-white font-black rounded-xl active:scale-95 transition-all text-xl"
                        >
                            =
                        </button>
                        <button 
                            onClick={addManualCharge}
                            disabled={parseFloat(calcDisplay) <= 0}
                            className="py-3.5 bg-primary text-white font-black rounded-xl active:scale-95 transition-all disabled:opacity-50 text-[10px] uppercase tracking-wider flex items-center justify-center gap-2"
                        >
                            <Icon name="add_shopping_cart" className="text-sm" />
                            Manual Charge
                        </button>
                    </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0 animate-in fade-in duration-300">
                    <div className="relative mb-4">
                        <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                        <input 
                            type="text"
                            placeholder="Find stock..."
                            value={calcSearch}
                            onChange={(e) => setCalcSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 bg-white/5 border-none rounded-xl text-white text-xs outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar pb-2">
                        {calcStockResults.map(p => (
                            <button 
                                key={p.id}
                                onClick={() => addToCart(p)}
                                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500">
                                        <Icon name="inventory" className="text-sm" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-white leading-tight">{p.name}</p>
                                        <p className="text-[10px] text-slate-400">₦{p.sellingPricePerPiece}</p>
                                    </div>
                                </div>
                                <Icon name="add_circle" className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        ))}
                    </div>
                </div>
              )}
          </div>
        </div>
      )}

      {cart.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom z-40">
           <div className="max-w-md mx-auto">
             <div className="mb-4">
                {showDiscountInput ? (
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl animate-in slide-in-from-bottom-2">
                        <div className="flex-1 relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Discount Amount ₦</span>
                            <input 
                                type="number"
                                value={globalDiscount}
                                onChange={(e) => setGlobalDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                                className="w-full pl-36 pr-4 py-3 bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary"
                                placeholder="0"
                                autoFocus
                            />
                        </div>
                        <button onClick={() => { setShowDiscountInput(false); }} className="size-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center">
                            <Icon name="check" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setShowDiscountInput(true)}
                        className="w-full py-3 flex items-center justify-center gap-2 text-xs font-black text-primary uppercase border border-primary/20 bg-primary/5 rounded-2xl hover:bg-primary/10 transition-colors"
                    >
                        <Icon name="sell" className="text-sm" />
                        <span>{globalDiscount > 0 ? `Bargain Applied: -₦${globalDiscount}` : 'Apply Bargain / Discount'}</span>
                    </button>
                )}
             </div>

             <div className="flex items-center justify-between mb-4 px-2">
                <div>
                  <p className="text-xs text-slate-400 font-extrabold uppercase tracking-tighter">Total Payable</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white">₦{total.toLocaleString()}</p>
                </div>
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Icon name="payments" className="text-3xl" />
                </div>
             </div>
             
             <button 
               onClick={() => setShowCheckout(true)}
               className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
             >
               <span>Continue to Checkout</span>
               <Icon name="arrow_forward" />
             </button>
           </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan-line {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
        }
        .animate-scan-line {
            animation: scan-line 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
