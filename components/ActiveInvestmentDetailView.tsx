
import React, { useState, useMemo } from 'react';
import { Investment, RealEstateProperty, StockBond, StartupPitch } from '../types';
import { Icon } from './Icon';
import { REAL_ESTATE, STOCKS_BONDS, STARTUPS } from '../constants';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface ActiveInvestmentDetailViewProps {
  investment: Investment;
  onBack: () => void;
}

const MOCK_PERF_DATA = [
    { day: 'M', value: 140 },
    { day: 'T', value: 142 },
    { day: 'W', value: 141 },
    { day: 'T', value: 144 },
    { day: 'F', value: 143 },
    { day: 'S', value: 145 },
    { day: 'S', value: 146 },
];

export const ActiveInvestmentDetailView: React.FC<ActiveInvestmentDetailViewProps> = ({ investment, onBack }) => {
  const [rolloverOption, setRolloverOption] = useState<'payout' | 'principal' | 'all'>('payout');
  const isRealEstate = investment.category === 'Real Estate';
  const isStock = investment.category === 'Stocks' || investment.category === 'Bonds';
  const isStartup = investment.category === 'Startups';
  
  const property = useMemo(() => 
    isRealEstate ? REAL_ESTATE.find(p => p.id === investment.propertyId) : null
  , [isRealEstate, investment.propertyId]);

  const stock = useMemo(() => 
    isStock ? STOCKS_BONDS.find(s => s.ticker === investment.ticker) : null
  , [isStock, investment.ticker]);

  const startup = useMemo(() => 
    isStartup ? STARTUPS.find(s => s.name === investment.name) : null
  , [isStartup, investment.name]);

  if (isRealEstate && property) {
      return (
        <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-30 border-b border-slate-200 dark:border-slate-800">
                <button 
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                <Icon name="arrow_back" className="text-2xl" />
                </button>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1 text-center pr-8">
                Property Portfolio
                </h1>
            </header>

            <div className="flex-1 overflow-y-auto pb-20">
                {/* Hero / Asset Summary */}
                <div className="h-64 relative shrink-0 overflow-hidden">
                    <img src={property.imageUrl} alt={property.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex gap-2 mb-2">
                             <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md bg-indigo-600/60 border border-white/20">
                                {investment.purchaseType || 'Asset'}
                             </span>
                             <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md bg-emerald-600/60 border border-white/20">
                                Registered Deed
                             </span>
                        </div>
                        <h2 className="text-2xl font-black text-white">{property.name}</h2>
                        <p className="text-slate-300 text-xs font-bold flex items-center gap-1 text-white/80">
                            <Icon name="location_on" className="text-xs" />
                            {property.location}, {property.country}
                        </p>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Financial Breakdown */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Equity Held</p>
                            <p className="text-xl font-black text-slate-800 dark:text-white">₦{investment.investedAmount.toLocaleString()}</p>
                            <p className="text-[9px] text-slate-500 mt-1 font-bold">Acquisition Value</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Total Yields</p>
                            <p className="text-xl font-black text-emerald-500">₦{investment.currentReturn.toLocaleString()}</p>
                            <p className="text-[9px] text-slate-500 mt-1 font-bold">Lifetime Earned</p>
                        </div>
                    </div>

                    {/* Management & Status */}
                    <div className="bg-slate-900 rounded-[2rem] p-6 text-white border border-white/5 shadow-xl relative overflow-hidden">
                        <Icon name="corporate_fare" className="absolute -right-4 -bottom-4 text-9xl opacity-10" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                        <Icon name="manage_accounts" className="text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Property Manager</p>
                                        <p className="text-sm font-bold">{investment.managementType || 'Mix Afrika'}</p>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black uppercase px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg tracking-tighter">Verified Active</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <Icon name="pie_chart" className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Yield Frequency</p>
                                    <p className="text-sm font-bold">Quarterly (Next: Dec 15)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ownership Token Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                         <div className="flex items-center justify-between">
                            <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 dark:text-white">Digital Twin (NFT)</h3>
                            <button className="text-[10px] font-black text-primary uppercase underline">Scan Contract</button>
                         </div>
                         <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between group cursor-pointer active:scale-95 transition-transform">
                             <div className="flex items-center gap-3 overflow-hidden">
                                 <Icon name="token" className="text-indigo-500 shrink-0" />
                                 <p className="text-xs font-mono font-bold text-slate-500 truncate">{property.smartContractId}</p>
                             </div>
                             <Icon name="content_copy" className="text-slate-300 group-hover:text-primary transition-colors text-sm" />
                         </div>
                         <p className="text-[10px] text-slate-500 leading-relaxed italic">
                            This smart contract represents your legal claim to the property. It can be listed on the secondary market for instant liquidity.
                         </p>
                    </div>

                    {/* Action Hub */}
                    <div className="space-y-3">
                        <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <Icon name="sell" className="text-sm" />
                            List on Secondary Market
                        </button>
                        <button className="w-full py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform">
                            View Historical Payouts
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  if (isStock && stock) {
      return (
          <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
            <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-30 border-b border-slate-200 dark:border-slate-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                    <Icon name="arrow_back" className="text-2xl" />
                </button>
                <div className="flex-1 text-center pr-8">
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate">{investment.name}</h1>
                    <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{stock.ticker} • {stock.country}</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">
                {/* Position Summary */}
                <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Icon name="show_chart" className="text-[10rem]" /></div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1">Current Portfolio Value</p>
                        <h2 className="text-5xl font-black mb-1 leading-tight tracking-tighter">₦{(investment.investedAmount + investment.currentReturn).toLocaleString()}</h2>
                        <div className="flex items-center gap-2 text-emerald-400 font-black mb-8">
                            <Icon name="trending_up" className="text-sm" />
                            <span className="text-sm">₦{investment.currentReturn.toLocaleString()} (+{(investment.currentReturn / investment.investedAmount * 100).toFixed(2)}%)</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                                <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Quantity</p>
                                <p className="text-xl font-black">{investment.units} Shares</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10">
                                <p className="text-[9px] text-slate-400 uppercase font-black mb-1">Avg Cost</p>
                                <p className="text-xl font-black">₦{(investment.investedAmount / (investment.units || 1)).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Performance Chart */}
                <section className="space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Holding Performance</h3>
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_PERF_DATA}>
                                <defs>
                                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                                <YAxis domain={['auto', 'auto']} hide />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff' }} />
                                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* Funding History for Stocks */}
                {investment.history && investment.history.length > 1 && (
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-2">Order History</h3>
                        <div className="bg-white dark:bg-slate-800/50 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-4">
                            {investment.history.map((h, i) => (
                                <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0">
                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-white">Bought {h.units} Units</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{h.date} via {h.method}</p>
                                    </div>
                                    <p className="text-sm font-black text-slate-800 dark:text-white">₦{h.amount.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Market Details */}
                <section className="space-y-4">
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Market Metadata</h3>
                    <div className="grid gap-3">
                        {[
                            { label: 'Security Type', value: stock.type, icon: 'shield' },
                            { label: 'Market Region', value: stock.country, icon: 'public' },
                            { label: 'Dividend Status', value: 'Active (Quarterly)', icon: 'payments' },
                            { label: 'Asset ID', value: `MIX-${stock.ticker}-001`, icon: 'fingerprint' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-50 dark:border-slate-700 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <Icon name={item.icon} className="text-slate-400 text-sm" />
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{item.label}</span>
                                </div>
                                <span className="text-sm font-black text-slate-800 dark:text-white">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Sell/Buy Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <Icon name="shopping_cart" className="text-sm" />
                        Buy More
                    </button>
                    <button className="py-4 bg-rose-500 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-rose-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        <Icon name="sell" className="text-sm" />
                        Sell Position
                    </button>
                </div>
            </div>
          </div>
      );
  }

  if (isStartup && startup) {
    return (
        <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-30 border-b border-slate-200 dark:border-slate-800">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
                    <Icon name="arrow_back" className="text-2xl" />
                </button>
                <div className="flex-1 text-center pr-8">
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate">{investment.name}</h1>
                    <p className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Equity Position</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
                {/* Hero Stats Card - Highly Informational & Compact */}
                <section className="bg-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl border border-white/5">
                    <div className="absolute -right-4 -top-4 opacity-10">
                        <Icon name="rocket_launch" className="text-[10rem] rotate-12" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">Portfolio Ownership</p>
                        <h2 className="text-5xl font-black text-emerald-400 tracking-tighter mb-8">{investment.equityOwned?.toFixed(4)}%</h2>
                        
                        <div className="w-full grid grid-cols-3 gap-2">
                            <div className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                                <p className="text-[8px] text-slate-500 uppercase font-black mb-1 tracking-tighter">Cost Basis</p>
                                <p className="text-sm font-black">₦{investment.investedAmount.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                                <p className="text-[8px] text-slate-500 uppercase font-black mb-1 tracking-tighter">Paper Multiple</p>
                                <p className="text-sm font-black text-emerald-400">1.24x</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3 text-center border border-white/5">
                                <p className="text-[8px] text-slate-500 uppercase font-black mb-1 tracking-tighter">Allocation</p>
                                <p className="text-sm font-black text-blue-400">Post-Seed</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Aggregate History Section for Startups */}
                {investment.history && investment.history.length > 1 && (
                    <section className="space-y-3">
                        <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-2">Funding History</h3>
                        <div className="bg-white dark:bg-slate-800/50 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-4">
                            {investment.history.map((h, i) => (
                                <div key={i} className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-700/50 last:border-0 last:pb-0">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-black text-slate-800 dark:text-white">Bought {h.equityOwned?.toFixed(4)}% Stake</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">{h.date} via {h.method}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-800 dark:text-white">₦{h.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Round Context Banner */}
                <div className="bg-white dark:bg-slate-800/50 rounded-[1.5rem] p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="size-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                            <Icon name="military_tech" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Venture Status</p>
                            <h4 className="font-black text-xs truncate">Series A Bridge</h4>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Company Value</p>
                        <h4 className="font-black text-xs text-slate-800 dark:text-white">₦150.4M</h4>
                    </div>
                </div>

                {/* Milestone Timeline - Compact Vertical */}
                <section className="space-y-3 pt-2">
                    <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] px-2">Venture Milestones</h3>
                    <div className="bg-white dark:bg-slate-800/50 rounded-[2rem] p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm space-y-5">
                        {[
                            { date: 'Dec 2023', label: 'Expansion to Kenya', status: 'In Operations', color: 'bg-blue-500' },
                            { date: 'Oct 2023', label: '50k Monthly Active Users', status: 'Verified Milestone', color: 'bg-emerald-500' },
                            { date: 'Jul 2023', label: 'Seed Round Closed', status: 'Completed', color: 'bg-emerald-500' },
                        ].map((m, i) => (
                            <div key={i} className="flex gap-4 relative">
                                {i !== 2 && <div className="absolute left-[7px] top-4 bottom-[-20px] w-0.5 bg-slate-100 dark:bg-slate-700" />}
                                <div className={`size-3.5 rounded-full ${m.color} ring-4 ring-white dark:ring-slate-800 z-10 shrink-0 mt-0.5`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className="text-xs font-black text-slate-800 dark:text-white truncate">{m.label}</p>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase shrink-0 ml-2">{m.date}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter opacity-80">{m.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Investor Relations Quick Actions */}
                <section className="space-y-3 pt-2">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Shareholder Portal</h3>
                        <span className="text-[9px] font-bold text-primary uppercase">Audit Grade A</span>
                    </div>
                    <div className="grid gap-2">
                        <button className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 group hover:border-primary/30 transition-all active:scale-[0.99]">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                    <Icon name="description" className="text-sm" />
                                </div>
                                <span className="text-xs font-bold">Shareholders Agreement</span>
                            </div>
                            <Icon name="download" className="text-slate-300 text-sm group-hover:text-primary" />
                        </button>
                        <button className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 group hover:border-primary/30 transition-all active:scale-[0.99]">
                            <div className="flex items-center gap-3">
                                <div className="size-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                                    <Icon name="mail" className="text-sm" />
                                </div>
                                <span className="text-xs font-bold">Nov '23 Board Memo</span>
                            </div>
                            <div className="flex items-center gap-1 text-primary">
                                <span className="text-[8px] font-black bg-primary text-white px-1.5 py-0.5 rounded-full uppercase tracking-tighter">New</span>
                                <Icon name="chevron_right" className="text-slate-300 text-sm" />
                            </div>
                        </button>
                    </div>
                </section>

                {/* Tactical Actions */}
                <div className="pt-4 space-y-3">
                    <button className="w-full py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-900 font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3 border border-white/5">
                        <Icon name="chat" className="text-base" />
                        Investor Relations Chat
                    </button>
                    <div className="p-4 bg-slate-100/50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Secondary Liquidity</p>
                        <p className="text-[10px] text-slate-500 font-bold">Trading window opens in Q1 2024</p>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Investment Details
        </h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="receipt_long" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Hero Section */}
        <div className="p-6 bg-slate-900 dark:bg-slate-800 text-white shadow-lg mb-6">
           <div className="flex items-center gap-3 mb-6">
               <div className="size-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                   <Icon name={investment.iconName} className="text-2xl" />
               </div>
               <div>
                   <h2 className="text-xl font-bold">{investment.name}</h2>
                   <p className="text-slate-400 text-sm">{investment.cycleDuration} Cycle • {investment.category}</p>
               </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
               <div>
                   <p className="text-sm text-slate-400 mb-1">Current Value</p>
                   <p className="text-2xl font-bold">₦{(investment.investedAmount + investment.currentReturn).toLocaleString()}</p>
               </div>
               <div className="text-right">
                   <p className="text-sm text-slate-400 mb-1">Accrued Interest</p>
                   <p className="text-2xl font-bold text-emerald-400">+₦{investment.currentReturn.toLocaleString()}</p>
               </div>
           </div>
        </div>

        <div className="px-4 space-y-6">
            {/* Timeline */}
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-6">Maturity Timeline</h3>
                
                <div className="relative flex justify-between items-center z-0 px-2">
                    {/* Line */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700 -z-10 rounded-full" />
                    <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-1000" 
                        style={{ width: `${investment.progress}%` }} 
                    />

                    {/* Start */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="size-4 rounded-full bg-primary border-4 border-white dark:border-slate-800 shadow-sm" />
                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Start</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">{investment.startDate}</p>
                        </div>
                    </div>

                    {/* End */}
                    <div className="flex flex-col items-center gap-2">
                         <div className={`size-4 rounded-full border-4 border-white dark:border-slate-800 shadow-sm ${investment.progress >= 100 ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Maturity</p>
                            <p className="text-xs font-bold text-slate-800 dark:text-white">{investment.maturityDate}</p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                    <Icon name="info" className="text-blue-500" />
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                        Funds will be available in your wallet on <span className="font-bold">{investment.payoutDate}</span> unless rolled over.
                    </p>
                </div>
            </div>

            {/* Rollover Settings */}
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4">Payout Preferences</h3>
                
                <div className="space-y-3">
                    <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${rolloverOption === 'payout' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}`}>
                        <input 
                            type="radio" 
                            name="rollover" 
                            checked={rolloverOption === 'payout'}
                            onChange={() => setRolloverOption('payout')}
                            className="text-primary focus:ring-primary size-5"
                        />
                        <div className="ml-3">
                            <span className="block text-sm font-bold text-slate-800 dark:text-white">Payout to Wallet</span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400">Principal + Interest deposited to balance</span>
                        </div>
                    </label>

                    <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${rolloverOption === 'principal' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}`}>
                        <input 
                            type="radio" 
                            name="rollover" 
                            checked={rolloverOption === 'principal'}
                            onChange={() => setRolloverOption('principal')}
                            className="text-primary focus:ring-primary size-5"
                        />
                        <div className="ml-3">
                            <span className="block text-sm font-bold text-slate-800 dark:text-white">Rollover Principal</span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400">Reinvest principal, payout interest</span>
                        </div>
                    </label>

                     <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${rolloverOption === 'all' ? 'border-primary bg-primary/5' : 'border-slate-200 dark:border-slate-700'}`}>
                        <input 
                            type="radio" 
                            name="rollover" 
                            checked={rolloverOption === 'all'}
                            onChange={() => setRolloverOption('all')}
                            className="text-primary focus:ring-primary size-5"
                        />
                        <div className="ml-3">
                            <span className="block text-sm font-bold text-slate-800 dark:text-white">Compound (Rollover All)</span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400">Reinvest principal + interest for max returns</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Documents */}
            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                 <h3 className="font-bold text-slate-800 dark:text-white mb-4">Documents</h3>
                 <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <Icon name="description" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Investment Contract</span>
                    </div>
                    <Icon name="download" className="text-slate-400 group-hover:text-primary transition-colors" />
                 </button>
                 <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Icon name="verified" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Ownership Certificate</span>
                    </div>
                    <Icon name="download" className="text-slate-400 group-hover:text-primary transition-colors" />
                 </button>
            </div>

             <button className="w-full py-4 rounded-xl text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors text-sm">
                Emergency Liquidation Request
             </button>
        </div>
      </div>
    </div>
  );
};
