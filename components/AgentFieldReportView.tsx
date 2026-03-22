
import React, { useState } from 'react';
import { Icon } from './Icon';

interface AgentFieldReportViewProps {
  onBack: () => void;
}

type VisitType = 'Routine' | 'Verification' | 'Collection' | 'Issue' | 'Loan Assessment';

export const AgentFieldReportView: React.FC<AgentFieldReportViewProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [visitType, setVisitType] = useState<VisitType>('Routine');
  const [traderName, setTraderName] = useState('');
  const [commentary, setCommentary] = useState('');

  // Objective-specific states
  const [collectionAmount, setCollectionAmount] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [issueCategory, setIssueCategory] = useState('Technical');
  const [stockValue, setStockValue] = useState('');
  const [dailySales, setDailySales] = useState('');
  const [traderMood, setTraderMood] = useState<'Positive' | 'Neutral' | 'Negative'>('Positive');

  const renderObjectiveFields = () => {
    switch (visitType) {
      case 'Verification':
        return (
          <section className="bg-emerald-50 dark:bg-emerald-500/5 p-6 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-500/20 space-y-5 animate-in slide-in-from-top-4 duration-500 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Icon name="fact_check" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600">Verification Checklist</h4>
            </div>
            <div className="space-y-3">
              {[
                'Confirmed physical business existence',
                'Matched trader ID with submitted docs',
                'Interviewed neighbouring traders',
                'Cross-referenced utility bill address'
              ].map((check, i) => (
                <label key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800/50 rounded-xl cursor-pointer active:scale-[0.98] transition-transform shadow-sm">
                  <input type="checkbox" className="size-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">{check}</span>
                </label>
              ))}
            </div>
          </section>
        );

      case 'Collection':
        return (
          <section className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <Icon name="payments" className="absolute -right-4 -bottom-4 text-8xl opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-4">Repayment Capture</p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest ml-1">Amount Collected (₦)</label>
                  <input
                    type="number"
                    value={collectionAmount}
                    onChange={(e) => setCollectionAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-xl font-black text-white outline-none focus:ring-2 focus:ring-white/50 placeholder-white/30"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest ml-1">Receipt / Ref Number</label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="MIX-XXXXXX"
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-2xl text-sm font-bold text-white outline-none focus:ring-2 focus:ring-white/50 placeholder-white/30 uppercase"
                  />
                </div>
              </div>
            </div>
          </section>
        );

      case 'Issue':
        return (
          <section className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            <div className="p-6 bg-rose-50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-500/20 space-y-4">
              <div className="flex items-center gap-3">
                <Icon name="report_problem" className="text-rose-500" />
                <h4 className="text-xs font-black uppercase tracking-widest text-rose-600">Dispute / Issue Type</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Technical', 'Financial', 'Personal', 'Stock Loss'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setIssueCategory(cat)}
                    className={`p-3 rounded-xl text-[10px] font-black uppercase transition-all border ${issueCategory === cat ? 'bg-rose-500 text-white border-rose-500 shadow-md' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-xl">
                <Icon name="priority_high" className="text-rose-500" />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Flag for Regional Manager Review</span>
                <div className="flex-1" />
                <input type="checkbox" className="size-5 rounded border-slate-300 text-rose-500 focus:ring-rose-500" />
              </div>
            </div>
          </section>
        );

      case 'Loan Assessment':
        return (
          <section className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600">
                  <Icon name="analytics" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-white">Business Valuation</h4>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Est. Current Stock Worth (₦)</label>
                  <input
                    type="number"
                    value={stockValue}
                    onChange={(e) => setStockValue(e.target.value)}
                    placeholder="Enter valuation"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-lg font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Observed Daily Sales (₦)</label>
                  <input
                    type="number"
                    value={dailySales}
                    onChange={(e) => setDailySales(e.target.value)}
                    placeholder="Observed traffic"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-lg font-black text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-500/5 rounded-2xl border border-purple-100 dark:border-purple-500/10">
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Recommended credit tier based on observed inventory: <b>Tier {Number(stockValue) > 500000 ? '3' : '2'}</b>
                </p>
              </div>
            </div>
          </section>
        );

      default: // Routine
        return (
          <section className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ml-1">Trader Sentiment</label>
                <div className="flex justify-between items-center px-4">
                  {[
                    { label: 'Negative', icon: 'mood_bad', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' },
                    { label: 'Neutral', icon: 'sentiment_neutral', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                    { label: 'Positive', icon: 'sentiment_satisfied', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                  ].map(mood => (
                    <button
                      key={mood.label}
                      onClick={() => setTraderMood(mood.label as any)}
                      className={`flex flex-col items-center gap-2 transition-all ${traderMood === mood.label ? 'scale-125' : 'opacity-40 grayscale'}`}
                    >
                      <div className={`size-14 rounded-full flex items-center justify-center ${traderMood === mood.label ? mood.bg : ''}`}>
                        <Icon name={mood.icon} className={`text-3xl ${mood.color}`} />
                      </div>
                      <span className={`text-[8px] font-black uppercase ${traderMood === mood.label ? mood.color : 'text-slate-400'}`}>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Shop Condition</label>
                <div className="flex gap-2">
                  {['Under-stocked', 'Messy', 'Organized', 'Expanding'].map(tag => (
                    <button key={tag} className="px-3 py-2 rounded-full border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="close" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1 text-center pr-8">
          Log Field Activity
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
         {step === 1 && (
             <div className="space-y-8 animate-in fade-in duration-300">
                 <section>
                     <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 block px-1">Primary Visit Objective</label>
                     <div className="grid grid-cols-2 gap-3">
                         {[
                            { label: 'Routine', icon: 'storefront', color: 'text-blue-500' },
                            { label: 'Verification', icon: 'verified_user', color: 'text-amber-500' },
                            { label: 'Collection', icon: 'payments', color: 'text-emerald-500' },
                            { label: 'Loan Assessment', icon: 'analytics', color: 'text-purple-500' },
                            { label: 'Issue', icon: 'report_problem', color: 'text-rose-500' },
                         ].map((v) => (
                            <button 
                                key={v.label}
                                onClick={() => setVisitType(v.label as any)}
                                className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all ${
                                    visitType === v.label 
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/20 scale-105' 
                                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 hover:border-emerald-200'
                                }`}
                            >
                                <Icon name={v.icon} className={`text-2xl mb-3 ${visitType === v.label ? 'text-white' : v.color}`} />
                                <span className="text-[9px] font-black uppercase tracking-tighter text-center">{v.label}</span>
                            </button>
                         ))}
                     </div>
                 </section>

                 <section className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block px-1">Target Trader</label>
                     <div className="relative">
                         <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                         <input 
                            type="text" 
                            placeholder="Find trader profile..." 
                            value={traderName}
                            onChange={(e) => setTraderName(e.target.value)}
                            className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-bold text-slate-800 dark:text-white shadow-sm"
                         />
                     </div>
                 </section>

                 <section className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block px-1">Initial Commentary</label>
                     <textarea 
                        rows={4} 
                        value={commentary}
                        onChange={(e) => setCommentary(e.target.value)}
                        placeholder="Log initial observations, trader concerns, or business environment..."
                        className="w-full p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-800 dark:text-white shadow-sm"
                     ></textarea>
                 </section>
             </div>
         )}

         {step === 2 && (
             <div className="space-y-8 animate-in slide-in-from-right duration-300">
                 {/* Visual Proof Section */}
                 <section className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block px-1">Evidence & Check-in</label>
                     
                     <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center gap-4 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 transition-colors cursor-pointer group shadow-inner">
                         <div className="size-16 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-md group-hover:scale-110 transition-transform">
                             <Icon name="add_a_photo" className="text-3xl" />
                         </div>
                         <div>
                             <p className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-[10px]">Capture Field Media</p>
                             <p className="text-[9px] text-slate-400 mt-1">Shop storefront, documents, or inventory</p>
                         </div>
                     </div>

                     <div className="flex items-center gap-4 p-5 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-3xl shadow-sm">
                         <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                             <Icon name="gps_fixed" />
                         </div>
                         <div>
                             <p className="text-sm font-black text-blue-900 dark:text-blue-100 leading-none mb-1">GPS Location Locked</p>
                             <p className="text-[10px] text-blue-700 dark:text-blue-400 uppercase font-black tracking-widest opacity-80">Accuracy: 3m • Within Shop Radius</p>
                         </div>
                     </div>
                 </section>

                 {/* Objective Specific Fields */}
                 <div className="pt-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block px-1 mb-4">Objective Details: {visitType}</label>
                    {renderObjectiveFields()}
                 </div>
             </div>
         )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 z-50">
        <div className="max-w-md mx-auto flex gap-4">
             {step === 2 && (
                 <button 
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl active:scale-95 transition-all shadow-sm"
                 >
                     Back
                 </button>
             )}
             <button 
                onClick={() => step === 1 ? setStep(2) : onBack()}
                disabled={step === 1 && !traderName}
                className="flex-[2] py-4 bg-emerald-600 text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
             >
                 <span>{step === 1 ? 'Next Step' : 'Submit Activity'}</span>
                 <Icon name={step === 1 ? "arrow_forward" : "done_all"} className="text-sm" />
             </button>
        </div>
      </div>
    </div>
  );
};
