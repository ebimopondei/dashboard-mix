
import React, { useState } from 'react';
import { Icon } from './Icon';

interface ReferralProgramViewProps {
  onBack: () => void;
}

export const ReferralProgramView: React.FC<ReferralProgramViewProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = "ALEX2023";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-transparent z-10">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
      </header>

      {/* Hero Section */}
      <div className="bg-primary pt-20 pb-12 px-6 -mt-[72px] text-center text-white rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 size-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 size-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10">
            <div className="size-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Icon name="card_giftcard" className="text-5xl" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Refer & Earn ₦50</h1>
            <p className="text-white/80 max-w-xs mx-auto text-sm leading-relaxed">
                Invite your friends to join the platform. You'll both get ₦50 when they invest their first ₦500.
            </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 -mt-8 relative z-20 pb-10">
        {/* Code Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700 text-center mb-6">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Your Referral Code</p>
            <div 
                onClick={handleCopy}
                className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 rounded-xl p-2 pl-4 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-900/80 transition-colors group"
            >
                <span className="font-mono text-xl font-bold text-slate-800 dark:text-white tracking-widest">{referralCode}</span>
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-sm text-primary group-hover:scale-105 transition-transform">
                    <Icon name={copied ? "check" : "content_copy"} />
                </div>
            </div>
            {copied && <p className="text-xs text-emerald-500 font-bold mt-2 animate-in fade-in">Copied to clipboard!</p>}
            
            <button className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-[0.98]">
                Share Link
            </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                <p className="text-3xl font-bold text-slate-800 dark:text-white mb-1">12</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Friends Invited</p>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
                <p className="text-3xl font-bold text-emerald-500 mb-1">₦350</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Total Earned</p>
            </div>
        </div>

        {/* Recent Referrals */}
        <div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 px-1">Recent Referrals</h3>
            <div className="space-y-3">
                {[
                    { name: "Sarah M.", date: "Today", status: "Pending", reward: "₦50" },
                    { name: "Mike T.", date: "Yesterday", status: "Completed", reward: "₦50" },
                    { name: "Jessica R.", date: "Sep 28", status: "Completed", reward: "₦50" },
                ].map((ref, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-500">
                                {ref.name[0]}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm">{ref.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Invited {ref.date}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className={`text-sm font-bold ${ref.status === 'Completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                +{ref.reward}
                             </p>
                             <p className="text-[10px] font-medium text-slate-400 uppercase">{ref.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};