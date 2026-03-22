
import React, { useState, useMemo } from 'react';
import { Icon } from './Icon';
import { AgentProfile, ViewType, ManagedTrader } from '../types';
import { AgentAssistedSessionView } from './AgentAssistedSessionView';

interface AgentTraderManagementViewProps {
  onBack: () => void;
  agentProfile: AgentProfile;
}

export const AgentTraderManagementView: React.FC<AgentTraderManagementViewProps> = ({ onBack, agentProfile }) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Pending' | 'Risk'>('All');
  const [expandedTraderId, setExpandedTraderId] = useState<string | null>(null);
  const [assistedTrader, setAssistedTrader] = useState<ManagedTrader | null>(null);
  
  const filteredTraders = agentProfile.managedTraders.filter(t => {
      if (filter === 'All') return true;
      if (filter === 'Active') return t.status === 'Active';
      if (filter === 'Pending') return t.status === 'Pending Verification';
      if (filter === 'Risk') return t.status === 'Default Risk';
      return true;
  });

  // Agent Relevant KPI: KYC & Loan Level
  const getTraderTier = (id: string) => {
      const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      if (sum % 4 === 0) return { label: 'Level 2 KYC', icon: 'verified', color: 'text-emerald-500', limit: '₦250k' };
      if (sum % 3 === 0) return { label: 'Level 1 KYC', icon: 'check_circle', color: 'text-blue-500', limit: '₦50k' };
      return { label: 'Pending Docs', icon: 'pending', color: 'text-amber-500', limit: '₦0' };
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
    <div className="flex flex-col animate-in fade-in duration-500 -mx-4 -mt-2">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">Managed Portfolio</h1>
        <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center active:scale-90 transition-transform shadow-inner">
          <Icon name="search" className="text-slate-400" />
        </button>
      </header>

      <div className="flex-1 p-4">
         {/* Filter Strip */}
         <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar py-1">
             {['All', 'Active', 'Pending', 'Risk'].map((f) => (
                 <button 
                    key={f}
                    onClick={() => setFilter(f as any)}
                    className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                        filter === f 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                        : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                 >
                     {f}
                 </button>
             ))}
         </div>

         {/* Trader List */}
         <div className="space-y-4">
             {filteredTraders.map((trader) => {
                 const tier = getTraderTier(trader.id);
                 const isExpanded = expandedTraderId === trader.id;
                 
                 return (
                    <div key={trader.id} className="space-y-2">
                        <div 
                            onClick={() => setExpandedTraderId(isExpanded ? null : trader.id)}
                            className={`bg-white dark:bg-slate-800 rounded-[2rem] border transition-all cursor-pointer active:scale-[0.99] ${isExpanded ? 'border-emerald-500 shadow-2xl' : 'border-slate-100 dark:border-slate-700 shadow-sm'}`}
                        >
                            <div className="p-5 flex items-start gap-4">
                                <div className="relative">
                                    <div className="size-14 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 font-black text-xl border border-slate-200 dark:border-slate-800 shadow-inner">
                                        {trader.name[0]}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 size-5 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center ${tier.color.replace('text', 'bg')}`}>
                                        <Icon name={tier.icon} className="text-[10px] text-white" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-black text-slate-800 dark:text-white text-base truncate pr-2">{trader.name}</h3>
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg tracking-tighter ${getStatusBadge(trader.status)}`}>
                                            {trader.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{trader.businessName} • {trader.location}</p>
                                    
                                    <div className="flex items-center gap-4 mt-3 text-[10px] font-black uppercase tracking-tighter">
                                        <div className="flex items-center gap-1.5 text-slate-400">
                                            <Icon name="event" className="text-xs" />
                                            <span>Seen {trader.lastVisit}</span>
                                        </div>
                                        <div className={`flex items-center gap-1.5 ${tier.color}`}>
                                            <Icon name="security" className="text-xs" />
                                            <span>{tier.label}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-emerald-500">
                                            <Icon name="trending_up" className="text-xs" />
                                            <span>Limit: {tier.limit}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Actions Footer */}
                            <div className="flex border-t border-slate-50 dark:border-slate-700/50">
                                {trader.status === 'Pending Verification' ? (
                                    <>
                                        <button className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            Decline
                                        </button>
                                        <div className="w-px bg-slate-50 dark:border-slate-700/50" />
                                        <button className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                                            Approve KYC
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-center gap-2">
                                            <Icon name="assignment" className="text-sm" /> Visit Log
                                        </button>
                                        <div className="w-px bg-slate-50 dark:border-slate-700/50" />
                                        <button className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-2">
                                            <Icon name="payments" className="text-sm" /> Collect
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Agent Portfolio Insights Overlay when expanded */}
                        {isExpanded && (
                            <div className="mx-4 p-6 bg-slate-900 rounded-b-[2rem] border-x border-b border-emerald-500/30 animate-in slide-in-from-top-4 duration-500 shadow-inner space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">Agent Portfolio Insight</h4>
                                    <span className="text-[9px] font-bold text-slate-500 uppercase">Risk Level: Low</span>
                                </div>

                                {/* Assisted Mode Trigger */}
                                <div className="bg-amber-500/10 p-5 rounded-3xl border border-amber-500/20 flex flex-col gap-4">
                                     <div className="flex items-center gap-3">
                                         <div className="size-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                            <Icon name="record_voice_over" />
                                         </div>
                                         <div>
                                            <h5 className="text-sm font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Secure Assisted Mode</h5>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Sync with Analog Paper Card</p>
                                         </div>
                                     </div>
                                     <p className="text-xs text-slate-400 leading-relaxed italic">
                                        Use this mode to help {trader.name.split(' ')[0]} log repayments or Esusu contributions digitally while syncing with their physical card.
                                     </p>
                                     <button 
                                        onClick={(e) => { e.stopPropagation(); setAssistedTrader(trader); }}
                                        className="w-full py-4 bg-amber-500 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                                     >
                                         <Icon name="qr_code_scanner" className="text-sm" />
                                         Start Assisted Session
                                     </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Repayment Performance</p>
                                        <p className="text-lg font-black text-white">98.4%</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Portfolio Aging</p>
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-lg font-black text-white">142 Days</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Verification Milestones</p>
                                    {[
                                        { label: 'Address Verified', status: 'done', color: 'text-emerald-500' },
                                        { label: 'Shop Reference Check', status: 'done', color: 'text-emerald-500' },
                                        { label: 'Inventory Valuation', status: 'pending', color: 'text-slate-500' }
                                    ].map((m, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Icon name={m.status === 'done' ? 'check_circle' : 'radio_button_unchecked'} className={`text-sm ${m.color}`} />
                                                <span className="text-xs font-bold text-white">{m.label}</span>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase ${m.color}`}>{m.status}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <button className="w-full py-4 bg-white/10 text-white border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">
                                    Download Account Activity Report
                                </button>
                            </div>
                        )}
                    </div>
                 );
             })}
         </div>
      </div>
    </div>
  );
};

const getStatusBadge = (status: string) => {
    switch(status) {
        case 'Active': return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
        case 'Pending Verification': return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
        case 'Default Risk': return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
        default: return 'bg-slate-100 text-slate-700';
    }
};
