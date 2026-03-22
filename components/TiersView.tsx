
import React from 'react';
import { Icon } from './Icon';
import { TIER_LEVELS, PROFILE_EXPERT } from '../constants';

interface TiersViewProps {
  onBack: () => void;
  currentTier?: string;
  totalInvested?: number;
}

export const TiersView: React.FC<TiersViewProps> = ({ 
    onBack, 
    currentTier = PROFILE_EXPERT.tier, 
    totalInvested = PROFILE_EXPERT.totalInvested 
}) => {
  
  // Find current tier index
  const currentTierIndex = TIER_LEVELS.findIndex(t => t.name === currentTier);
  const nextTier = TIER_LEVELS[currentTierIndex + 1];
  const progress = nextTier 
    ? Math.min(100, Math.round((totalInvested / nextTier.minInvestment) * 100))
    : 100;

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-transparent z-10">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full bg-white/20 backdrop-blur-md text-slate-800 dark:text-white hover:bg-white/30 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Investor Tiers
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto pb-20 -mt-[72px] pt-[72px]">
         
         {/* Current Status */}
         <div className="mx-4 mt-2 p-6 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-black rounded-3xl text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Icon name="military_tech" className="text-9xl" />
             </div>
             
             <div className="relative z-10 text-center">
                 <div className="inline-flex items-center justify-center size-20 rounded-full bg-yellow-500/20 border-2 border-yellow-500 mb-4">
                     <Icon name={TIER_LEVELS[currentTierIndex]?.icon || 'star'} className="text-4xl text-yellow-500" />
                 </div>
                 <h2 className="text-2xl font-bold mb-1">You are a {currentTier} Investor</h2>
                 <p className="text-slate-400 text-sm mb-6">Enjoying exclusive benefits and priority access.</p>
                 
                 {nextTier ? (
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex justify-between text-xs font-bold mb-2">
                            <span>Progress to {nextTier.name}</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                            <div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-xs text-slate-300">
                            Invest <span className="text-white font-bold">₦{(nextTier.minInvestment - totalInvested).toLocaleString()}</span> more to unlock {nextTier.name}.
                        </p>
                    </div>
                 ) : (
                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                        <p className="text-sm font-bold text-yellow-400">You have reached the top tier!</p>
                    </div>
                 )}
             </div>
         </div>

         {/* Benefits List */}
         <div className="px-4 py-6 space-y-6">
             <h3 className="font-bold text-slate-800 dark:text-white">All Tiers & Benefits</h3>
             
             <div className="space-y-4">
                 {TIER_LEVELS.map((level, idx) => {
                     const isUnlocked = idx <= currentTierIndex;
                     return (
                        <div 
                            key={level.name} 
                            className={`rounded-xl border transition-all overflow-hidden ${
                                isUnlocked 
                                ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm' 
                                : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-70'
                            }`}
                        >
                            <div className="p-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-700/50">
                                <div className={`size-12 rounded-full flex items-center justify-center text-white shadow-sm ${level.color}`}>
                                    <Icon name={level.icon} className="text-xl" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 dark:text-white">{level.name}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {level.minInvestment === 0 ? 'Entry Level' : `₦${level.minInvestment.toLocaleString()}+ Invested`}
                                    </p>
                                </div>
                                {isUnlocked && (
                                    <Icon name="check_circle" className="text-emerald-500" />
                                )}
                            </div>
                            <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50">
                                <ul className="space-y-2">
                                    {level.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                            <Icon name="done" className="text-primary text-base shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                     );
                 })}
             </div>
         </div>
      </div>
    </div>
  );
};