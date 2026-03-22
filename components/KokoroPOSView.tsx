
import React, { useState } from 'react';
import { Icon } from './Icon';
// Updated to use Spine types as aliases to replace missing Kokoro types
import { SpineProduct as KokoroProduct, SpineSaleItem as KokoroSaleItem, ViewType } from '../types';

interface KokoroPOSViewProps {
  products: KokoroProduct[];
  onBack: () => void;
  onNavigate: (view: ViewType) => void;
}

export const KokoroPOSView: React.FC<KokoroPOSViewProps> = ({ products, onBack, onNavigate }) => {
  const [cart, setCart] = useState<KokoroSaleItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'wallet'>('cash');
  const [amountPaid, setAmountPaid] = useState('');

  const addToCart = (product: KokoroProduct) => {
    const existing = cart.find(i => i.productId === product.id);
    if (existing) {
      setCart(cart.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { 
        productId: product.id, 
        productName: product.name, 
        quantity: 1, 
        priceAtSale: product.sellingPricePerPiece,
        // Fix: Add missing unitType property required by SpineSaleItem
        unitType: 'piece'
      }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(i => i.productId !== id));
  };

  const total = cart.reduce((sum, i) => sum + (i.priceAtSale * i.quantity), 0);
  const balance = Math.max(0, total - (Number(amountPaid) || 0));

  const handleFinish = () => {
    onBack(); // Simplification for MVP
  };

  if (showCheckout) {
    return (
      <div className="fixed inset-0 z-[110] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-bottom duration-500">
        <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light dark:bg-background-dark z-10 border-b border-slate-200 dark:border-slate-800">
          <button onClick={() => setShowCheckout(false)} className="p-2 -ml-2 rounded-full text-slate-600">
            <Icon name="arrow_back" className="text-2xl" />
          </button>
          <h1 className="text-lg font-bold flex-1">Payment</h1>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="text-center">
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-1">Total Due</p>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white">₦{total.toLocaleString()}</h2>
          </div>

          <section className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block ml-1">Payment Method</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'cash', icon: 'payments', label: 'Cash' },
                { id: 'transfer', icon: 'account_balance', label: 'Transfer' },
                { id: 'wallet', icon: 'account_balance_wallet', label: 'Wallet' },
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                    paymentMethod === m.id 
                    ? 'bg-primary text-white border-primary shadow-lg' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                >
                  <Icon name={m.icon} className="mb-2" />
                  <span className="text-[10px] font-bold uppercase">{m.label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block ml-1">Amount Received</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₦</span>
              <input 
                type="number" 
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                placeholder={total.toString()}
                className="w-full pl-10 pr-4 py-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-3xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {balance > 0 && (
              <p className="text-xs text-rose-500 font-bold ml-1">Outstanding: ₦{balance.toLocaleString()}</p>
            )}
          </section>

          <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center text-sm mb-3">
              <span className="text-slate-500">Items ({cart.length})</span>
              <span className="font-bold">₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-emerald-500 font-bold">
              <span>Expected Profit</span>
              <span>₦{(total * 0.25).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
           <button 
             onClick={handleFinish}
             className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg active:scale-[0.98] transition-all"
           >
             Record Sale
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600">
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold flex-1">New Sale</h1>
        <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center">
          <Icon name="qr_code_scanner" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Quick Select Tiles */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quick Selection</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.map(p => (
              <button 
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col items-center gap-2 active:bg-primary/5 active:border-primary transition-all text-center"
              >
                <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400">
                  <Icon name="category" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">{p.name}</p>
                  <p className="text-xs text-primary font-bold">₦{p.sellingPricePerPiece}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Running Cart */}
        {cart.length > 0 && (
          <section className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-inner min-h-[200px] border border-slate-100 dark:border-slate-700">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Cart ({cart.length})</h3>
             <div className="space-y-4">
               {cart.map(item => (
                 <div key={item.productId} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-slate-800 dark:text-white">{item.productName}</p>
                      <p className="text-xs text-slate-500">₦{item.priceAtSale} per unit</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="font-bold text-slate-800 dark:text-white">x{item.quantity}</span>
                       <button onClick={() => removeFromCart(item.productId)} className="text-rose-500 p-1">
                         <Icon name="remove_circle_outline" />
                       </button>
                    </div>
                 </div>
               ))}
             </div>
          </section>
        )}
      </div>

      {/* Floating Summary Footer */}
      {cart.length > 0 && (
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-bottom">
           <div className="max-w-md mx-auto flex items-center justify-between mb-4 px-2">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Total Amount</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">₦{total.toLocaleString()}</p>
              </div>
              <Icon name="shopping_cart_checkout" className="text-primary text-3xl" />
           </div>
           <button 
             onClick={() => setShowCheckout(true)}
             className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 active:scale-[0.98] transition-transform"
           >
             Continue to Checkout
           </button>
        </div>
      )}
    </div>
  );
};
