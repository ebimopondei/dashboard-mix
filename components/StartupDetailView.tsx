
import React, { useState } from 'react';
import { StartupPitch, Investment } from '../types';
import { Icon } from './Icon';
import { MOCK_PAYMENT_METHODS } from '../constants';

interface StartupDetailViewProps {
  startup: StartupPitch;
  onBack: () => void;
  onAddInvestment?: (investment: Investment, pMethod: 'wallet' | 'card') => void;
  userBalance: number;
}

type Tab = 'pitch' | 'equity' | 'founder' | 'q&a';
type FlowStep = 'view' | 'payment' | 'processing' | 'success';

export const StartupDetailView: React.FC<StartupDetailViewProps> = ({ startup, onBack, onAddInvestment, userBalance }) => {
  const [activeTab, setActiveTab] = useState<Tab>('pitch');
  const [flowStep, setFlowStep] = useState<FlowStep>('view');
  const [investAmount, setInvestAmount] = useState<string>('10000');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [error, setError] = useState<string | null>(null);

  const fundingProgress = Math.round((startup.raisedAmount / startup.targetFunding) * 100);
  const calculatedEquity = ((Number(investAmount) || 0) / (startup.valuation || (startup.targetFunding * (100 / startup.equityOffered)))) * 100;

  const tabs: {id: Tab, label: string, icon: string}[] = [
      { id: 'pitch', label: 'Pitch Deck', icon: 'present_to_all' },
      { id: 'equity', label: 'Equity Model', icon: 'pie_chart' },
      { id: 'founder', label: 'Mission', icon: 'rocket_launch' },
      { id: 'q&a', label: 'Q&A', icon: 'forum' },
  ];

  const handleConfirmPurchase = () => {
    const amount = Number(investAmount);
    if (paymentMethod === 'wallet' && amount > userBalance) {
        setError("Insufficient wallet balance.");
        return;
    }
    
    setError(null);
    setFlowStep('processing');
    
    setTimeout(() => {
        if (onAddInvestment) {
            const newInvestment: Investment = {
                id: `INV-START-${Date.now()}`,
                name: startup.name,
                category: 'Startups',
                status: 'Active',
                investedAmount: amount,
                currentReturn: 0,
                progress: 100, 
                iconName: 'rocket_launch',
                cycleDuration: 'Venture Equity',
                startDate: 'Today',
                maturityDate: 'Exit Event',
                payoutDate: 'Dividends/Exit',
                equityOwned: calculatedEquity
            };
            onAddInvestment(newInvestment, paymentMethod);
        }
        setFlowStep('success');
    }, 2500);
  };

  if (flowStep === 'success') {
    return (
        <div className="fixed inset-0 z-[120] bg-background-light dark:bg-background-dark flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
            <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 shadow-2xl">
                <Icon name="rocket" className="text-5xl" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Investment Locked!</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
                You are now a shareholder in <span className="text-slate-900 dark:text-white font-bold">{startup.name}</span>. Welcome to the cap table!
            </p>
            
            <div className="w-full max-w-sm bg-slate-900 rounded-3xl p-6 text-white text-left mb-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Icon name="stars" className="text-7xl" /></div>
                <p className="text-[10px] font-black uppercase text-yellow-400 tracking-widest mb-4">Venture Stake Certificate</p>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Equity Stake</span>
                        <span className="text-xs font-black text-emerald-400">{calculatedEquity.toFixed(4)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">Token ID</span>
                        <span className="text-xs font-mono">#EQ-{startup.id.toUpperCase()}-MIX</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={onBack}
                className="w-full max-w-xs py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-lg"
            >
                View Cap Table
            </button>
        </div>
    );
  }

  if (flowStep === 'payment') {
      const cards = MOCK_PAYMENT_METHODS.filter(pm => pm.type === 'card');
      return (
          <div className="fixed inset-0 z-[110] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-bottom duration-500">
              <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light dark:bg-background-dark z-10 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => setFlowStep('view')} className="p-2 -ml-2 rounded-full text-slate-600 dark:text-slate-300">
                  <Icon name="arrow_back" className="text-2xl" />
                </button>
                <h1 className="text-lg font-bold flex-1 text-slate-800 dark:text-white">Equity Purchase</h1>
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <div className="text-center">
                      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Commitment</p>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white">₦{Number(investAmount).toLocaleString()}</h2>
                  </div>

                  <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Funding Source</p>
                      <div 
                        onClick={() => setPaymentMethod('wallet')}
                        className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${paymentMethod === 'wallet' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                        >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Icon name="account_balance_wallet" />
                            </div>
                            <span className="font-bold text-slate-800 dark:text-white">Wallet Balance</span>
                            </div>
                            {paymentMethod === 'wallet' && <Icon name="check_circle" className="text-primary" />}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 ml-13">Available: <span className="font-bold text-slate-700 dark:text-slate-200">₦{userBalance.toLocaleString()}</span></p>
                        {paymentMethod === 'wallet' && userBalance < Number(investAmount) && (
                            <p className="text-rose-500 text-[10px] font-bold mt-2 ml-13 flex items-center gap-1"><Icon name="error" className="text-xs" /> Insufficient funds</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        {cards.map(card => (
                            <div 
                                key={card.id}
                                onClick={() => { setPaymentMethod('card'); }}
                                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                                            <Icon name="credit_card" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800 dark:text-white">{card.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{card.mask}</p>
                                        </div>
                                    </div>
                                    {paymentMethod === 'card' && <Icon name="check_circle" className="text-primary" />}
                                </div>
                            </div>
                        ))}
                      </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4 shadow-xl border border-white/5">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-primary">
                          <span>Est. Equity Gain</span>
                          <span>{calculatedEquity.toFixed(4)}%</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed italic">
                        Startups carry high risk. You are purchasing private equity which may only be liquid upon an exit event or secondary listing.
                      </p>
                  </div>
              </div>

              <div className="p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                {error && <p className="text-rose-500 text-xs font-bold mb-4 text-center">{error}</p>}
                <button 
                  onClick={handleConfirmPurchase}
                  disabled={paymentMethod === 'wallet' && userBalance < Number(investAmount)}
                  className="w-full py-5 bg-primary text-white font-black uppercase tracking-[0.2em] rounded-[2rem] shadow-xl active:scale-95 transition-all"
                >
                  Buy Private Equity
                </button>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      {flowStep === 'processing' && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="size-20 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin mb-6" />
              <h3 className="text-xl font-bold text-white mb-2">Executing Cap Table Entry</h3>
              <p className="text-slate-400 text-sm">Securing your private equity shares...</p>
          </div>
      )}

      {/* Hero Image */}
      <div className="h-64 shrink-0 relative overflow-hidden">
          <img src={startup.imageUrl} alt={startup.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
          
          <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20">
            <button onClick={onBack} className="size-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform"><Icon name="arrow_back" /></button>
            <button className="size-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform"><Icon name="share" /></button>
          </header>

          <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-2">
                   {startup.tags.map(tag => (
                       <span key={tag} className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20 bg-primary/40">
                            {tag}
                       </span>
                   ))}
                   <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-md border border-white/20 bg-amber-500/40">
                        {startup.isStrictlyAfrica ? 'Strictly Africa' : 'Global'}
                   </span>
              </div>
              <h2 className="text-3xl font-black text-white leading-tight">{startup.name}</h2>
              <p className="text-slate-300 text-sm font-bold flex items-center gap-1">
                  <Icon name="person" className="text-xs" />
                  Founded by {startup.founder}
              </p>
          </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 py-2 gap-2 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}
              >
                  <Icon name={tab.icon} className="text-sm" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              </button>
          ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          
          {activeTab === 'pitch' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                      <h3 className="font-black text-lg">One Sentence Pitch</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                          "{startup.description}"
                      </p>
                  </div>

                  <div className="space-y-4">
                       <h3 className="font-black text-xs uppercase tracking-widest text-slate-400 ml-1">Presentation Slides</h3>
                       <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                           {[1,2,3,4].map(i => (
                               <div key={i} className="min-w-[280px] aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-white/5 relative group overflow-hidden">
                                   <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                   <Icon name="image" className="text-4xl text-slate-700 mb-2" />
                                   <p className="text-xs font-black uppercase tracking-widest text-slate-500">Slide {i}: Deep Dive Content</p>
                                   <div className="absolute bottom-4 right-4"><Icon name="zoom_in" className="text-primary opacity-0 group-hover:opacity-100" /></div>
                               </div>
                           ))}
                       </div>
                  </div>

                  <div className="space-y-3">
                      <h3 className="font-black text-lg">Founder Vision</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {startup.vision || "We're on a mission to democratize financial access for everyone across the continent using cutting-edge decentralized protocols."}
                      </p>
                  </div>
              </div>
          )}

          {activeTab === 'equity' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                       <div className="relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Venture Progress</p>
                            <div className="flex justify-between items-baseline mb-6">
                                <h2 className="text-4xl font-black">₦{startup.raisedAmount.toLocaleString()}</h2>
                                <p className="text-sm font-bold text-slate-400">of ₦{startup.targetFunding.toLocaleString()}</p>
                            </div>
                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
                                <div className="h-full bg-primary shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-1000" style={{ width: `${fundingProgress}%` }} />
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                <span className="text-emerald-400">{fundingProgress}% Funded</span>
                                <span className="text-slate-400">{100-fundingProgress}% Remaining</span>
                            </div>
                       </div>
                  </div>

                  <div className="space-y-4">
                       <h3 className="font-black text-lg">Investment Breakdown</h3>
                       <div className="grid gap-3">
                            {[
                                { label: 'Equity Pool Offered', value: `${startup.equityOffered}%`, icon: 'pie_chart' },
                                { label: 'Seed Valuation', value: `₦${(startup.targetFunding * (100 / startup.equityOffered)).toLocaleString()}`, icon: 'payments' },
                                { label: 'Minimum Stake', value: '₦10,000', icon: 'savings' },
                                { label: 'Instrument', value: 'Tokenized Safe', icon: 'description' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <Icon name={item.icon} className="text-slate-400 text-sm" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-800 dark:text-white">{item.value}</span>
                                </div>
                            ))}
                       </div>
                  </div>
              </div>
          )}

          {activeTab === 'founder' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col items-center text-center p-8 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                      <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-primary/20 mb-4 overflow-hidden">
                          <img src={`https://i.pravatar.cc/150?u=${startup.founder}`} alt={startup.founder} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="text-xl font-black">{startup.founder}</h3>
                      <p className="text-xs font-black text-primary uppercase tracking-widest mb-4">Founder & CEO</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          With over 12 years of experience in African logistics and fintech, {startup.founder.split(' ')[0]} has previously scaled two other ventures to profitability across 4 regions.
                      </p>
                      <div className="flex gap-4 mt-6">
                          <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"><Icon name="public" /></button>
                          <button className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300"><Icon name="alternate_email" /></button>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'q&a' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="p-6 bg-blue-50 dark:bg-blue-500/10 rounded-[2rem] border border-blue-100 dark:border-blue-500/20 text-center">
                        <Icon name="live_help" className="text-4xl text-blue-500 mb-2" />
                        <h4 className="font-bold text-sm mb-1">Investor Relations</h4>
                        <p className="text-xs text-slate-500">Ask the founders anything before committing capital.</p>
                        <button className="mt-4 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Start Thread</button>
                   </div>
              </div>
          )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 max-w-md mx-auto z-50">
          <div className="flex items-center gap-4">
               <div className="flex flex-col flex-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Your Investment</p>
                   <div className="relative">
                       <span className="absolute left-0 top-1/2 -translate-y-1/2 font-black text-slate-400">₦</span>
                       <input 
                        type="number"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        className="w-full pl-4 py-2 bg-transparent text-xl font-black text-slate-900 dark:text-white border-none focus:ring-0 outline-none"
                       />
                   </div>
               </div>
               
               <button 
                onClick={() => setFlowStep('payment')}
                className="flex-[2] py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                   <Icon name="rocket_launch" />
                   Invest in Equity
               </button>
          </div>
      </div>
    </div>
  );
};
