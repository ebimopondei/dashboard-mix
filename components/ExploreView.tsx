
import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from './Icon';
import { ClusterCard } from './ClusterCard';
import { ClusterDetailsView } from './ClusterDetailsView';
import { COLLECTIONS, REAL_ESTATE, STOCKS_BONDS, STARTUPS } from '../constants';
import { Collection, ViewType, RealEstateProperty, StockBond, StartupPitch, OfferingTab, Investment } from '../types';

const COUNTRIES = ["All", "Nigeria", "Kenya", "Ghana", "South Africa", "Rwanda", "USA"];

interface ExploreViewProps {
    onNavigate?: (view: ViewType, id?: string) => void;
    initialTab?: OfferingTab;
    onTabChange?: (tab: OfferingTab) => void;
    onAddInvestment?: (investment: Investment, pMethod: 'wallet' | 'card') => void;
    userBalance: number;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onNavigate, initialTab = 'clusters', onTabChange, onAddInvestment, userBalance }) => {
  const [activeTab, setActiveTab] = useState<OfferingTab>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCountry, setActiveCountry] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  
  // Advanced Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minReturn, setMinReturn] = useState<number>(0);

  // Sync internal state with external hoisted state
  useEffect(() => {
    if (onTabChange) {
        onTabChange(activeTab);
    }
  }, [activeTab, onTabChange]);

  const filteredCollections = useMemo(() => {
    return COLLECTIONS.filter(collection => {
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = activeCountry === 'All' || collection.country === activeCountry;
      const matchesReturn = minReturn === 0 || collection.maxReturn >= minReturn;
      return matchesSearch && matchesCountry && matchesReturn;
    });
  }, [searchQuery, activeCountry, minReturn]);

  const filteredRealEstate = useMemo(() => {
    return REAL_ESTATE.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCountry = activeCountry === 'All' || p.country === activeCountry;
        return matchesSearch && matchesCountry;
    });
  }, [searchQuery, activeCountry]);

  const filteredStocks = useMemo(() => {
    return STOCKS_BONDS.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.ticker.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCountry = activeCountry === 'All' || s.country === activeCountry;
        return matchesSearch && matchesCountry;
    });
  }, [searchQuery, activeCountry]);

  const filteredStartups = useMemo(() => {
    return STARTUPS.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });
  }, [searchQuery]);

  if (selectedCollection) {
    return <ClusterDetailsView collection={selectedCollection} onBack={() => setSelectedCollection(null)} onAddInvestment={onAddInvestment} userBalance={userBalance} />;
  }

  const tabs: {id: OfferingTab, label: string, icon: string}[] = [
      { id: 'clusters', label: 'Clusters', icon: 'groups' },
      { id: 'real_estate', label: 'Real Estate', icon: 'apartment' },
      { id: 'stocks', label: 'Stocks', icon: 'show_chart' },
      { id: 'startup', label: 'Startup', icon: 'rocket_launch' }
  ];

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-500 pb-24">
      {/* Tab Switcher - Main Category Buttons */}
      <div className="flex bg-slate-200 dark:bg-slate-900 p-1.5 rounded-2xl gap-1.5">
          {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearchQuery(''); }}
                className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'bg-white dark:bg-slate-800 shadow-xl text-primary scale-[1.02]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              >
                  <Icon name={tab.icon} className="text-xl" />
                  <span className="text-[9px] font-black uppercase tracking-tighter mt-1">{tab.label}</span>
              </button>
          ))}
      </div>

      {/* Contextual Search Header */}
      <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="search" className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder={`Search ${activeTab.replace('_', ' ')}...`}
            className="block w-full pl-10 pr-3 h-12 rounded-xl border-none bg-white dark:bg-slate-800/80 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary shadow-sm outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      {/* Secondary Filter Row */}
      {activeTab !== 'startup' && (
        <div className="flex gap-2">
            <div className="relative flex-1">
                <select
                    value={activeCountry}
                    onChange={(e) => setActiveCountry(e.target.value)}
                    className="w-full h-10 pl-10 pr-8 rounded-xl border-none bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 font-bold text-xs shadow-sm appearance-none outline-none focus:ring-2 focus:ring-primary"
                >
                    {COUNTRIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Locations' : c}</option>)}
                </select>
                <Icon name="public" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <Icon name="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
            </div>
            <button 
                onClick={() => setIsFilterOpen(true)}
                className={`size-10 rounded-xl flex items-center justify-center border ${minReturn > 0 ? 'bg-primary border-primary text-white' : 'bg-white dark:bg-slate-800/50 border-transparent text-slate-400'}`}
            >
                <Icon name="tune" className="text-sm" />
            </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-4">
          {activeTab === 'clusters' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl text-white flex items-center justify-between shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Market Pools</p>
                          <h3 className="text-lg font-black leading-none mt-1">Working Capital Clusters</h3>
                      </div>
                      <Icon name="hub" className="absolute -right-4 -bottom-4 text-7xl opacity-20" />
                      <div className="relative z-10 bg-white/20 px-2 py-1 rounded text-[8px] font-black uppercase border border-white/20">Local Hubs</div>
                  </div>

                  {/* Continental Markets Entry */}
                  <button 
                    onClick={() => onNavigate && onNavigate(ViewType.SECONDARY_MARKET)}
                    className="w-full p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white flex items-center justify-between shadow-lg relative overflow-hidden group active:scale-[0.98] transition-all"
                  >
                      <div className="relative z-10 text-left">
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-100">Cross Border Access</p>
                          <h3 className="text-lg font-black leading-none mt-1">Continental Markets</h3>
                          <p className="text-[10px] text-white/80 mt-1 font-bold">Invest in Kenya, Ghana, Rwanda & more</p>
                      </div>
                      <Icon name="public" className="absolute -right-4 -bottom-4 text-7xl opacity-20 group-hover:scale-110 transition-transform" />
                      <div className="relative z-10 bg-white/20 p-2 rounded-full backdrop-blur-sm border border-white/20">
                          <Icon name="arrow_forward" className="text-lg" />
                      </div>
                  </button>

                  {filteredCollections.map(c => <ClusterCard key={c.id} cluster={c} onClick={() => setSelectedCollection(c)} />)}
              </div>
          )}

          {activeTab === 'real_estate' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                   <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-2xl text-white flex items-center justify-between shadow-lg relative overflow-hidden">
                      <div className="relative z-10">
                          <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Fractional & Whole Assets</p>
                          <h3 className="text-lg font-black leading-none mt-1">Tokenized Real Estate</h3>
                      </div>
                      <Icon name="smart_toy" className="absolute -right-4 -bottom-4 text-7xl opacity-20" />
                      <div className="relative z-10 bg-white/20 px-2 py-1 rounded text-[8px] font-black uppercase border border-white/20">On-Chain Deed</div>
                  </div>
                  {filteredRealEstate.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => onNavigate && onNavigate(ViewType.REAL_ESTATE_DETAIL, p.id)}
                        className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
                      >
                          <div className="h-48 relative">
                              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute top-4 left-4 flex gap-1.5">
                                  <span className={`backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/20 ${p.purchaseType === 'Whole' ? 'bg-indigo-600/60' : 'bg-primary/60'}`}>
                                      {p.purchaseType}
                                  </span>
                              </div>
                              <div className={`absolute top-4 right-4 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/20 ${p.purchaseType === 'Fractional' ? 'bg-blue-600/60' : 'bg-amber-600/60'}`}>
                                  {p.purchaseType === 'Fractional' ? 'Mix Afrika Managed' : 'Management Choice'}
                              </div>
                          </div>
                          <div className="p-5">
                               <div className="flex justify-between items-start mb-2">
                                   <div>
                                       <h4 className="font-black text-slate-900 dark:text-white text-lg">{p.name}</h4>
                                       <p className="text-xs text-slate-500 font-bold">{p.location}</p>
                                   </div>
                                   <div className="text-right">
                                       <p className="text-lg font-black text-emerald-500">{p.expectedYield}%</p>
                                       <p className="text-[8px] font-black uppercase text-slate-400">Yield PA</p>
                                   </div>
                               </div>
                               
                               {p.purchaseType === 'Fractional' && (
                                   <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden my-4">
                                       <div className="bg-primary h-full rounded-full" style={{ width: `${p.fundedProgress}%` }} />
                                   </div>
                               )}
                               
                               <div className="flex justify-between items-center mt-4">
                                   <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase">Valuation</p>
                                       <p className="text-sm font-black text-slate-800 dark:text-white">₦{p.totalValue.toLocaleString()}</p>
                                   </div>
                                   <button className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                       {p.purchaseType === 'Whole' ? 'Buy Whole' : 'Buy Unit'}
                                   </button>
                               </div>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {activeTab === 'stocks' && (
              <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-400">
                  {/* Market Header */}
                  <section className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-6 opacity-10"><Icon name="show_chart" className="text-9xl" /></div>
                      <div className="relative z-10 flex items-center justify-between mb-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-1">Global Securities</p>
                            <h3 className="text-2xl font-black">Market Terminal</h3>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black uppercase text-emerald-400">Exchange Open</span>
                        </div>
                      </div>

                      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                         {[
                            { label: 'NGX All Share', val: '67,324.50', chg: '+1.2%', pos: true },
                            { label: 'NSE 20 Index', val: '1,842.10', chg: '-0.4%', pos: false },
                            { label: 'S&P 500', val: '4,502.80', chg: '+0.8%', pos: true },
                         ].map((idx, i) => (
                             <div key={i} className="min-w-[140px] bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-md">
                                 <p className="text-[8px] font-black uppercase text-slate-400 mb-1 truncate">{idx.label}</p>
                                 <p className="font-black text-sm">{idx.val}</p>
                                 <p className={`text-[9px] font-bold mt-1 ${idx.pos ? 'text-emerald-400' : 'text-rose-400'}`}>{idx.chg}</p>
                             </div>
                         ))}
                      </div>
                  </section>

                  {/* Movers Strip */}
                  <div className="flex gap-4 overflow-x-auto no-scrollbar px-1 py-2">
                       <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black uppercase text-slate-500 whitespace-nowrap">🔥 Top Gainers:</span>
                           {STOCKS_BONDS.filter(s => s.changePercent > 1.5).map(s => (
                               <div key={s.id} className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                   <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{s.ticker}</span>
                                   <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500">+{s.changePercent}%</span>
                               </div>
                           ))}
                       </div>
                  </div>

                  {/* Asset List Terminal */}
                  <div className="space-y-3">
                      <div className="flex items-center justify-between px-2">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All Instruments</h4>
                        <div className="flex items-center gap-3">
                            <button className="text-[9px] font-black text-primary uppercase underline">Screener</button>
                            <span className="text-[9px] font-bold text-slate-500 uppercase">{filteredStocks.length} Assets</span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                          <div className="grid grid-cols-1 divide-y divide-slate-50 dark:divide-slate-700/50">
                            {filteredStocks.map(s => (
                                <div 
                                    key={s.id} 
                                    onClick={() => onNavigate && onNavigate(ViewType.STOCK_DETAIL, s.id)}
                                    className="p-5 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-900 transition-all cursor-pointer active:scale-[0.99]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center font-black text-slate-800 dark:text-white border border-slate-200 dark:border-slate-800 shadow-inner transition-transform group-hover:scale-105">
                                            {s.ticker}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">{s.name}</h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-[9px] font-black uppercase text-slate-400">{s.sector}</span>
                                                <span className="size-1 rounded-full bg-slate-300" />
                                                <span className="text-[9px] font-black uppercase text-blue-500">{s.exchange}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900 dark:text-white leading-none mb-1">₦{s.price.toLocaleString()}</p>
                                        <div className={`flex items-center justify-end gap-1 font-bold text-[10px] ${s.changePercent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            <Icon name={s.changePercent >= 0 ? 'arrow_drop_up' : 'arrow_drop_down'} className="text-sm" />
                                            <span>{Math.abs(s.changePercent)}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                          </div>
                      </div>
                  </div>

                  <div className="p-5 bg-amber-50 dark:bg-amber-500/5 rounded-3xl border border-amber-100 dark:border-amber-500/10 flex gap-4">
                      <Icon name="info" className="text-amber-500 shrink-0" />
                      <p className="text-[10px] text-slate-500 leading-relaxed italic">
                        Cross-border securities (marked <Icon name="public" className="text-[10px]" />) are subject to local currency conversion and exchange control regulations. Prices are delayed by 15 mins.
                      </p>
                  </div>
              </div>
          )}

          {activeTab === 'startup' && (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="p-6 bg-slate-950 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-20"><Icon name="auto_awesome" className="text-6xl text-yellow-400" /></div>
                      <h3 className="text-white text-xl font-black mb-1">Founders Accelerator</h3>
                      <p className="text-slate-400 text-xs mb-4">Crowdfund the next generation of African unicorns.</p>
                      <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-yellow-400 animate-pulse" />
                          <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Strictly African Innovation</span>
                      </div>
                  </div>
                  {filteredStartups.map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => onNavigate && onNavigate(ViewType.STARTUP_DETAIL, s.id)}
                        className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col active:scale-[0.98] transition-transform cursor-pointer group"
                      >
                          <div className="h-40 relative">
                              <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                              <div className="absolute bottom-4 left-4 flex gap-1">
                                  {s.tags.map(t => <span key={t} className="bg-black/40 backdrop-blur-md text-white text-[8px] font-black uppercase px-2 py-1 rounded-lg border border-white/10">{t}</span>)}
                              </div>
                          </div>
                          <div className="p-6">
                              <h4 className="text-xl font-black mb-1">{s.name}</h4>
                              <p className="text-xs text-slate-500 font-bold mb-4">{s.founder} • {s.location}</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6 line-clamp-2 italic">"{s.description}"</p>
                              
                              <div className="grid grid-cols-2 gap-4 mb-6">
                                  <div><p className="text-[10px] font-bold text-slate-400 uppercase">Equity Offered</p><p className="text-lg font-black text-primary">{s.equityOffered}%</p></div>
                                  <div className="text-right"><p className="text-[10px] font-bold text-slate-400 uppercase">Raised</p><p className="text-lg font-black">₦{s.raisedAmount.toLocaleString()}</p></div>
                              </div>

                              <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-transform">Review Deck & Invest</button>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {/* Empty State */}
          {((activeTab === 'clusters' && filteredCollections.length === 0) ||
            (activeTab === 'real_estate' && filteredRealEstate.length === 0) ||
            (activeTab === 'stocks' && filteredStocks.length === 0) ||
            (activeTab === 'startup' && filteredStartups.length === 0)) && (
              <div className="py-20 text-center flex flex-col items-center opacity-40">
                  <Icon name="search_off" className="text-6xl mb-4" />
                  <p className="font-black uppercase tracking-widest text-sm">No results in {activeTab}</p>
              </div>
          )}
      </div>
    </div>
  );
};
