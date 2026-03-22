
import React, { useState, useEffect } from 'react';
import { Cluster, Collection, Investment } from '../types';
import { Icon } from './Icon';
import { MOCK_PAYMENT_METHODS } from '../constants';

interface ClusterCycleViewProps {
  cluster: Cluster;
  collection: Collection;
  onBack: () => void;
  onAddInvestment?: (investment: Investment, pMethod: 'wallet' | 'card') => void;
  userBalance: number;
}

type FlowStep = 'details' | 'amount' | 'payment' | 'processing' | 'success';

export const ClusterCycleView: React.FC<ClusterCycleViewProps> = ({ cluster, collection, onBack, onAddInvestment, userBalance }) => {
  const [investAmount, setInvestAmount] = useState<string>(cluster.minInvestment.toString());
  const [step, setStep] = useState<FlowStep>('details');
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet');
  const [selectedCardId, setSelectedCardId] = useState<string>('');

  const cards = MOCK_PAYMENT_METHODS.filter(pm => pm.type === 'card');

  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].id);
    }
  }, [cards, selectedCardId]);

  const estimatedReturn = Math.floor(
    parseInt(investAmount || '0') * (cluster.fixedReturn / 100)
  );

  const handleNextToPayment = () => {
    const amount = parseInt(investAmount);
    if (isNaN(amount) || amount < cluster.minInvestment) {
      setError(`Minimum investment for this cluster is ₦${cluster.minInvestment.toLocaleString()}`);
      return;
    }
    setError(null);
    setStep('payment');
  };

  const handleConfirmInvestment = () => {
    if (paymentMethod === 'wallet' && parseInt(investAmount) > userBalance) {
      setError("Insufficient wallet balance.");
      return;
    }
    setStep('processing');
    setTimeout(() => {
      if (onAddInvestment) {
        const newInvestment: Investment = {
            id: `INV-C-${Date.now()}`,
            name: collection.name,
            category: collection.category,
            status: 'Active',
            investedAmount: parseInt(investAmount),
            currentReturn: 0,
            progress: 0,
            iconName: collection.iconName,
            cycleDuration: `${cluster.durationDays} Days`,
            startDate: cluster.startDate,
            maturityDate: cluster.maturityDate,
            payoutDate: cluster.payoutDate
        };
        onAddInvestment(newInvestment, paymentMethod);
      }
      setStep('success');
    }, 2500);
  };

  // --- SUB-VIEWS ---

  const renderDetails = () => (
    <div className="flex flex-col animate-in fade-in duration-500 pb-32">
      {/* Immersive Header Card */}
      <div className="relative h-64 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
        <div className="absolute inset-0 opacity-30">
          <Icon name={collection.iconName} className="text-[200px] absolute -right-10 -top-10 rotate-12" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest">
              {cluster.status}
            </span>
            <span className="text-white/60 text-xs font-medium">• {collection.country}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">{cluster.durationDays} Days Liquidity Cycle</h1>
          <p className="text-slate-300 text-sm">{collection.name}</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-30">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Fixed Return</p>
            <p className="text-2xl font-bold text-emerald-500">{cluster.fixedReturn}%</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Min. Entry</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white">₦{cluster.minInvestment.toLocaleString()}</p>
          </div>
        </div>

        <div className="space-y-6">
          <section>
            <h3 className="font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
              <Icon name="info" className="text-primary" />
              Cycle Description
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              {cluster.description} This cycle supports localized commerce and inventory procurement, providing essential working capital to verified traders.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Icon name="event_repeat" className="text-primary" />
              Key Dates
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Investment Window Opens', date: 'Available Now', icon: 'door_open', active: true },
                { label: 'Capital Deployment', date: cluster.startDate, icon: 'rocket_launch', active: false },
                { label: 'Maturity & Payout', date: cluster.payoutDate, icon: 'payments', active: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`size-10 rounded-full flex items-center justify-center ${item.active ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                    <Icon name={item.icon} className="text-xl" />
                  </div>
                  <div className="flex-1 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50">
        <button 
          onClick={() => setStep('amount')}
          className="w-full max-w-md mx-auto py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Invest in this Cycle</span>
          <Icon name="arrow_forward" />
        </button>
      </div>
    </div>
  );

  const renderAmountEntry = () => (
    <div className="flex-1 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Enter Amount</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">How much would you like to invest in this cycle?</p>
      </div>

      <div className="space-y-8">
        <div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-slate-400">₦</span>
            <input 
              type="number"
              value={investAmount}
              onChange={(e) => setInvestAmount(e.target.value)}
              className={`w-full pl-12 pr-4 py-6 bg-slate-50 dark:bg-slate-800 rounded-2xl text-4xl font-bold text-slate-800 dark:text-white border-none focus:ring-2 transition-all ${error ? 'focus:ring-rose-500' : 'focus:ring-primary'}`}
              autoFocus
            />
          </div>
          {error && <p className="text-rose-500 text-xs font-bold mt-2 ml-1">{error}</p>}
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Estimated Return</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{cluster.fixedReturn}%</span>
          </div>
          <div className="flex justify-between items-baseline">
            <p className="text-xs text-emerald-700/60 dark:text-emerald-400/60">Payout in {cluster.durationDays} days</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">₦{estimatedReturn.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={handleNextToPayment}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg"
        >
          Next: Payment Method
        </button>
      </div>
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="flex-1 flex flex-col p-6 animate-in slide-in-from-right duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Select Payment</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Choose your preferred source of funds.</p>
      </div>

      <div className="space-y-4">
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
          {paymentMethod === 'wallet' && userBalance < parseInt(investAmount) && (
              <p className="text-rose-500 text-[10px] font-bold mt-2 ml-13 flex items-center gap-1"><Icon name="error" className="text-xs" /> Insufficient funds</p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Linked Cards</p>
          {cards.map(card => (
            <div 
              key={card.id}
              onClick={() => {
                setPaymentMethod('card');
                setSelectedCardId(card.id);
              }}
              className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${paymentMethod === 'card' && selectedCardId === card.id ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800'}`}
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
                {paymentMethod === 'card' && selectedCardId === card.id && <Icon name="check_circle" className="text-primary" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-8">
        {error && <p className="text-rose-500 text-xs font-bold mb-4">{error}</p>}
        <button 
          onClick={handleConfirmInvestment}
          disabled={paymentMethod === 'wallet' && userBalance < parseInt(investAmount)}
          className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 disabled:opacity-50 disabled:grayscale"
        >
          Confirm & Pay ₦{parseInt(investAmount).toLocaleString()}
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="size-24 rounded-full border-4 border-white/10 border-t-emerald-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon name="verified_user" className="text-4xl text-emerald-500 animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Processing Investment</h2>
      <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">
        Executing smart contract and securing your stake in <span className="text-white font-bold">{collection.name}</span>.
      </p>
    </div>
  );

  const renderSuccess = () => (
    <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark flex flex-col animate-in zoom-in-95 duration-500 overflow-y-auto">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="size-24 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-8 shadow-2xl">
          <Icon name="check_circle" className="text-6xl" />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Investment Active!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs leading-relaxed">
          Your digital certificate has been minted and added to your portfolio.
        </p>

        <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl p-6 space-y-4 mb-8">
           <div className="flex justify-between items-center pb-3 border-b border-slate-50 dark:border-slate-700/50">
              <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Stake Amount</span>
              <span className="text-xl font-bold text-slate-800 dark:text-white">₦{parseInt(investAmount).toLocaleString()}</span>
           </div>
           <div className="space-y-3 pt-2 text-left">
             <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-bold uppercase text-[10px]">Reference</span>
                <span className="text-xs font-mono text-slate-400 uppercase">#INV-{Math.random().toString(36).substring(7).toUpperCase()}</span>
             </div>
             <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500 font-bold uppercase text-[10px]">Payment</span>
                <span className="text-xs font-bold">{paymentMethod === 'wallet' ? 'Mix Wallet' : 'Linked Card'}</span>
             </div>
           </div>
        </div>

        <button 
          onClick={onBack}
          className="w-full max-w-sm py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-[0.98]"
        >
          View Portfolio
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      <header className={`flex items-center gap-4 p-4 sticky top-0 backdrop-blur-md z-[60] border-b transition-all duration-300 ${
        step === 'details' 
          ? 'bg-slate-900/10 border-transparent text-white' 
          : 'bg-background-light/95 dark:bg-background-dark/95 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white'
      }`}>
        <button 
          onClick={step === 'details' ? onBack : () => setStep('details')}
          className={`p-2 -ml-2 rounded-full transition-colors ${
            step === 'details' 
              ? 'bg-black/20 hover:bg-black/40 text-white' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Icon name={step === 'details' ? "arrow_back" : "close"} className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold truncate flex-1">
          {step === 'details' ? 'Pool Details' : step === 'amount' ? 'Invest Amount' : step === 'payment' ? 'Checkout' : ''}
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        {step === 'details' && renderDetails()}
        {step === 'amount' && renderAmountEntry()}
        {step === 'payment' && renderPaymentMethod()}
        {step === 'processing' && renderProcessing()}
        {step === 'success' && renderSuccess()}
      </div>
    </div>
  );
};
