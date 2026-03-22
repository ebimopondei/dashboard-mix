
import React from 'react';
import { Icon } from './Icon';
import { AgentProfile, ViewType } from '../types';

interface AgentDashboardViewProps {
  onNavigate: (view: ViewType, id?: string) => void;
  agentProfile: AgentProfile;
}

export const AgentDashboardView: React.FC<AgentDashboardViewProps> = ({ onNavigate, agentProfile }) => {
  
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-24">
      
      {/* Header / Wallet */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl border border-white/5">
          <div className="absolute top-0 right-0 p-8 opacity-10">
              <Icon name="admin_panel_settings" className="text-9xl" />
          </div>
          
          <div className="relative z-10 flex justify-between items-start mb-6">
              <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-1">Regional Agent</p>
                  <h2 className="text-3xl font-black mb-1">{agentProfile.name}</h2>
                  <p className="text-slate-400 text-xs flex items-center gap-1 font-bold">
                      <Icon name="map" className="text-xs" />
                      {agentProfile.region}
                  </p>
              </div>
          </div>
          
          <div className="relative z-10">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Commissions</p>
                  <h2 className="text-4xl font-black tracking-tighter">₦{agentProfile.walletBalance.toLocaleString()}</h2>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg text-emerald-400 text-[10px] font-black uppercase">
                  Payout in 2 days
                </div>
              </div>
              
              <div className="flex gap-3">
                  <button 
                    onClick={() => onNavigate(ViewType.AGENT_WALLET)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-colors"
                  >
                      <Icon name="account_balance_wallet" className="text-sm" />
                      <span>Wallet</span>
                  </button>
                  <button 
                    onClick={() => onNavigate(ViewType.AGENT_REPORTS)}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-white/10 text-white hover:bg-white/20 transition-colors border border-white/5"
                  >
                      <Icon name="add_task" className="text-sm" />
                      <span>New Visit</span>
                  </button>
              </div>
          </div>
      </div>

      {/* Portfolio Performance Summary */}
      <section className="grid grid-cols-2 gap-4">
          <div 
             onClick={() => onNavigate(ViewType.AGENT_TRADERS)}
             className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors group"
          >
              <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 transition-transform group-hover:scale-110">
                  <Icon name="groups" />
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{agentProfile.tradersCount}</p>
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-1">Managed Traders</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm group">
              <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 transition-transform group-hover:scale-110">
                  <Icon name="payments" />
              </div>
              <p className="text-2xl font-black text-slate-800 dark:text-white leading-none">{agentProfile.repaymentRate}%</p>
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-1">Repayment Rate</p>
          </div>
      </section>

      {/* Collection Focus (Relevant for Agents) */}
      <section className="animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-black text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
            <Icon name="event_available" className="text-blue-500 text-sm" />
            Today's Collections
          </h3>
          <span className="text-[10px] font-black text-blue-500 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">5 Repayments Due</span>
        </div>

        <div 
          onClick={() => onNavigate(ViewType.AGENT_DAILY_COLLECTIONS)}
          className="bg-indigo-600 rounded-[2rem] p-5 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-between group cursor-pointer animate-in zoom-in-95 duration-500 relative overflow-hidden mb-3"
        >
            <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            <div className="flex items-center gap-3 relative z-10">
                <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon name="handshake" className="text-white" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100">Daily Collection Goal</h4>
                    <p className="text-sm font-black leading-tight">₦42,000 pending across 8 shops</p>
                </div>
            </div>
            <Icon name="chevron_right" className="relative z-10 group-hover:translate-x-1 transition-transform" />
        </div>
      </section>

      {/* Onboarding Funnel (Relevant for Agents) */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-800 dark:text-white">Recruitment Pipeline</h3>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full uppercase">8 Pending KYC</span>
          </div>

          <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 group">
                  <div className="size-10 rounded-full bg-amber-500 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                      <Icon name="person_add" className="text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-800 dark:text-white truncate">Chinedu Okeke (New Store)</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Shop details submitted. Requires physical address verification.</p>
                      <div className="flex gap-2 mt-4">
                        <button className="flex-1 py-2 rounded-xl bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">Verify Shop</button>
                        <button className="flex-1 py-2 rounded-xl bg-white dark:bg-slate-800 text-amber-500 border border-amber-100 dark:border-amber-900 text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">Call Trader</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Recent Field Commissions */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Earnings Pulse</h3>
            <button className="text-[10px] font-black text-emerald-600 uppercase">View Report</button>
        </div>
        
        <div className="space-y-3">
            {agentProfile.activities.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm group hover:border-emerald-200 transition-colors">
                    <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 shadow-inner">
                        <Icon name={item.type === 'commission' ? 'monetization_on' : 'edit_document'} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-slate-800 dark:text-white truncate">{item.title}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">{item.date} • {item.description}</p>
                    </div>
                    <div className="text-right">
                        <span className={`text-sm font-black ${item.amount > 0 ? 'text-emerald-500' : 'text-slate-800 dark:text-white'}`}>
                            {item.amount > 0 ? '+' : ''}₦{Math.abs(item.amount).toLocaleString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
