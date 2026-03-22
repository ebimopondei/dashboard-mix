
import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from './Icon';
import { ManagedTrader, AgentProfile } from '../types';
import { AgentAssistedSessionView } from './AgentAssistedSessionView';

interface AgentDailyCollectionsViewProps {
  onBack: () => void;
  agentProfile: AgentProfile;
}

export const AgentDailyCollectionsView: React.FC<AgentDailyCollectionsViewProps> = ({ onBack, agentProfile }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'complied'>('pending');
  const [assistedTrader, setAssistedTrader] = useState<ManagedTrader | null>(null);
  const [expandedTraderId, setExpandedTraderId] = useState<string | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Simulated Daily Target
  const targetAmount = 65000;
  
  // Simulated list of traders for today's collection
  const collections = useMemo(() => {
    const traders = agentProfile.managedTraders.filter(t => t.status === 'Active' || t.status === 'Default Risk');
    return traders.map((t, idx) => ({
      ...t,
      dueAmount: 1500 + (idx * 200),
      hasPaid: idx % 3 === 0, // Mocking some as paid
      timePaid: idx % 3 === 0 ? '11:20 AM' : null
    }));
  }, [agentProfile.managedTraders]);

  const compliedTraders = collections.filter(c => c.hasPaid);
  const pendingTraders = collections.filter(c => !c.hasPaid);
  
  const collectedAmount = compliedTraders.reduce((sum, c) => sum + c.dueAmount, 0);
  const progressPercent = Math.round((collectedAmount / targetAmount) * 100);

  // Trigger the progress bar fill animation on mount
  useEffect(() => {
    if (!assistedTrader) {
        const timer = setTimeout(() => {
            setAnimatedProgress(progressPercent);
        }, 300);
        return () => clearTimeout(timer);
    }
  }, [progressPercent, assistedTrader]);

  const toggleExpand = (id: string) => {
    setExpandedTraderId(expandedTraderId === id ? null : id);
  };

  if (assistedTrader) {
    return (
      <AgentAssistedSessionView 
        trader={assistedTrader} 
        agent={agentProfile} 
        onBack={() => setAssistedTrader(null)} 
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-bottom duration-500">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1 text-center pr-8">Today's Collections</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-12">
        {/* Progress Card - Target Prominent */}
        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Icon name="payments" className="text-[12rem]" />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] mb-1">Total Collected</p>
                        <h2 className="text-5xl font-black tracking-tighter">₦{collectedAmount.toLocaleString()}</h2>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center min-w-[80px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-0.5">Goal</p>
                        <p className="text-xl font-black text-white">{progressPercent}%</p>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-end mb-2">
                        <div className="text-left">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Daily Target</p>
                            <p className="text-sm font-black text-white/80">₦{targetAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Remaining</p>
                            <p className="text-sm font-black text-rose-400">₦{(targetAmount - collectedAmount).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-[1500ms] ease-out" 
                            style={{ width: `${animatedProgress}%` }}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* AI Advisory */}
        <section className="bg-indigo-600 rounded-[2.5rem] p-6 text-white shadow-lg relative overflow-hidden animate-in slide-in-from-right duration-700">
            <Icon name="auto_awesome" className="absolute -right-4 -bottom-4 text-8xl opacity-10" />
            <div className="relative z-10">
                <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-100 mb-3 flex items-center gap-2">
                    <Icon name="psychology" className="text-sm" />
                    Assistant
                </h3>
                <p className="text-xs font-bold leading-relaxed mb-4 italic">
                   "Priority Action: Visit <span className="underline decoration-yellow-400">John Electronics</span> next. He has a high 'Default Risk' tag and hasn't logged a sale in 24h."
                </p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10 active:scale-95 transition-transform">Optimize Route</button>
                    <button className="px-4 py-2 bg-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest border border-white/10 active:scale-95 transition-transform">Call Ops</button>
                </div>
            </div>
        </section>

        {/* Traders List Toggle */}
        <div className="space-y-4">
            <div className="flex p-1 bg-slate-200 dark:bg-slate-900 rounded-2xl">
                <button 
                    onClick={() => { setActiveTab('pending'); setExpandedTraderId(null); }}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'pending' ? 'bg-white dark:bg-slate-800 text-rose-500 shadow-md' : 'text-slate-500'}`}
                >
                    Pending ({pendingTraders.length})
                </button>
                <button 
                    onClick={() => { setActiveTab('complied'); setExpandedTraderId(null); }}
                    className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'complied' ? 'bg-white dark:bg-slate-800 text-emerald-500 shadow-md' : 'text-slate-500'}`}
                >
                    Paid ({compliedTraders.length})
                </button>
            </div>

            <div className="space-y-3">
                {(activeTab === 'pending' ? pendingTraders : compliedTraders).map(trader => {
                    const isExpanded = expandedTraderId === trader.id;
                    return (
                        <div 
                            key={trader.id}
                            className={`bg-white dark:bg-slate-800 rounded-[2rem] border transition-all overflow-hidden ${isExpanded ? 'border-primary shadow-lg ring-1 ring-primary/20' : 'border-slate-100 dark:border-slate-700 shadow-sm'}`}
                        >
                            <div 
                                onClick={() => activeTab === 'pending' && toggleExpand(trader.id)}
                                className={`p-5 flex items-center justify-between group transition-colors ${activeTab === 'pending' ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-full flex items-center justify-center font-black text-lg shadow-inner ${trader.hasPaid ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                                        {trader.name[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-black text-slate-800 dark:text-white text-sm truncate">{trader.businessName}</h4>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">{trader.location} • {trader.name}</p>
                                    </div>
                                </div>
                                
                                <div className="text-right shrink-0">
                                    <p className={`font-black text-sm ${trader.hasPaid ? 'text-emerald-500' : 'text-rose-500'}`}>₦{trader.dueAmount.toLocaleString()}</p>
                                    {trader.hasPaid ? (
                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">Paid @ {trader.timePaid}</span>
                                    ) : (
                                        <Icon name={isExpanded ? "expand_less" : "expand_more"} className="text-slate-300" />
                                    )}
                                </div>
                            </div>

                            {/* Expanded Action Panel for Pending Traders */}
                            {isExpanded && activeTab === 'pending' && (
                                <div className="px-5 pb-5 pt-2 animate-in slide-in-from-top-2 duration-300">
                                    <div className="w-full h-px bg-slate-100 dark:bg-slate-700 mb-4" />
                                    <div className="grid grid-cols-3 gap-2">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setAssistedTrader(trader); }}
                                            className="col-span-1 py-3.5 rounded-2xl bg-amber-500 text-white flex flex-col items-center justify-center gap-1 active:scale-95 transition-all shadow-lg shadow-amber-500/20"
                                        >
                                            <Icon name="record_voice_over" className="text-lg" />
                                            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Assist</span>
                                        </button>
                                        
                                        <button className="py-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border border-rose-100 dark:border-rose-900/30">
                                            <Icon name="call" className="text-lg" />
                                            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Call</span>
                                        </button>

                                        <button className="py-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex flex-col items-center justify-center gap-1 active:scale-95 transition-all border border-indigo-100 dark:border-indigo-900/30">
                                            <Icon name="directions" className="text-lg" />
                                            <span className="text-[8px] font-black uppercase tracking-widest leading-none">Map</span>
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mt-4 italic opacity-70">Secured Assisted Session with Digital-Analog Sync</p>
                                </div>
                            )}
                        </div>
                    );
                })}

                {(activeTab === 'pending' ? pendingTraders : compliedTraders).length === 0 && (
                    <div className="py-12 text-center opacity-40">
                        <Icon name="verified" className="text-5xl mb-3" />
                        <p className="font-black text-xs uppercase tracking-widest">No traders in this list</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button 
            className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.3em] rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
            onClick={() => onBack()}
          >
              <Icon name="check_circle" />
              Complete Session
          </button>
      </div>
    </div>
  );
};
