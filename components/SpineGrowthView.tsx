
import React, { useState } from 'react';
import { Icon } from './Icon';
import { SpineProduct, SpineSale, ViewType, SpineShop } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, Cell, Tooltip } from 'recharts';

interface SpineGrowthViewProps {
  products: SpineProduct[];
  sales: SpineSale[];
  shop: SpineShop;
  onBack: () => void;
  onNavigate?: (view: ViewType) => void;
  onToggleSlash?: () => void;
}

export const SpineGrowthView: React.FC<SpineGrowthViewProps> = ({ products, sales, shop, onBack, onNavigate, onToggleSlash }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const businessScore = 84;
  const inventoryValue = products.reduce((sum, p) => sum + (p.pieceQuantity * p.costPricePerPiece), 0);
  const potentialProfit = products.reduce((sum, p) => sum + (p.pieceQuantity * (p.sellingPricePerPiece - p.costPricePerPiece)), 0);

  const scoreFactors = [
    { label: 'Repayment', value: 95, icon: 'history_edu', color: 'bg-emerald-500' },
    { label: 'Inventory', value: 72, icon: 'inventory_2', color: 'bg-blue-500' },
    { label: 'Sales Vol.', value: 86, icon: 'trending_up', color: 'bg-purple-500' },
  ];

  const weeklyData = [
      { day: 'Mon', sales: 1200 },
      { day: 'Tue', sales: 1800 },
      { day: 'Wed', sales: 1100 },
      { day: 'Thu', sales: 2500 },
      { day: 'Fri', sales: 4200 },
      { day: 'Sat', sales: 5800 },
      { day: 'Sun', sales: 4900 },
  ];

  const handleAskCoach = () => {
    setIsAiLoading(true);
    setTimeout(() => {
        setAiInsight("Your business health is excellent! Your high repayment score (95/100) makes you eligible for a 'Restock Loan' upgrade. However, your inventory score is slightly lower (72/100) due to 5 items being out of stock for over a week. Increasing your parboiled rice stock by 15% before next market day could yield an extra ₦8,400 profit.");
        setIsAiLoading(false);
    }, 2000);
  };

  const isSlashActive = shop.isPublicOnSlash;

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white flex-1">Business Growth</h1>
        <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center">
            <Icon name="monitoring" />
        </div>
      </header>

      <div className="p-6 space-y-6 pb-24">
          
          {/* Minimized & Stacked Business Health Card */}
          <section className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden border border-white/5 flex items-center gap-5">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent pointer-events-none" />
              
              <div className="relative z-10 shrink-0">
                  <div className="relative size-16 flex items-center justify-center">
                      <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse"></div>
                      <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                          <circle className="text-white/5" strokeWidth="12" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                          <circle 
                              className="text-purple-500 transition-all duration-1000 ease-out" 
                              strokeWidth="12" 
                              strokeDasharray="251.3" 
                              strokeDashoffset={251.3 * (1 - businessScore/100)}
                              strokeLinecap="round" 
                              stroke="currentColor" 
                              fill="transparent" 
                              r="40" 
                              cx="50" 
                              cy="50" 
                          />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-black text-white">{businessScore}</span>
                      </div>
                  </div>
              </div>

              <div className="relative z-10 flex-1 min-w-0">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Health Grade</p>
                  <h3 className="text-base font-black text-white truncate leading-none mb-3">Excellent Standing</h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                      {scoreFactors.map(factor => (
                          <div key={factor.label} className="flex items-center gap-1.5">
                              <div className={`size-1.5 rounded-full ${factor.color}`} />
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{factor.label} {factor.value}%</span>
                          </div>
                      ))}
                  </div>
              </div>
          </section>

          {/* Performance Overview Grid */}
          <section className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 group active:scale-[0.98] transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Inventory Worth</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white">₦{inventoryValue.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-slate-500 mt-1">Asset value at cost</p>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 group active:scale-[0.98] transition-all">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest text-emerald-500">Net Potential</p>
                  <p className="text-xl font-black text-emerald-500">₦{potentialProfit.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-slate-500 mt-1">Est. gross profit</p>
              </div>
          </section>

          {/* Slash E-commerce Storefront Section */}
          <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-lg">
                          <Icon name="bolt" className="text-2xl" />
                      </div>
                      <div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">Slash Storefront</h3>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global E-commerce</p>
                      </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                      <button 
                        onClick={onToggleSlash}
                        className={`w-14 h-7 rounded-full transition-all relative ${isSlashActive ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                      >
                          <div className={`absolute top-1 size-5 bg-white rounded-full transition-all shadow-md ${isSlashActive ? 'right-1' : 'left-1'}`} />
                      </button>
                      <span className={`text-[8px] font-black uppercase tracking-tighter ${isSlashActive ? 'text-primary' : 'text-slate-400'}`}>
                          {isSlashActive ? 'Live on Web' : 'Offline'}
                      </span>
                  </div>
              </div>

              {!isSlashActive ? (
                  <div className="space-y-4 animate-in fade-in duration-500">
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Reach thousands of customers online. Toggle your inventory to <span className="font-bold text-slate-900 dark:text-white underline decoration-primary decoration-2 underline-offset-4">Public</span> to auto-generate your web store.
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                              <Icon name="public" className="text-slate-400 mb-1" />
                              <p className="text-[8px] font-bold text-slate-500 uppercase">Global</p>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                              <Icon name="local_shipping" className="text-slate-400 mb-1" />
                              <p className="text-[8px] font-bold text-slate-500 uppercase">Delivery</p>
                          </div>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                              <Icon name="payments" className="text-slate-400 mb-1" />
                              <p className="text-[8px] font-bold text-slate-500 uppercase">Auto-Pay</p>
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="space-y-5 animate-in slide-in-from-bottom duration-500">
                      <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
                          <div className="flex items-center gap-3">
                              <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                                  <Icon name="notifications_active" className="text-sm animate-tada" />
                              </div>
                              <div>
                                  <p className="text-xs font-black text-emerald-900 dark:text-emerald-100">3 Online Orders</p>
                                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300">Pending fulfillment</p>
                              </div>
                          </div>
                          <button 
                            onClick={() => onNavigate && onNavigate(ViewType.SPINE_SLASH_ORDERS)}
                            className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 underline underline-offset-4"
                          >
                            Manage
                          </button>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                              <Icon name="link" className="text-slate-400 shrink-0" />
                              <p className="text-xs font-mono font-bold text-slate-500 truncate">slash.trade/{shop.name?.toLowerCase().replace(/\s+/g, '-') || 'my-shop'}</p>
                          </div>
                          <Icon name="content_copy" className="text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 italic">
                          <Icon name="check_circle" className="text-emerald-500 text-xs" />
                          Your entire Spine inventory is now sync'd with Slash E-commerce.
                      </div>
                  </div>
              )}
          </section>

          {/* AI Insights Panel */}
          <section className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Icon name="psychology" className="text-9xl" />
              </div>
              <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                      <div className="size-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                          <Icon name="auto_awesome" />
                      </div>
                      <h3 className="font-black uppercase tracking-widest text-sm">Growth Advisor</h3>
                  </div>

                  {!aiInsight ? (
                      <div className="space-y-4">
                        <p className="text-xs text-indigo-100 leading-relaxed">I've analyzed your branch data. Ready for your weekly strategy report?</p>
                        <button 
                            onClick={handleAskCoach}
                            disabled={isAiLoading}
                            className="w-full py-4 bg-white text-indigo-900 font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg"
                        >
                            {isAiLoading ? (
                                <span className="size-4 border-2 border-indigo-900/30 border-t-indigo-900 rounded-full animate-spin" />
                            ) : (
                                <>Get Strategy Insight</>
                            )}
                        </button>
                      </div>
                  ) : (
                      <div className="animate-in fade-in zoom-in-95 duration-500">
                          <p className="text-sm text-white leading-relaxed font-bold border-l-2 border-white/40 pl-4 mb-4">
                              "{aiInsight}"
                          </p>
                          <button 
                            onClick={() => setAiInsight(null)}
                            className="text-[9px] font-black text-white/50 hover:text-white uppercase tracking-widest"
                          >
                              Got it, thanks!
                          </button>
                      </div>
                  )}
              </div>
          </section>

          {/* Sales Velocity Chart */}
          <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-black text-slate-800 dark:text-white text-[10px] uppercase tracking-[0.25em]">Weekly Velocity</h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Last 7 Days</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                          <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 800}} 
                          />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                            itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                          />
                          <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                              {weeklyData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index > 3 ? '#10B981' : '#6366F1'} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-center text-slate-500 mt-4 leading-relaxed italic">
                Performance is <span className="text-emerald-500 font-bold">up 12.4%</span> compared to previous week.
              </p>
          </section>

          {/* Action Footer */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
              <h4 className="font-black text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest">
                  <Icon name="rocket_launch" className="text-sm" />
                  Financial Leverage
              </h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed mb-4">
                  Based on your current score, you are eligible for an instant <b>₦20,000 credit limit increase</b>.
              </p>
              <button 
                onClick={() => onNavigate && onNavigate(ViewType.TRADER_LOAN_APPLY)}
                className="w-full py-4 bg-emerald-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.95] transition-transform"
              >
                  Claim Credit Increase
              </button>
          </div>
      </div>
    </div>
  );
};
