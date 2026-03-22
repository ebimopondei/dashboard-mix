
import React, { useMemo, useState } from 'react';
import { Icon } from './Icon';
import { ViewType, SpineProduct, SpineSale, SpineShop } from '../types';

interface SpineDashboardViewProps {
  onNavigate: (view: ViewType, id?: string) => void;
  products: SpineProduct[];
  sales: SpineSale[];
  shop: SpineShop;
  activeOutletId: string;
  onSwitchOutlet: (id: string) => void;
}

export const SpineDashboardView: React.FC<SpineDashboardViewProps> = ({ 
    onNavigate, 
    products, 
    sales, 
    shop, 
    activeOutletId, 
    onSwitchOutlet 
}) => {
  const [showOutletMenu, setShowOutletMenu] = useState(false);
  
  if (!shop) return null;

  const activeOutlet = shop.outlets?.find(o => o.id === activeOutletId) || shop.outlets?.[0];

  const filteredSales = useMemo(() => 
    sales.filter(s => s.outletId === activeOutletId && (s.timestamp.toLowerCase().includes('today') || s.timestamp.toLowerCase().includes('now'))), 
    [sales, activeOutletId]
  );

  const hasData = products.length > 0;

  // Big Header: Total Revenue recorded today (Accrual basis)
  const todayRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const todayProfit = filteredSales.reduce((sum, s) => sum + s.totalProfit, 0);
  const todayCollectedFromSales = filteredSales.reduce((sum, s) => sum + (s.totalAmount - s.balanceDue), 0);
  const todayPendingReceivables = filteredSales.reduce((sum, s) => sum + s.balanceDue, 0);
  const physicalCashInflow = filteredSales.reduce((sum, s) => sum + (s.totalAmount - s.balanceDue), 0);
  const totalOwedByAll = shop.customers?.reduce((sum, c) => sum + c.totalOwed, 0) || 0;

  const alerts = useMemo(() => {
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(now.getDate() + 30);

      const outOfStock = products.filter(p => {
          const bal = p.stockBalances.find(b => b.outletId === activeOutletId);
          return !bal || (bal.bulkQuantity * p.unitsPerBulk + bal.pieceQuantity) === 0;
      });
      
      const lowStock = products.filter(p => {
          const bal = p.stockBalances.find(b => b.outletId === activeOutletId);
          if (!bal) return false;
          const totalPieces = (bal.bulkQuantity * p.unitsPerBulk + bal.pieceQuantity);
          return totalPieces > 0 && totalPieces < 15;
      });

      const expiringSoon = products.filter(p => {
          return p.batches?.some(b => {
              if (!b.expiryDate) return false;
              const exp = new Date(b.expiryDate);
              return exp > now && exp <= thirtyDaysFromNow && (b.bulkQuantity > 0 || b.pieceQuantity > 0);
          });
      });

      const criticalExpiries = products.filter(p => {
          return p.batches?.some(b => {
              if (!b.expiryDate) return false;
              const exp = new Date(b.expiryDate);
              return exp > now && exp <= sevenDaysFromNow && (b.bulkQuantity > 0 || b.pieceQuantity > 0);
          });
      });

      return { outOfStock, lowStock, expiringSoon, criticalExpiries };
  }, [products, activeOutletId]);

  if (!hasData) {
      return (
          <div className="flex flex-col gap-8 animate-in fade-in duration-700 pb-24 px-1">
              {/* Welcome Header */}
              <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Ready</p>
                  <h2 className="text-4xl font-black tracking-tighter text-slate-800 dark:text-white leading-none">Welcome to Spine.</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">Your business data vault is currently empty.</p>
              </div>

              {/* Onboarding Steps */}
              <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Get Started Guide</h3>
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">Step 1/2</span>
                  </div>

                  {/* Step 1: Add Stock */}
                  <div 
                    onClick={() => onNavigate(ViewType.SPINE_ADD_PRODUCT)}
                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
                  >
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Icon name="add_shopping_cart" className="text-[10rem]" /></div>
                      <div className="relative z-10 space-y-4">
                          <div className="size-16 rounded-3xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                              <Icon name="inventory_2" className="text-4xl" />
                          </div>
                          <div>
                              <h4 className="text-xl font-black text-slate-800 dark:text-white">Add Your First Product</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-1">Record what you sell, its cost, and price. We'll help you track every piece and bulk unit.</p>
                          </div>
                          <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                              <span>Begin Inventory Setup</span>
                              <Icon name="arrow_forward" className="text-sm" />
                          </div>
                      </div>
                  </div>

                  {/* Step 2: Record Sale (Disabled until step 1) */}
                  <div className="bg-slate-100 dark:bg-slate-900/40 rounded-[2.5rem] p-8 border border-dashed border-slate-300 dark:border-slate-800 opacity-60">
                      <div className="space-y-4">
                          <div className="size-14 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                              <Icon name="shopping_basket" className="text-3xl" />
                          </div>
                          <div>
                              <h4 className="text-lg font-black text-slate-400">Record a Sale</h4>
                              <p className="text-xs text-slate-500">Available after adding stock</p>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Value Proposition Cards */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-500/5 p-5 rounded-3xl border border-blue-100 dark:border-blue-500/10">
                      <Icon name="verified_user" className="text-blue-500 mb-2" />
                      <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter mb-1">Credit Score</p>
                      <p className="text-[10px] text-slate-500 leading-tight">Accurate records boost your loan eligibility by up to 40%.</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-500/5 p-5 rounded-3xl border border-amber-100 dark:border-amber-500/10">
                      <Icon name="psychology" className="text-amber-500 mb-2" />
                      <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-tighter mb-1">AI Insights</p>
                      <p className="text-[10px] text-slate-500 leading-tight">Spine learns your trade patterns to suggest the best time to restock.</p>
                  </div>
              </div>

              {/* Quick Navigation Footer */}
              <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => onNavigate(ViewType.SPINE_MANAGEMENT)}
                    className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-primary transition-colors flex items-center gap-2"
                  >
                      <Icon name="settings" className="text-sm" />
                      Branch Settings
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      {/* Branch & Management Header */}
      <div className="flex items-center justify-between px-1">
          <div className="relative">
              <button 
                onClick={() => setShowOutletMenu(!showOutletMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm transition-all active:scale-95"
              >
                  <Icon name="location_on" className="text-primary text-sm" />
                  <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">{activeOutlet?.name}</span>
                  <Icon name="expand_more" className="text-slate-400 text-sm" />
              </button>
              
              {showOutletMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowOutletMenu(false)} />
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in slide-in-from-top-2">
                        {shop.outlets?.map(o => (
                            <button 
                                key={o.id}
                                onClick={() => { onSwitchOutlet(o.id); setShowOutletMenu(false); }}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${o.id === activeOutletId ? 'bg-primary/5' : ''}`}
                            >
                                <div>
                                    <p className={`text-xs font-bold ${o.id === activeOutletId ? 'text-primary' : 'text-slate-800 dark:text-white'}`}>{o.name}</p>
                                    <p className="text-[10px] text-slate-400 truncate">{o.address}</p>
                                </div>
                                {o.id === activeOutletId && <Icon name="check" className="text-primary text-sm" />}
                            </button>
                        ))}
                    </div>
                  </>
              )}
          </div>

          <div className="flex items-center gap-2">
              <button 
                onClick={() => onNavigate(ViewType.SPINE_DEBT_CENTER)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border transition-all ${totalOwedByAll > 0 ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500'}`}
              >
                  <Icon name="receipt_long" className="text-sm" />
                  <span className="text-[10px] font-black uppercase tracking-widest">₦{totalOwedByAll.toLocaleString()}</span>
              </button>
              
              <button 
                onClick={() => onNavigate(ViewType.SPINE_CAMERAS)}
                className="size-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors shadow-sm active:scale-90"
                title="Vision"
              >
                  <Icon name="videocam" className="text-lg" />
              </button>

              <button 
                onClick={() => onNavigate(ViewType.SPINE_MANAGEMENT)}
                className="size-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary transition-colors shadow-sm active:scale-90"
                title="Shop Settings"
              >
                  <Icon name="settings" className="text-lg" />
              </button>
          </div>
      </div>

      {/* Main Accrual Financial Card */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl border border-white/5">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Icon name="monitoring" className="text-9xl" />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-1">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">Today's Activity (Net Revenue)</p>
            <button onClick={() => onNavigate(ViewType.SPINE_ACTIVITIES)} className="size-8 rounded-full bg-white/10 flex items-center justify-center text-white active:scale-90"><Icon name="history" className="text-sm" /></button>
          </div>
          <h2 className="text-4xl font-black mb-1">₦{todayRevenue.toLocaleString()}</h2>
          
          <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-1.5" title="Amount paid from today's sales">
                  <div className="size-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[10px] text-emerald-400 font-black uppercase">₦{todayCollectedFromSales.toLocaleString()} Realized</p>
              </div>
              <div className="flex items-center gap-1.5" title="Amount pending from today's sales">
                  <div className="size-1.5 rounded-full bg-rose-400" />
                  <p className="text-[10px] text-rose-400 font-black uppercase">₦{todayPendingReceivables.toLocaleString()} Pending</p>
              </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-tighter">Est. Profit</p>
              <p className="text-2xl font-black text-emerald-400 leading-tight">₦{todayProfit.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10">
              <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-tighter">Physical Inflow</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black leading-tight text-blue-400">₦{physicalCashInflow.toLocaleString()}</p>
              </div>
              <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">Total Cash Rec'd</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Hub */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate(ViewType.SPINE_POS)} className="flex flex-col items-center justify-center p-6 bg-primary rounded-3xl text-white shadow-lg shadow-primary/20 active:scale-[0.98] transition-all hover:brightness-105">
          <div className="size-14 rounded-full bg-white/20 flex items-center justify-center mb-3"><Icon name="shopping_basket" className="text-3xl" /></div>
          <span className="font-bold text-lg">Sell Item</span>
        </button>
        <button onClick={() => onNavigate(ViewType.SPINE_ADD_STOCK)} className="flex flex-col items-center justify-center p-6 bg-blue-600 rounded-3xl text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all hover:brightness-105">
          <div className="size-14 rounded-full bg-white/20 flex items-center justify-center mb-3"><Icon name="add_shopping_cart" className="text-3xl" /></div>
          <span className="font-bold text-lg">Add Stock</span>
        </button>
      </div>

      {/* Navigation Grid - 2x2 Layout */}
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => onNavigate(ViewType.SPINE_INVENTORY)} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors">
          <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-inner"><Icon name="inventory_2" /></div>
          <span className="font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">Inventory</span>
        </button>
        <button onClick={() => onNavigate(ViewType.SPINE_SALES_HISTORY)} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors">
          <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-inner"><Icon name="receipt" /></div>
          <span className="font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">Sales Log</span>
        </button>
        <button onClick={() => onNavigate(ViewType.SPINE_CALCULATOR)} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors">
          <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-yellow-500 shadow-inner"><Icon name="calculate" /></div>
          <span className="font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">Calc</span>
        </button>
        <button onClick={() => onNavigate(ViewType.SPINE_GROWTH)} className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-colors">
          <div className="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-purple-500 shadow-inner"><Icon name="trending_up" /></div>
          <span className="font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">Growth</span>
        </button>
      </div>

      {/* Stock Alerts Section */}
      {(alerts.outOfStock.length > 0 || alerts.lowStock.length > 0 || alerts.expiringSoon.length > 0) && (
        <section className="animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-black text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
              <Icon name="warning" className="text-amber-500 text-sm" />
              Stock Alerts
            </h3>
            <span className="text-[10px] font-black text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                {alerts.outOfStock.length + alerts.lowStock.length + alerts.expiringSoon.length} Issues
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {/* High Priority Critical Expiry Summary Card */}
            {alerts.criticalExpiries.length > 0 && (
                <div 
                    onClick={() => onNavigate(ViewType.SPINE_INVENTORY)}
                    className="bg-rose-600 rounded-2xl p-4 text-white shadow-lg shadow-rose-600/30 flex items-center justify-between group cursor-pointer animate-in zoom-in-95 duration-500 relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="size-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                            <Icon name="event_busy" className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-100">Critical Expiration Alert</h4>
                            <p className="text-sm font-black">{alerts.criticalExpiries.length} items expire within 7 days!</p>
                        </div>
                    </div>
                    <Icon name="chevron_right" className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </div>
            )}

            {/* Expiration Alerts */}
            {alerts.expiringSoon.map(item => {
                const now = new Date();
                const criticalDate = new Date();
                criticalDate.setDate(now.getDate() + 7);
                const isCritical = item.batches?.some(b => b.expiryDate && new Date(b.expiryDate) <= criticalDate);

                return (
                    <div key={`exp-${item.id}`} className={`p-4 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all ${isCritical ? 'border-l-rose-500' : 'border-l-orange-500'}`}>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</p>
                            <p className={`text-[10px] font-black uppercase tracking-widest mt-0.5 flex items-center gap-1 ${isCritical ? 'text-rose-500' : 'text-orange-500'}`}>
                                <Icon name="event_busy" className="text-[10px]" />
                                {isCritical ? 'CRITICAL EXPIRY' : 'Batch Expiring Soon'}
                            </p>
                        </div>
                        <button 
                            onClick={() => onNavigate(ViewType.SPINE_PRODUCT_DETAIL, item.id)}
                            className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl ${isCritical ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' : 'bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}
                        >
                            Review
                        </button>
                    </div>
                );
            })}

            {alerts.outOfStock.map(item => (
              <div key={item.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-l-rose-500 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</p>
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-0.5">Sold Out</p>
                </div>
                <button 
                  onClick={() => onNavigate(ViewType.SPINE_ADD_STOCK, item.id)}
                  className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-sm"
                >
                  Restock
                </button>
              </div>
            ))}
            {alerts.lowStock.map(item => (
              <div key={item.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-l-amber-500 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between active:scale-[0.98] transition-all">
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">{item.name}</p>
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-0.5">Low: {item.pieceQuantity} {item.pieceUnitName}s</p>
                </div>
                <button 
                  onClick={() => onNavigate(ViewType.SPINE_ADD_STOCK, item.id)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Business Memory Tip */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
        <Icon name="psychology" className="absolute -right-4 -bottom-4 text-8xl opacity-10" />
        <div className="relative z-10">
            <h4 className="font-black text-[10px] uppercase tracking-[0.25em] text-purple-100 mb-3 flex items-center gap-2">
                <Icon name="auto_awesome" className="text-sm" />
                Spine Intelligence
            </h4>
            <p className="text-sm font-bold leading-relaxed">
                "Classic Ankara" has a 4.2x faster turnover on Market Days. Increase your restock by 15% this Thursday to capture ₦2,400 in extra profit."
            </p>
            <button className="mt-4 text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
                View Full Analysis
            </button>
        </div>
      </div>
    </div>
  );
};
