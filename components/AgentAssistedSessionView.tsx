
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { ManagedTrader, AgentProfile } from '../types';

interface AgentAssistedSessionViewProps {
  trader: ManagedTrader;
  agent: AgentProfile;
  onBack: () => void;
}

type SessionStep = 'AUTH' | 'DASHBOARD' | 'ACTION_FORM' | 'APPROVAL' | 'SUCCESS';
type ActionType = 'REPAYMENT' | 'ESUSU' | 'SAVINGS' | 'WITHDRAWAL';

export const AgentAssistedSessionView: React.FC<AgentAssistedSessionViewProps> = ({ trader, agent, onBack }) => {
  const [step, setStep] = useState<SessionStep>('AUTH');
  const [authMethod, setAuthMethod] = useState<'QR' | 'PIN'>('QR');
  const [pin, setPin] = useState('');
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const [amount, setAmount] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [withdrawalReason, setWithdrawalReason] = useState('Business Expansion');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEligibleForLoan, setIsEligibleForLoan] = useState(false);
  
  // Mock data for calculation
  const dailyInstallment = 1800;
  const esusuBase = 500;

  // Simulation for QR scanning and backend check
  useEffect(() => {
    if (step === 'AUTH' && authMethod === 'QR') {
        const timer = setTimeout(() => {
            setStep('DASHBOARD');
            setIsEligibleForLoan(Math.random() > 0.3);
        }, 3000);
        return () => clearTimeout(timer);
    }
  }, [step, authMethod]);

  // Update amount when number of days changes for repayment or esusu
  useEffect(() => {
    if (selectedAction === 'REPAYMENT') {
        setAmount((dailyInstallment * numberOfDays).toString());
    } else if (selectedAction === 'ESUSU') {
        setAmount((esusuBase * numberOfDays).toString());
    }
  }, [numberOfDays, selectedAction]);

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setTimeout(() => {
            setStep('DASHBOARD');
            setIsEligibleForLoan(true);
        }, 500);
      }
    }
  };

  const startAction = (type: ActionType) => {
      setSelectedAction(type);
      setStep('ACTION_FORM');
      setNumberOfDays(1);
      if (type === 'REPAYMENT') {
          setAmount(dailyInstallment.toString());
      } else if (type === 'ESUSU') {
          setAmount(esusuBase.toString());
      } else {
          setAmount('');
      }
  };

  const requestApproval = () => {
      setStep('APPROVAL');
  };

  const finalizeTransaction = () => {
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          setStep('SUCCESS');
      }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden text-white">
      
      {/* Dynamic Header */}
      <header className="flex items-center justify-between p-4 bg-slate-900/50 backdrop-blur-md border-b border-white/5 shrink-0 z-50">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90 transition-transform">
                <Icon name="close" />
            </button>
            <div>
                <h1 className="text-white font-black text-sm uppercase tracking-widest">{step === 'AUTH' ? 'Secure Login' : 'Assisted Mode'}</h1>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
                    <Icon name="verified_user" className="text-[10px]" />
                    Session: {trader.name}
                </p>
            </div>
        </div>
        {step !== 'AUTH' && (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-emerald-400">Live Sync</span>
                </div>
            </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        
        {step === 'AUTH' && (
            <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] text-center animate-in fade-in duration-500">
                <div className="size-24 rounded-[2rem] bg-emerald-600 flex items-center justify-center text-white mb-8 shadow-2xl shadow-emerald-500/20">
                    <Icon name="lock_person" className="text-5xl" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">Trader Validation</h2>
                <p className="text-slate-400 text-sm mb-10 max-w-xs leading-relaxed">Scan the trader's physical card QR or have them enter their private PIN to unlock this surrogate session.</p>

                {authMethod === 'QR' ? (
                    <div className="space-y-8 w-full max-w-xs">
                        <div className="aspect-square bg-slate-900 rounded-[3.5rem] border-2 border-emerald-500/30 p-8 flex flex-col items-center justify-center relative overflow-hidden group shadow-[inset_0_0_40px_rgba(16,185,129,0.1)]">
                            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                            <Icon name="qr_code_scanner" className="text-7xl text-emerald-500 mb-4 animate-bounce" />
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Scanning Card...</span>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-emerald-500 shadow-[0_0_15px_#10B981] animate-scan-line" />
                        </div>
                        <button onClick={() => setAuthMethod('PIN')} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">Use PIN Code Instead</button>
                    </div>
                ) : (
                    <div className="space-y-8 w-full max-w-xs">
                        <div className="flex justify-center gap-4">
                            {[0, 1, 2, 3].map(i => (
                                <div key={i} className={`size-4 rounded-full border-2 transition-all ${pin.length > i ? 'bg-emerald-500 border-emerald-500 scale-125 shadow-[0_0_10px_#10B981]' : 'border-slate-800'}`} />
                            ))}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {['1','2','3','4','5','6','7','8','9','','0','back'].map((k, i) => (
                                <button 
                                    key={i} 
                                    onClick={() => k === 'back' ? setPin(prev => prev.slice(0, -1)) : k && handlePinDigit(k)}
                                    className={`size-16 rounded-3xl flex items-center justify-center font-black text-xl transition-all active:scale-90 ${k === '' ? 'invisible' : 'bg-white/5 text-white hover:bg-white/10 border border-white/5'}`}
                                >
                                    {k === 'back' ? <Icon name="backspace" /> : k}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setAuthMethod('QR')} className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-white transition-colors">Back to QR Scanner</button>
                    </div>
                )}
            </div>
        )}

        {step === 'DASHBOARD' && (
            <div className="p-6 space-y-6 animate-in slide-in-from-bottom duration-500">
                {/* Eligibility Toast */}
                {isEligibleForLoan && (
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-5 text-white flex items-center justify-between shadow-2xl animate-in bounce duration-1000 border border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                                <Icon name="rocket_launch" />
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-100">Top-Up Eligible</p>
                                <p className="text-sm font-black leading-tight">₦15,000 Offer Active</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-white text-emerald-700 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Claim</button>
                    </div>
                )}

                {/* Surrogate Hub Terminal */}
                <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Icon name="terminal" className="text-[12rem]" /></div>
                    
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="size-14 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shadow-inner">
                                <Icon name="person" className="text-3xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight">{trader.businessName}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Surrogate Vault</span>
                                    <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                                </div>
                            </div>
                        </div>
                        <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
                            <Icon name="settings_remote" />
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 gap-6">
                        {/* Interactive Metric Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 group hover:border-emerald-500/40 transition-colors">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Loan Balance</p>
                                <p className="text-2xl font-black text-white mb-3">₦12,400</p>
                                <button 
                                    onClick={() => startAction('REPAYMENT')}
                                    className="w-full py-2.5 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all"
                                >
                                    Log Repay
                                </button>
                            </div>
                            <div className="bg-white/5 p-5 rounded-[2rem] border border-white/5 group hover:border-amber-500/40 transition-colors">
                                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Esusu Purse</p>
                                <p className="text-2xl font-black text-white mb-3">₦8,500</p>
                                <button 
                                    onClick={() => startAction('ESUSU')}
                                    className="w-full py-2.5 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all"
                                >
                                    Daily Entry
                                </button>
                            </div>
                        </div>

                        {/* Full Width Savings Area */}
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Personal Savings Pool</p>
                                    <p className="text-3xl font-black text-white leading-none">₦45,000</p>
                                </div>
                                <Icon name="savings" className="text-4xl text-slate-700" />
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => startAction('SAVINGS')}
                                    className="flex-1 py-3.5 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all"
                                >
                                    + Add Funds
                                </button>
                                <button 
                                    onClick={() => startAction('WITHDRAWAL')}
                                    className="flex-1 py-3.5 bg-rose-500/10 text-rose-500 border border-rose-500/30 text-[10px] font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all"
                                >
                                    Request Payout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Terminal Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="p-5 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3 group active:scale-95 transition-all">
                        <div className="size-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <Icon name="history" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">Audit Log</span>
                    </button>
                    
                    <button className="p-5 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-center gap-3 group active:scale-95 transition-all">
                        <div className="size-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all">
                            <Icon name="badge" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">KYC Profile</span>
                    </button>
                </div>

                <div className="p-6 bg-blue-500/10 rounded-[2.5rem] border border-blue-500/20 flex gap-4">
                    <Icon name="info" className="text-blue-400 shrink-0" />
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">
                        Surrogate sessions are encrypted and logged with GPS coordinates. Ensure you update the trader's physical card for their records after each transaction.
                    </p>
                </div>
            </div>
        )}

        {step === 'ACTION_FORM' && (
            <div className="p-6 space-y-8 animate-in slide-in-from-right duration-400 pb-32">
                <div className="text-center pt-8">
                    <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${selectedAction === 'WITHDRAWAL' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {selectedAction === 'WITHDRAWAL' ? 'Initiating Payout' : 'Terminal Entry'}
                    </p>
                    <h2 className="text-4xl font-black text-white tracking-tighter">{selectedAction?.replace('_', ' ')}</h2>
                </div>

                {/* Special UI for Repayment: Show mandatory amount and day selection */}
                {(selectedAction === 'REPAYMENT' || selectedAction === 'ESUSU') ? (
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-[2rem] border border-white/5 p-6 text-center animate-in zoom-in-95">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                                {selectedAction === 'REPAYMENT' ? 'Standard Installment' : 'Standard Contribution'}
                            </p>
                            <p className="text-4xl font-black text-white">₦{(selectedAction === 'REPAYMENT' ? dailyInstallment : esusuBase).toLocaleString()}</p>
                            <p className="text-[9px] font-black text-slate-600 uppercase mt-1 tracking-tighter">Per Operating Day</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-4 block">Select Repayment Tenor</label>
                            <div className="grid grid-cols-4 gap-3 px-2">
                                {[1, 2, 3, 7].map(day => (
                                    <button 
                                        key={day}
                                        onClick={() => setNumberOfDays(day)}
                                        className={`py-5 rounded-[1.5rem] flex flex-col items-center justify-center transition-all border-2 ${numberOfDays === day ? 'bg-emerald-600 border-emerald-400 text-white shadow-xl scale-110' : 'bg-white/5 text-slate-500 border-white/5'}`}
                                    >
                                        <span className="text-lg font-black">{day}</span>
                                        <span className="text-[7px] font-black uppercase tracking-tighter">{day === 1 ? 'Day' : day === 7 ? 'Week' : 'Days'}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="relative pt-4">
                             <div className="absolute inset-0 flex items-center">
                                 <div className="w-full border-t border-white/10" />
                             </div>
                             <div className="relative flex justify-center">
                                 <span className="bg-slate-950 px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Total Collection</span>
                             </div>
                        </div>

                        <div className="text-center">
                             <h3 className="text-6xl font-black text-emerald-500 tracking-tighter">₦{Number(amount).toLocaleString()}</h3>
                             <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">Locked Terminal Entry</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">
                                {selectedAction === 'WITHDRAWAL' ? 'Request Amount (₦)' : 'Amount to Record (₦)'}
                            </label>
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-slate-700">₦</span>
                                <input 
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className={`w-full text-center py-10 bg-white/[0.03] border-none rounded-[3rem] text-6xl font-black text-white outline-none focus:ring-2 ${selectedAction === 'WITHDRAWAL' ? 'focus:ring-rose-500' : 'focus:ring-emerald-500'} shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]`}
                                    placeholder="0"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {selectedAction === 'WITHDRAWAL' && (
                            <div className="space-y-3 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Withdrawal Purpose</label>
                                <div className="grid grid-cols-2 gap-3 px-2">
                                    {['Inventory', 'Emergency', 'Shop Rent', 'Personal'].map(reason => (
                                        <button 
                                            key={reason}
                                            onClick={() => setWithdrawalReason(reason)}
                                            className={`py-4 rounded-[1.5rem] text-[10px] font-black uppercase border transition-all ${withdrawalReason === reason ? 'bg-rose-600 text-white border-rose-600 shadow-xl scale-105' : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'}`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className={`p-6 rounded-[2.5rem] border flex gap-5 ${selectedAction === 'WITHDRAWAL' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                    <div className={`size-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-2xl ${selectedAction === 'WITHDRAWAL' ? 'bg-rose-500' : 'bg-emerald-500'}`}>
                        <Icon name={selectedAction === 'WITHDRAWAL' ? "outbox" : "history_edu"} className="text-2xl" />
                    </div>
                    <div>
                        <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${selectedAction === 'WITHDRAWAL' ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {selectedAction === 'WITHDRAWAL' ? 'Compliance Protocol' : 'Analog Synchronization'}
                        </h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-bold">
                            {selectedAction === 'WITHDRAWAL' 
                                ? 'Authorize the liquid release of capital. Verification receipt will be generated for physical card stamping.' 
                                : 'Once committed, the digital ledger updates instantly. Ensure the physical record matches this input.'}
                        </p>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-8 bg-slate-950 border-t border-white/5 z-50 shadow-2xl">
                    <button 
                        onClick={requestApproval}
                        disabled={!amount || Number(amount) <= 0}
                        className={`w-full py-5 text-white font-black uppercase text-xs tracking-[0.5em] rounded-[2.5rem] shadow-2xl active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 ${selectedAction === 'WITHDRAWAL' ? 'bg-rose-600' : 'bg-emerald-600'}`}
                    >
                        <span>{selectedAction === 'WITHDRAWAL' ? 'Verify Payout' : 'Authorize Entry'}</span>
                        <Icon name="arrow_forward" />
                    </button>
                </div>
            </div>
        )}

        {step === 'APPROVAL' && (
            <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] text-center animate-in zoom-in-95 duration-400">
                <div className={`size-32 rounded-[2.5rem] border-4 flex items-center justify-center relative mb-12 ${selectedAction === 'WITHDRAWAL' ? 'border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.3)]' : 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.3)]'}`}>
                    <div className={`absolute inset-0 animate-ping rounded-[2.5rem] ${selectedAction === 'WITHDRAWAL' ? 'bg-rose-500/20' : 'bg-emerald-500/20'}`} />
                    <Icon name="fingerprint" className={`text-6xl ${selectedAction === 'WITHDRAWAL' ? 'text-rose-500' : 'text-emerald-500'}`} />
                </div>
                
                <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Trader Confirmation</h2>
                <p className="text-slate-400 text-base mb-2">Please hand the device to <span className="text-white font-black underline underline-offset-4 decoration-emerald-500">{trader.name}</span>.</p>
                <p className="text-sm text-slate-500 mb-12 max-w-xs leading-relaxed font-bold">
                    {selectedAction === 'WITHDRAWAL' 
                        ? `Confirm the withdrawal of ₦${Number(amount).toLocaleString()} from your vault. This will be logged on your physical card.`
                        : `Confirm the deposit of ₦${Number(amount).toLocaleString()} (${numberOfDays} ${numberOfDays === 1 ? 'day' : 'days'}) with Agent ${agent.name}. This syncs your physical and digital ledger.`
                    }
                </p>

                <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 mb-12 shadow-2xl">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entry Type</span>
                        <span className="text-sm font-black text-white uppercase tracking-tighter">{selectedAction}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Surrogate Entry</span>
                        <span className={`text-3xl font-black tracking-tighter ${selectedAction === 'WITHDRAWAL' ? 'text-rose-500' : 'text-emerald-500'}`}>₦{Number(amount).toLocaleString()}</span>
                    </div>
                </div>

                <div className="w-full max-w-sm space-y-4">
                    <button 
                        onClick={finalizeTransaction}
                        disabled={isProcessing}
                        className="w-full py-5 bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.5em] rounded-[2.5rem] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {isProcessing ? <span className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm & Sync'}
                    </button>
                    <button 
                        onClick={() => setStep('ACTION_FORM')}
                        className="w-full py-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] hover:text-white transition-colors"
                    >
                        Decline or Edit
                    </button>
                </div>
            </div>
        )}

        {step === 'SUCCESS' && (
            <div className="p-8 flex flex-col items-center justify-center min-h-[80vh] text-center animate-in zoom-in duration-500">
                <div className={`size-28 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl ${selectedAction === 'WITHDRAWAL' ? 'bg-rose-500 shadow-rose-500/30' : 'bg-emerald-500 shadow-emerald-500/30'}`}>
                    <Icon name={selectedAction === 'WITHDRAWAL' ? "payments" : "task_alt"} className="text-6xl text-white" />
                </div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tighter leading-none">
                    {selectedAction === 'WITHDRAWAL' ? 'PAYOUT SUCCESS' : 'LEDGER SYNCED'}
                </h2>
                <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-12 ${selectedAction === 'WITHDRAWAL' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedAction === 'WITHDRAWAL' ? 'Transaction Finalized' : 'Digital Record Minted'}
                </p>

                <div className="w-full max-w-sm bg-white p-10 rounded-[3rem] text-slate-900 space-y-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] border-4 relative transition-colors duration-500 border-emerald-500">
                     <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-lg">Verification</div>
                     
                     <div className="space-y-1">
                        <h3 className="font-black text-2xl tracking-tighter">Analog Update</h3>
                        <p className="text-xs text-slate-500 font-bold">Write these codes on the physical card:</p>
                     </div>
                     
                     <div className="bg-slate-50 rounded-[2rem] p-6 border-2 border-dashed border-slate-200 text-left space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Session Date</span>
                            <span className="text-sm font-black text-slate-800">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry Ref</span>
                            <span className="text-[11px] font-mono font-black text-slate-800 uppercase tracking-widest">SY-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verification ID</span>
                                <span className="text-[12px] font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase tracking-widest">TX-{Math.random().toString(36).substring(7).toUpperCase()}</span>
                            </div>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 justify-center">
                         <Icon name="check_circle" className="text-emerald-500" />
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Authorized by biometric surrogate</p>
                     </div>
                </div>

                <button 
                    onClick={() => setStep('DASHBOARD')}
                    className="w-full max-w-sm mt-12 py-5 bg-white text-slate-950 font-black uppercase text-xs tracking-[0.5em] rounded-[2.5rem] shadow-2xl active:scale-95 transition-all"
                >
                    Back to Surrogate
                </button>
            </div>
        )}

      </div>

      <style>{`
        @keyframes scan-line {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
        }
        .animate-scan-line {
            animation: scan-line 3s infinite ease-in-out;
        }
        @keyframes tada {
            0% { transform: scale(1); }
            10%, 20% { transform: scale(0.9) rotate(-3deg); }
            30%, 50%, 70%, 90% { transform: scale(1.1) rotate(3deg); }
            40%, 60%, 80% { transform: scale(1.1) rotate(-3deg); }
            100% { transform: scale(1) rotate(0); }
        }
        .animate-tada {
            animation: tada 1s infinite;
        }
      `}</style>
    </div>
  );
};
