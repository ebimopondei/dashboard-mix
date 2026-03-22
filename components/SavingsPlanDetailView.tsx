
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { SavingsPlan } from '../types';
import { MOCK_PAYMENT_METHODS } from '../constants';

interface SavingsPlanDetailViewProps {
  plan: SavingsPlan;
  onBack: () => void;
}

export const SavingsPlanDetailView: React.FC<SavingsPlanDetailViewProps> = ({ plan, onBack }) => {
  const [showAgentCode, setShowAgentCode] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  
  // Top Up State
  const [topUpAmount, setTopUpAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const progress = Math.min(100, Math.round((plan.balance / plan.targetAmount) * 100));
  const cards = MOCK_PAYMENT_METHODS.filter(pm => pm.type === 'card');

  // Set default card
  useEffect(() => {
      if (cards.length > 0 && !selectedCardId) {
          setSelectedCardId(cards[0].id);
      }
  }, [cards, selectedCardId]);

  const handleTopUp = (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      // Simulate API call
      setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
      }, 2000);
  };

  const closeTopUp = () => {
      setShowTopUpModal(false);
      setIsSuccess(false);
      setTopUpAmount('');
      setIsProcessing(false);
  };

  if (showAgentCode) {
      return (
          <div className="fixed inset-0 z-[70] bg-slate-900 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-300">
              <div className="bg-white rounded-3xl p-8 w-full max-w-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Agent Deposit</h2>
                  <p className="text-slate-500 text-sm mb-6">Show this code to a registered Mix Agent to deposit cash instantly.</p>
                  
                  <div className="bg-slate-100 rounded-xl p-6 mb-6">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">YOUR CODE</p>
                      <p className="text-4xl font-mono font-bold text-slate-900 tracking-widest">849 201</p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6">
                      <Icon name="timer" />
                      <span>Code expires in 15:00</span>
                  </div>

                  <button 
                    onClick={() => setShowAgentCode(false)}
                    className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold"
                  >
                      Close
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          {plan.name}
        </h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="more_vert" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
         {/* Main Card */}
         <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl mb-6">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Icon name="lock" className="text-9xl" />
              </div>
              <div className="relative z-10 text-center">
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Current Balance</p>
                  <h1 className="text-4xl font-extrabold mb-4">₦{plan.balance.toLocaleString()}</h1>
                  
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5">
                      <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-emerald-400">{progress}% Reached</span>
                          <span className="text-slate-300">Target: ₦{plan.targetAmount.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-black/30 rounded-full h-3">
                          <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>
                  </div>
              </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-3 mb-6">
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Interest Rate</p>
                 <p className="text-xl font-bold text-slate-800 dark:text-white">{plan.interestRate}% P.A.</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Maturity</p>
                 <p className="text-xl font-bold text-slate-800 dark:text-white">{plan.maturityDate}</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Next Deposit</p>
                 <p className="text-lg font-bold text-slate-800 dark:text-white">{plan.nextDepositDate}</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Status</p>
                 <p className="text-lg font-bold text-emerald-500">{plan.status}</p>
             </div>
         </div>

         {/* Actions */}
         <div className="space-y-3 mb-6">
             <button 
                onClick={() => setShowTopUpModal(true)}
                className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
             >
                 <Icon name="add_card" />
                 <span>Top Up with Card / Wallet</span>
             </button>
             
             <button 
                onClick={() => setShowAgentCode(true)}
                className="w-full py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold border border-slate-200 dark:border-slate-700 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
             >
                 <Icon name="store" />
                 <span>Deposit via Agent</span>
             </button>

             {plan.liquidityType !== 'Locked' && (
                 <button className="w-full py-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
                    <Icon name="arrow_upward" />
                    <span>Withdraw Funds</span>
                 </button>
             )}
         </div>

         {/* Transaction Mini-feed */}
         <div>
             <h3 className="font-bold text-slate-800 dark:text-white mb-3">Recent Contributions</h3>
             <div className="space-y-3">
                 {[1, 2].map((i) => (
                     <div key={i} className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                         <div className="flex items-center gap-3">
                             <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                 <Icon name="arrow_downward" className="text-sm" />
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-slate-800 dark:text-white">Auto-Deposit</p>
                                 <p className="text-[10px] text-slate-500">Oct 12, 2023</p>
                             </div>
                         </div>
                         <span className="font-bold text-emerald-500">+₦5,000</span>
                     </div>
                 ))}
             </div>
         </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={closeTopUp} />
              
              <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                  {!isSuccess ? (
                      <form onSubmit={handleTopUp} className="space-y-6">
                          <div className="flex items-center justify-between">
                              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Top Up Plan</h3>
                              <button type="button" onClick={closeTopUp} className="p-2 -mr-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                                  <Icon name="close" />
                              </button>
                          </div>

                          {/* Amount */}
                          <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Amount to Add</label>
                              <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₦</span>
                                  <input
                                      type="number"
                                      value={topUpAmount}
                                      onChange={(e) => setTopUpAmount(e.target.value)}
                                      placeholder="0.00"
                                      className="w-full pl-10 pr-4 py-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-3xl font-bold text-slate-800 dark:text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                      autoFocus
                                  />
                              </div>
                          </div>

                          {/* Source */}
                          <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Payment Source</label>
                              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                                  <button
                                      type="button"
                                      onClick={() => setPaymentMethod('wallet')}
                                      className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                                          paymentMethod === 'wallet' 
                                          ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' 
                                          : 'text-slate-500 dark:text-slate-400'
                                      }`}
                                  >
                                      Wallet
                                  </button>
                                  <button
                                      type="button"
                                      onClick={() => setPaymentMethod('card')}
                                      className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                                          paymentMethod === 'card' 
                                          ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white' 
                                          : 'text-slate-500 dark:text-slate-400'
                                      }`}
                                  >
                                      Card
                                  </button>
                              </div>

                              {paymentMethod === 'wallet' ? (
                                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                          <Icon name="account_balance_wallet" className="text-slate-400" />
                                          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Available Balance</span>
                                      </div>
                                      <span className="font-bold text-slate-800 dark:text-white">₦3,400,520</span>
                                  </div>
                              ) : (
                                  <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                      {cards.map(card => (
                                          <div 
                                              key={card.id}
                                              onClick={() => setSelectedCardId(card.id)}
                                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                                  selectedCardId === card.id
                                                  ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-transparent'
                                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                                              }`}
                                          >
                                              <div className="flex items-center gap-3">
                                                  <Icon name={card.icon} />
                                                  <div className="text-left">
                                                      <p className="text-sm font-bold">{card.name}</p>
                                                      <p className="text-[10px] opacity-80">{card.mask}</p>
                                                  </div>
                                              </div>
                                              {selectedCardId === card.id && <Icon name="check_circle" className="text-emerald-400 dark:text-emerald-600" />}
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>

                          <button
                              type="submit"
                              disabled={!topUpAmount || isProcessing}
                              className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              {isProcessing ? (
                                  <span className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                  `Confirm ₦${Number(topUpAmount).toLocaleString()}`
                              )}
                          </button>
                      </form>
                  ) : (
                      <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                          <div className="size-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-6">
                              <Icon name="check" className="text-4xl" />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Funds Added!</h3>
                          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[200px]">
                              You have successfully added ₦{Number(topUpAmount).toLocaleString()} to {plan.name}.
                          </p>
                          <button 
                              onClick={closeTopUp}
                              className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl"
                          >
                              Done
                          </button>
                      </div>
                  )}
                  <div className="h-6 sm:hidden" />
              </div>
          </div>
      )}
    </div>
  );
};
