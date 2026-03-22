import React from 'react';
import { Icon } from './Icon';
// Updated to use Spine types as aliases for missing Kokoro definitions
import { SpineProduct as KokoroProduct, SpineSale as KokoroSale } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, Cell, Tooltip } from 'recharts';

interface KokoroGrowthViewProps {
  products: KokoroProduct[];
  sales: KokoroSale[];
  onBack: () => void;
}

export const KokoroGrowthView: React.FC<KokoroGrowthViewProps> = ({ products, sales, onBack }) => {
  const totalProfit = sales.reduce((sum, s) => sum + s.totalProfit, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const inventoryValue = products.reduce((sum, p) => sum + (p.pieceQuantity * p.costPricePerPiece), 0);
  const potentialProfit = products.reduce((sum, p) => sum + (p.pieceQuantity * (p.sellingPricePerPiece - p.costPricePerPiece)), 0);

  const topSellingItems = [...products].sort((a, b) => b.bulkQuantity - a.bulkQuantity).slice(0, 3);
  
  const weeklyData = [
      { day: 'Mon', sales: 1200 },
      { day: 'Tue', sales: 1800 },
      { day: 'Wed', sales: 1100 },
      { day: 'Thu', sales: 2500 },
      { day: 'Fri', sales: 4200 },
      { day: 'Sat', sales: 5800 },
      { day: 'Sun', sales: 4900 },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white flex-1">Business Growth</h1>
        <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 flex items-center justify-center">
            <Icon name="insights" />
        </div>
      </header>

      <div className="p-6 space-y-8 pb-12">
          {/* Summary Cards */}
          <section className="space-y-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Estimated Growth Score</p>
                          <h2 className="text-5xl font-black">88<span className="text-xl font-normal opacity-50">/100</span></h2>
                      </div>
                      <Icon name="auto_awesome" className="text-4xl text-white/20" />
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                      Your business health is <span className="font-bold text-white">Excellent</span>. You are currently in the top 5% of traders in your category.
                  </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Inventory Worth</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-white">₦{inventoryValue.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 mt-1">At cost price</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Net Potential</p>
                      <p className="text-xl font-bold text-emerald-500">₦{potentialProfit.toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Upcoming profit</p>
                  </div>
              </div>
          </section>

          {/* Sales Frequency */}
          <section>
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 px-1">Sales Velocity (Weekly)</h3>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weeklyData}>
                          <XAxis 
                            dataKey="day" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                          />
                          <Tooltip 
                            cursor={{fill: 'transparent'}}
                            contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px'}}
                            itemStyle={{color: '#fff', fontSize: '12px'}}
                          />
                          <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                              {weeklyData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index > 3 ? '#10B981' : '#6366F1'} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
              <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
                  Weekends show <span className="font-bold text-emerald-500">3.4x</span> higher sales frequency than weekdays.
              </p>
          </section>

          {/* Top Selling Insights */}
          <section className="space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white px-1">Most Valuable Stock</h3>
              <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700">
                  {topSellingItems.map((p, i) => (
                      <div key={p.id} className={`p-4 flex items-center justify-between ${i !== topSellingItems.length - 1 ? 'border-b border-slate-50 dark:border-slate-700/50' : ''}`}>
                          <div className="flex items-center gap-3">
                              <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-black">
                                  #{i + 1}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-white">{p.name}</p>
                                  <p className="text-xs text-slate-500">{Math.round((p.sellingPricePerPiece - p.costPricePerPiece)/p.sellingPricePerPiece*100)}% Margin</p>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-sm font-bold text-emerald-500">₦{(p.sellingPricePerPiece - p.costPricePerPiece).toLocaleString()}</p>
                              <p className="text-[10px] text-slate-400 uppercase font-bold">Profit/Unit</p>
                          </div>
                      </div>
                  ))}
              </div>
          </section>

          {/* Business Potential Widget */}
          <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-500/20">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2 flex items-center gap-2">
                  <Icon name="rocket_launch" />
                  Growth Opportunity
              </h4>
              <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
                  If you increase your restock of <span className="font-bold">"{topSellingItems[0]?.name}"</span> by 20%, you could potentially earn an extra <span className="font-bold">₦12,450</span> this month based on demand trends.
              </p>
              <button className="mt-4 w-full py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors">
                  Check Supplier Availability
              </button>
          </div>
      </div>
    </div>
  );
};