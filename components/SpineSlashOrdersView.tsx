
import React, { useState } from 'react';
import { Icon } from './Icon';
import { SpineProduct, SpineSale, ViewType } from '../types';

interface SlashOrder {
    id: string;
    customerName: string;
    items: { productName: string, quantity: number, price: number }[];
    total: number;
    status: 'pending' | 'ready' | 'shipped' | 'delivered';
    timestamp: string;
}

interface SpineSlashOrdersViewProps {
  onBack: () => void;
  onNavigate: (view: ViewType, id?: string) => void;
  products: SpineProduct[];
}

export const SpineSlashOrdersView: React.FC<SpineSlashOrdersViewProps> = ({ onBack, onNavigate, products }) => {
  const [orders, setOrders] = useState<SlashOrder[]>([
    {
      id: 'ORD-882',
      customerName: 'Ayo Johnson',
      timestamp: 'Today, 2:15 PM',
      total: 4200,
      status: 'pending',
      items: [{ productName: 'Classic Ankara (Red)', quantity: 2, price: 2100 }]
    },
    {
      id: 'ORD-879',
      customerName: 'Blessing Okafor',
      timestamp: 'Today, 11:30 AM',
      total: 1500,
      status: 'ready',
      items: [{ productName: 'Organic Bananas', quantity: 1, price: 1500 }]
    },
    {
      id: 'ORD-875',
      customerName: 'Tunde Bakare',
      timestamp: 'Yesterday, 5:45 PM',
      total: 12500,
      status: 'shipped',
      items: [{ productName: 'Premium Parboiled Rice', quantity: 1, price: 12500 }]
    }
  ]);

  const updateStatus = (orderId: string, newStatus: SlashOrder['status']) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const getStatusBadge = (status: SlashOrder['status']) => {
      switch(status) {
          case 'pending': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20';
          case 'ready': return 'bg-blue-100 text-blue-600 dark:bg-blue-500/20';
          case 'shipped': return 'bg-purple-100 text-purple-600 dark:bg-purple-500/20';
          case 'delivered': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20';
      }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Slash Orders</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Storefront Management</p>
        </div>
        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
            <Icon name="bolt" />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
         {/* Filter Strip */}
         <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
             {['All', 'Pending', 'Ready', 'Shipped'].map(f => (
                 <button key={f} className="px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                     {f}
                 </button>
             ))}
         </div>

         {/* Stats Row */}
         <div className="grid grid-cols-3 gap-3">
             <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">New</p>
                 <p className="text-lg font-black text-amber-500">1</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Processing</p>
                 <p className="text-lg font-black text-blue-500">2</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                 <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Revenue</p>
                 <p className="text-lg font-black text-emerald-500">₦18.2k</p>
             </div>
         </div>

         {/* Order Cards */}
         <div className="space-y-4">
             {orders.map(order => (
                 <div key={order.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2">
                     <div className="p-5 border-b border-slate-50 dark:border-slate-700/50">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-base leading-none">{order.customerName}</h3>
                                <p className="text-[10px] font-bold text-slate-400 mt-1">{order.id} • {order.timestamp}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusBadge(order.status)}`}>
                                {order.status}
                            </span>
                        </div>

                        <div className="space-y-2">
                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">{item.quantity}× {item.productName}</span>
                                    <span className="text-slate-800 dark:text-white font-bold">₦{item.price.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                     </div>

                     <div className="px-5 py-4 bg-slate-50/50 dark:bg-slate-900/20 flex justify-between items-center">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Total Payout</p>
                            <p className="text-lg font-black text-slate-900 dark:text-white">₦{order.total.toLocaleString()}</p>
                        </div>
                        
                        <div className="flex gap-2">
                            {order.status === 'pending' && (
                                <button 
                                    onClick={() => updateStatus(order.id, 'ready')}
                                    className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-transform"
                                >
                                    Confirm & Pack
                                </button>
                            )}
                            {order.status === 'ready' && (
                                <button 
                                    onClick={() => updateStatus(order.id, 'shipped')}
                                    className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-transform"
                                >
                                    Hand to Rider
                                </button>
                            )}
                            {order.status === 'shipped' && (
                                <button className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200 dark:border-slate-600 cursor-default">
                                    In Transit
                                </button>
                            )}
                        </div>
                     </div>
                 </div>
             ))}
         </div>
      </div>

      {/* Logic to push orders to main POS if needed */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <p className="text-center text-[10px] text-slate-400 font-bold mb-4 italic flex items-center justify-center gap-2">
            <Icon name="verified" className="text-primary text-xs" />
            Orders are automatically synced with your branch inventory.
          </p>
      </div>
    </div>
  );
};
