
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { MOCK_PAYMENT_METHODS } from '../constants';

interface CreateSavingsPlanViewProps {
  onBack: () => void;
}

export const CreateSavingsPlanView: React.FC<CreateSavingsPlanViewProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [liquidity, setLiquidity] = useState<'Locked' | 'Partial' | 'Flexible'>('Locked');
  const [interestPayout, setInterestPayout] = useState<'Maturity' | 'Upfront'>('Maturity');
  const [tenor, setTenor] = useState(90);
  const [frequency, setFrequency] = useState('Weekly');
  const [targetAmount, setTargetAmount] = useState('');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [selectedCardId, setSelectedCardId] = useState<string>('');

  // Reset interest payout preference if liquidity is not locked
  useEffect(() => {
    if (liquidity !== 'Locked') {
        setInterestPayout('Maturity');
    }
  }, [liquidity]);

  // Set default card if available
  useEffect(() => {
      const cards = MOCK_PAYMENT_METHODS.filter(pm => pm.type === 'card');
      if (cards.length > 0 && !selectedCardId) {
          setSelectedCardId(cards[0].id);
      }
  }, []);

  const getInterestRate = (days: number, liq: string) => {
      let base = 8;
      if (days >= 90) base += 2;
      if (days >= 180) base += 2;
      if (liq === 'Locked') base += 2;
      if (liq === 'Flexible') base -= 4;
      return Math.max(1, base);
  };

  const currentRate = getInterestRate(tenor, liquidity);
  const calculatedInterest = ((Number(targetAmount) || 0) * (currentRate/100) * (tenor/365));

  const availableCards = MOCK_PAYMENT_METHODS.filter(pm => pm.type === 'card');

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          Create Savings Plan
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
                {/* Plan Name & Target */}
                <section>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Plan Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. New Shop Rent" 
                        className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-lg font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </section>

                <section>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Target Amount</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">₦</span>
                        <input 
                            type="number" 
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-2xl font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </section>

                {/* Tenor Selection */}
                <section>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Duration (Tenor)</label>
                    <div className="grid grid-cols-3 gap-3">
                        {[30, 90, 180, 360].map(d => (
                            <button 
                                key={d}
                                onClick={() => setTenor(d)}
                                className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                                    tenor === d 
                                    ? 'bg-emerald-500 text-white border-emerald-500' 
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                {d} Days
                            </button>
                        ))}
                    </div>
                </section>

                {/* Liquidity Type */}
                <section>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Liquidity Preference</label>
                    <div className="space-y-3">
                        {[
                            { id: 'Locked', label: 'Strict Locked', desc: 'No withdrawal until maturity. Highest Rate.' },
                            { id: 'Partial', label: 'Partial Access', desc: 'Withdraw 20% anytime. Medium Rate.' },
                            { id: 'Flexible', label: 'Flexible', desc: 'Withdraw anytime. Lower Rate.' },
                        ].map((opt) => (
                            <div 
                                key={opt.id}
                                onClick={() => setLiquidity(opt.id as any)}
                                className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                    liquidity === opt.id 
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500' 
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                                }`}
                            >
                                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${liquidity === opt.id ? 'border-emerald-500' : 'border-slate-300'}`}>
                                    {liquidity === opt.id && <div className="size-2.5 rounded-full bg-emerald-500" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{opt.label}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{opt.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Interest Payout Option - Only for Locked */}
                {liquidity === 'Locked' && (
                    <section className="animate-in fade-in slide-in-from-top-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">Interest Payout Method</label>
                        <div className="grid grid-cols-2 gap-3">
                            <div 
                                onClick={() => setInterestPayout('Upfront')}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                    interestPayout === 'Upfront'
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-slate-800 dark:text-white text-sm">Upfront</span>
                                    {interestPayout === 'Upfront' && <Icon name="check_circle" className="text-emerald-500 text-sm" />}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Withdraw interest now. Base savings locked.</p>
                            </div>

                            <div 
                                onClick={() => setInterestPayout('Maturity')}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                    interestPayout === 'Maturity'
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-slate-800 dark:text-white text-sm">Maturity</span>
                                    {interestPayout === 'Maturity' && <Icon name="check_circle" className="text-emerald-500 text-sm" />}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">Paid at end of tenure. Base savings locked.</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Rate Preview */}
                <div className="bg-slate-900 text-white p-5 rounded-xl shadow-lg flex justify-between items-center">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Interest Rate</p>
                        <p className="text-3xl font-bold text-emerald-400">{currentRate}% <span className="text-sm text-white font-normal">P.A.</span></p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                            {interestPayout === 'Upfront' && liquidity === 'Locked' ? 'Instant Interest' : 'Est. Return'}
                        </p>
                        <p className="text-xl font-bold">₦{calculatedInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        {interestPayout === 'Upfront' && liquidity === 'Locked' && (
                            <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-400 mt-1">
                                <Icon name="bolt" className="text-xs" />
                                <span>Paid to Wallet Instantly</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
                {/* Funding Config */}
                 <section>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Contribution Frequency</label>
                    <div className="grid grid-cols-2 gap-3">
                        {['Daily', 'Weekly', 'Monthly', 'Market Day'].map(f => (
                            <button 
                                key={f}
                                onClick={() => setFrequency(f)}
                                className={`py-3 rounded-xl font-bold text-sm border transition-all ${
                                    frequency === f
                                    ? 'bg-indigo-600 text-white border-indigo-600' 
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Payment Method</label>
                    <div className="space-y-3">
                         {/* Wallet Option */}
                         <div 
                             onClick={() => setPaymentMethod('wallet')}
                             className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                 paymentMethod === 'wallet' 
                                 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-500' 
                                 : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                             }`}
                         >
                             <div className="flex items-center gap-3">
                                 <Icon name="account_balance_wallet" className="text-slate-500" />
                                 <div>
                                     <span className="font-bold text-slate-800 dark:text-white block text-sm">Wallet Balance</span>
                                     <span className="text-[10px] text-slate-500">Available: ₦3,400,520.00</span>
                                 </div>
                             </div>
                             <div className={`size-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-emerald-500' : 'border-slate-300'}`}>
                                 {paymentMethod === 'wallet' && <div className="size-2.5 rounded-full bg-emerald-500" />}
                             </div>
                         </div>

                         {/* Card Option */}
                         <div 
                             onClick={() => setPaymentMethod('card')}
                             className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                 paymentMethod === 'card' 
                                 ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-500' 
                                 : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300'
                             }`}
                         >
                             <div className="flex items-center gap-3">
                                 <Icon name="credit_card" className="text-slate-500" />
                                 <span className="font-bold text-slate-800 dark:text-white text-sm">Debit Card</span>
                             </div>
                             <div className={`size-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-emerald-500' : 'border-slate-300'}`}>
                                 {paymentMethod === 'card' && <div className="size-2.5 rounded-full bg-emerald-500" />}
                             </div>
                         </div>

                         {/* Card Selection Dropdown */}
                         {paymentMethod === 'card' && (
                            <div className="pl-4 ml-4 border-l-2 border-slate-200 dark:border-slate-700 space-y-2 animate-in slide-in-from-top-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                {availableCards.length > 0 ? (
                                    availableCards.map(card => (
                                        <div 
                                            key={card.id}
                                            onClick={() => setSelectedCardId(card.id)}
                                            className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${
                                                selectedCardId === card.id
                                                ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                                            }`}
                                        >
                                            <Icon name={card.icon} />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold">{card.name}</p>
                                                <p className="text-[10px] opacity-80">{card.mask}</p>
                                            </div>
                                            {selectedCardId === card.id && <Icon name="check_circle" className="text-emerald-400 dark:text-emerald-600" />}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 italic p-2">No cards available.</p>
                                )}
                                <button className="flex items-center gap-2 text-xs font-bold text-primary px-2 py-2 hover:bg-primary/5 rounded-lg w-full transition-colors">
                                    <Icon name="add" className="text-sm" /> Add New Card
                                </button>
                            </div>
                         )}
                    </div>
                </section>
                
                {/* Confirmation Summary for Upfront Interest */}
                {interestPayout === 'Upfront' && liquidity === 'Locked' ? (
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                        <div className="flex items-start gap-3">
                            <div className="bg-emerald-500/20 p-1.5 rounded-full">
                                <Icon name="verified" className="text-emerald-600 dark:text-emerald-400 text-lg" />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-emerald-900 dark:text-emerald-100 mb-1">Upfront Interest Activated</p>
                                <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                                    You will receive <span className="font-bold">₦{calculatedInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> in your wallet immediately after creating this plan.
                                    <br/><br/>
                                    <span className="opacity-80">Note: Your base savings of ₦{Number(targetAmount).toLocaleString()} will be locked for {tenor} days.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <section className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-100 dark:border-amber-500/20">
                        <div className="flex items-start gap-3">
                            <Icon name="info" className="text-amber-600 mt-1" />
                            <div>
                                <p className="font-bold text-sm text-amber-900 dark:text-amber-100 mb-1">Auto-Save Enabled</p>
                                <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                    We will automatically deduct ₦{(Number(targetAmount) / (tenor / (frequency === 'Daily' ? 1 : frequency === 'Weekly' ? 7 : 30))).toLocaleString(undefined, { maximumFractionDigits: 0 })} {frequency.toLowerCase()} from your wallet.
                                </p>
                            </div>
                        </div>
                    </section>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                    <Icon name="lock" className="text-sm" />
                    <span>Your plan is secured by bank-grade encryption</span>
                </div>
            </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50">
        <div className="max-w-md mx-auto flex gap-4">
             {step === 2 && (
                 <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                 >
                     Back
                 </button>
             )}
             <button 
                onClick={() => step === 1 ? setStep(2) : onBack()}
                className="flex-[2] py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-600 transition-colors"
             >
                 {step === 1 ? 'Next Step' : 'Confirm Plan'}
             </button>
        </div>
      </div>
    </div>
  );
};
