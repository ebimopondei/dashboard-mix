
import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { Icon } from './Icon';
import { UserProfile } from '../types';

interface PortfolioAnalyticsViewProps {
  onBack: () => void;
  userProfile: UserProfile;
}

const CATEGORY_COLORS: { [key: string]: string } = {
  'Agriculture': '#10B981', // Emerald
  'Technology': '#3B82F6', // Blue
  'Manufacturing': '#F59E0B', // Amber
  'Real Estate': '#6366F1', // Indigo
  'Stocks': '#0EA5E9', // Sky
  'Bonds': '#8B5CF6', // Violet
  'Electronics': '#64748B', // Slate
  'Retail': '#EC4899', // Pink
  'Others': '#94A3B8', // Slate
};

export const PortfolioAnalyticsView: React.FC<PortfolioAnalyticsViewProps> = ({ onBack, userProfile }) => {
  const { investments } = userProfile;

  // Calculate Asset Allocation Data dynamically
  const allocationData = useMemo(() => {
    if (!investments || investments.length === 0) return [];

    const categories: { [key: string]: number } = {};
    let totalValue = 0;

    investments.forEach(inv => {
      const value = inv.investedAmount + inv.currentReturn;
      const cat = inv.category || 'Others';
      categories[cat] = (categories[cat] || 0) + value;
      totalValue += value;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Math.round((value / totalValue) * 100),
      absolute: value,
      color: CATEGORY_COLORS[name] || CATEGORY_COLORS['Others']
    })).sort((a, b) => b.value - a.value);
  }, [investments]);

  // Find next payout date
  const nextPayout = useMemo(() => {
    if (!investments || investments.length === 0) return null;
    const sorted = [...investments]
      .filter(i => i.payoutDate)
      .sort((a, b) => {
        return new Date(a.payoutDate!).getTime() - new Date(b.payoutDate!).getTime();
      });
    return sorted[0];
  }, [investments]);

  const statements = [
    { id: 1, month: 'September 2023', size: '1.2 MB' },
    { id: 2, month: 'August 2023', size: '1.1 MB' },
    { id: 3, month: 'July 2023', size: '1.4 MB' },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header - More compact */}
      <header className="flex items-center gap-4 px-4 py-3 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-30 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="size-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-xl" />
        </button>
        <h1 className="text-base font-black text-slate-800 dark:text-white truncate flex-1 text-center">
          Portfolio Insights
        </h1>
        <button className="size-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="share" className="text-lg" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 space-y-4 pt-4 pb-12">
        
        {/* KPI Grid - Compact Horizontal Cards */}
        <section className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-900 dark:bg-slate-900 border border-white/5 shadow-xl">
            <div className="flex items-center gap-2 mb-1.5 opacity-60">
              <Icon name="trending_up" className="text-xs text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white">Growth</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-xl font-black text-white">12.4%</p>
              <p className="text-[8px] text-emerald-400 font-bold">+2.1%</p>
            </div>
          </div>
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center gap-2 mb-1.5 opacity-60">
              <Icon name="event" className="text-xs text-blue-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Next Payout</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-white truncate">
                {nextPayout ? nextPayout.payoutDate?.split(',')[0] : 'N/A'}
            </p>
          </div>
        </section>

        {/* Asset Allocation - Fluid Chart and Grid Legend */}
        <section className="bg-white dark:bg-slate-800/40 rounded-[2.5rem] p-5 border border-slate-100 dark:border-slate-700/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Asset Allocation</h3>
            <span className="text-[9px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-0.5 rounded-full">{investments.length} Assets</span>
          </div>
          
          {allocationData.length > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-center h-[180px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={75}
                        paddingAngle={3}
                        dataKey="value"
                        stroke="none"
                        animationBegin={100}
                        animationDuration={1000}
                        >
                        {allocationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                        </Pie>
                        <Tooltip 
                        formatter={(value: number) => `${value}%`}
                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#fff' }}
                        />
                    </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-60">Total Value</span>
                        <span className="text-xl font-black text-slate-800 dark:text-white">
                            ₦{(userProfile.totalInvested + userProfile.totalEarnings).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pb-2">
                    {allocationData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 p-2 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-slate-100/50 dark:border-white/5">
                        <div className="size-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                        <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                                <span className="text-[9px] font-black text-slate-400">{item.value}%</span>
                            </div>
                            <p className="text-[9px] font-bold text-slate-400 truncate tracking-tighter">₦{item.absolute.toLocaleString()}</p>
                        </div>
                    </div>
                    ))}
                </div>
              </div>
          ) : (
              <div className="py-12 text-center">
                  <Icon name="donut_large" className="text-4xl text-slate-200 dark:text-slate-700 mb-3" />
                  <p className="text-xs font-bold text-slate-500">No assets detected</p>
              </div>
          )}
        </section>

        {/* Monthly Performance Mini Widget */}
        <section className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden">
            <Icon name="show_chart" className="absolute -right-4 -bottom-4 text-8xl opacity-20" />
            <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-100 mb-1">Portfolio Velocity</p>
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black">Trending Upwards</h3>
                    <div className="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-bold">+4.2% MoM</div>
                </div>
            </div>
        </section>

        {/* Statements - Compact List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Statements</h3>
            <button className="text-[10px] font-black text-primary uppercase">View Archive</button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {statements.map((statement) => (
              <div key={statement.id} className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-[0.99] group">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <Icon name="article" className="text-lg" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800 dark:text-white leading-none">{statement.month}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1.5">E-Receipt • {statement.size}</p>
                  </div>
                </div>
                <button className="size-8 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 group-hover:bg-primary transition-colors group-hover:text-white text-slate-400 shadow-inner">
                  <Icon name="download" className="text-base" />
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
