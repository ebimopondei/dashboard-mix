import React, { useState } from 'react';
import { Icon } from './Icon';
import { COLLECTIONS } from '../constants';
import { Collection } from '../types';

interface SecondaryMarketViewProps {
  onBack: () => void;
  userTier: string;
}

const REGIONS = {
    'All': ['Nigeria', 'Kenya', 'Ghana', 'South Africa', 'Rwanda'],
    'West Africa': ['Nigeria', 'Ghana'],
    'East Africa': ['Kenya', 'Rwanda'],
    'South Africa': ['South Africa']
};

export const SecondaryMarketView: React.FC<SecondaryMarketViewProps> = ({ onBack, userTier }) => {
  const [activeRegion, setActiveRegion] = useState('All');

  // Check if user has premium access (Gold or Platinum)
  // PREVIEW OVERRIDE: Allow access for all users as requested
  const hasAccess = true; 

  const getFlagEmoji = (country: string) => {
    switch (country) {
      case 'Nigeria': return '🇳🇬';
      case 'Kenya': return '🇰🇪';
      case 'Ghana': return '🇬🇭';
      case 'South Africa': return '🇿🇦';
      case 'Rwanda': return '🇷🇼';
      default: return '🌍';
    }
  };

  const getRepaymentRate = (id: string) => {
      const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return 97 + (sum % 30) / 10; 
  };

  const getRegionForCountry = (country: string) => {
      if (['Nigeria', 'Ghana'].includes(country)) return 'West Africa';
      if (['Kenya', 'Rwanda'].includes(country)) return 'East Africa';
      if (['South Africa'].includes(country)) return 'South Africa';
      return 'Other';
  };

  const filteredOpportunities = COLLECTIONS.filter(col => {
      if (activeRegion === 'All') return true;
      const region = getRegionForCountry(col.country);
      return region === activeRegion;
  });

  if (!hasAccess) {
      return (
        <div className="fixed inset-0 z-[60] bg-slate-900 flex flex-col animate-in slide-in-from-right duration-300 text-white">
            <header className="flex items-center gap-4 p-4 sticky top-0 bg-transparent z-10">
                <button 
                onClick={onBack}
                className="p-2 -ml-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                <Icon name="close" className="text-2xl" />
                </button>
            </header>
            
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center -mt-16">
                <div className="size-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-2xl shadow-yellow-500/20 mb-8 animate-in zoom-in duration-500">
                    <Icon name="lock" className="text-5xl text-white" />
                </div>
                
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                    Continental Markets
                </h1>
                <p className="text-slate-400 mb-8 leading-relaxed max-w-xs mx-auto">
                    Unlock exclusive cross-border investment opportunities across Africa. Access high-yield markets in Kenya, Ghana, Rwanda and more.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                        <Icon name="public" className="text-yellow-500 text-2xl mb-2" />
                        <p className="font-bold text-sm">Pan-African</p>
                        <p className="text-xs text-slate-500">Access 5+ Countries</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                        <Icon name="trending_up" className="text-yellow-500 text-2xl mb-2" />
                        <p className="font-bold text-sm">Higher Yields</p>
                        <p className="text-xs text-slate-500">Up to 25% Returns</p>
                    </div>
                </div>

                <button className="w-full max-w-xs py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 font-bold text-white shadow-lg shadow-yellow-500/20 hover:scale-105 transition-transform">
                    Upgrade to Gold
                </button>
                <button onClick={onBack} className="mt-4 text-sm text-slate-500 font-medium hover:text-white transition-colors">
                    Maybe Later
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Fixed Header with defined height */}
      <header className="flex items-center gap-4 px-4 h-[72px] shrink-0 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-20 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate">
                Continental Markets
            </h1>
            <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest leading-none">Premium Access</p>
        </div>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="filter_list" />
        </button>
      </header>

      {/* Regions Tabs - Sticky exactly below the header */}
      <div className="sticky top-[72px] z-10 px-4 py-3 overflow-x-auto no-scrollbar bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex gap-2">
              {Object.keys(REGIONS).map((region) => (
                  <button
                      key={region}
                      onClick={() => setActiveRegion(region)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                          activeRegion === region
                              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                              : 'bg-white/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                  >
                      {region}
                  </button>
              ))}
          </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Listing Grid */}
        <div className="px-4 py-4 space-y-4">
            {filteredOpportunities.length > 0 ? (
                filteredOpportunities.map((market) => (
                    <div key={market.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-all group active:scale-[0.99]">
                        <div className="p-4 flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                 <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-500/20 transition-colors shadow-inner border border-slate-100 dark:border-slate-600/30">
                                    {getFlagEmoji(market.country)}
                                 </div>
                                 <div>
                                     <h3 className="font-bold text-slate-800 dark:text-white text-base leading-tight">{market.name}</h3>
                                     <div className="flex items-center gap-1.5 mt-0.5">
                                        <Icon name="public" className="text-[14px] text-slate-400" />
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{market.location}, {market.country}</p>
                                     </div>
                                 </div>
                            </div>
                        </div>
                        
                        <div className="px-4 pb-4 grid grid-cols-3 gap-2">
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-600/20">
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-tighter mb-0.5">Target ROI</p>
                                <p className="text-lg font-bold text-emerald-500 leading-none">{market.maxReturn}%</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-600/20">
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-tighter mb-0.5">Repayment</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-white leading-none">{getRepaymentRate(market.id).toFixed(1)}%</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl border border-slate-100/50 dark:border-slate-600/20">
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-tighter mb-0.5">Return</p>
                                <p className={`text-lg font-bold leading-none ${
                                    market.riskLevel === 'High' ? 'text-emerald-500' : 
                                    market.riskLevel === 'Medium' ? 'text-amber-500' : 
                                    'text-slate-500 dark:text-slate-400'
                                }`}>
                                    {market.riskLevel === 'High' ? 'High' : market.riskLevel === 'Medium' ? 'Medium' : 'Low'}
                                </p>
                            </div>
                        </div>

                        <div className="px-4 pb-4">
                             <div className="w-full h-px bg-slate-100 dark:bg-slate-700 mb-3" />
                             <div className="flex justify-between items-center">
                                 <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                    Min. Investment: <span className="text-slate-800 dark:text-white font-bold ml-1">₦{market.minInvestment.toLocaleString()}</span>
                                 </span>
                                 <button className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                                    View Hub <Icon name="arrow_forward" className="text-sm" />
                                 </button>
                             </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                    <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
                        <Icon name="search_off" className="text-3xl" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No markets available</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">There are currently no active opportunities in {activeRegion}. Try selecting 'All' or check back later.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};