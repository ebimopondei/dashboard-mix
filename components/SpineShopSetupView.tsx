
import React, { useState } from 'react';
import { Icon } from './Icon';

interface SpineShopSetupViewProps {
  onComplete: () => void;
}

export const SpineShopSetupView: React.FC<SpineShopSetupViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [shopName, setShopName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { id: 'textiles', label: 'Fabrics & Textiles', icon: 'apparel' },
    { id: 'electronics', label: 'Tech & Gadgets', icon: 'devices' },
    { id: 'groceries', label: 'Daily Provisions', icon: 'local_mall' },
    { id: 'hardware', label: 'Tools & Hardware', icon: 'construction' },
    { id: 'beauty', label: 'Health & Beauty', icon: 'face_retouching_natural' },
    { id: 'produce', label: 'Fresh Produce', icon: 'eco' }
  ];

  const handleFinish = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col p-6 animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full pb-12 pt-8">
        
        {/* Step Indicator */}
        <div className="flex gap-2 mb-12 justify-center">
            {[1, 2, 3].map(s => (
                <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-primary' : 'w-4 bg-slate-800'}`} />
            ))}
        </div>

        {step === 1 && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center">
              <div className="size-24 rounded-[2.5rem] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/20">
                <Icon name="storefront" className="text-6xl" />
              </div>
              <h1 className="text-4xl font-black text-white mb-3 tracking-tighter leading-none">Spine Module.</h1>
              <p className="text-slate-400 text-sm max-w-[280px] mx-auto leading-relaxed">
                Activate the business operating system used by Africa's fastest growing traders.
              </p>
            </div>

            <div className="space-y-4">
                {[
                    { icon: 'inventory_2', label: 'Visual Inventory', sub: 'Track stock piece-by-piece' },
                    { icon: 'trending_up', label: 'Credit History', sub: 'Automate loan eligibility data' },
                    { icon: 'bolt', label: 'Slash E-commerce', sub: 'Sell to global customers instantly' }
                ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Icon name={feature.icon} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-white leading-none mb-1">{feature.label}</p>
                            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{feature.sub}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            <button 
                onClick={() => setStep(2)} 
                className="w-full py-5 bg-white text-slate-950 font-black uppercase text-xs tracking-[0.4em] rounded-[2rem] shadow-2xl active:scale-95 transition-all mt-6"
            >
              Begin Setup
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in slide-in-from-right duration-400">
            <div className="text-left space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">Identity & Niche</h2>
                <p className="text-slate-400 text-sm">How should we label your business vault?</p>
            </div>

            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Business Trading Name</label>
                    <input 
                        type="text" 
                        value={shopName}
                        onChange={(e) => setShopName(e.target.value)}
                        placeholder="e.g. Adebayo Textiles" 
                        className="w-full p-5 bg-white/5 border border-white/10 rounded-3xl text-lg font-black text-white outline-none focus:ring-2 focus:ring-primary shadow-inner"
                        autoFocus
                    />
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Product Specialty</label>
                    <div className="grid grid-cols-2 gap-3">
                        {categories.map(c => (
                        <button 
                            key={c.id} 
                            onClick={() => setSelectedCategory(c.id)}
                            className={`p-5 rounded-3xl border flex flex-col items-center gap-2 transition-all active:scale-95 ${
                                selectedCategory === c.id 
                                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-105' 
                                    : 'bg-white/5 border-white/5 text-slate-500 hover:border-white/20'
                            }`}
                        >
                            <Icon name={c.icon} className="text-2xl" />
                            <span className="text-[9px] font-black uppercase tracking-tighter text-center">{c.label}</span>
                        </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="flex gap-3 mt-4 pt-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 text-xs font-black text-slate-600 uppercase tracking-widest">Back</button>
                <button 
                    onClick={() => setStep(3)} 
                    disabled={!shopName || !selectedCategory}
                    className="flex-[2] py-4 bg-primary text-white font-black uppercase text-xs tracking-[0.4em] rounded-[2rem] shadow-xl disabled:opacity-50 disabled:grayscale transition-all"
                >
                    Continue
                </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10 animate-in slide-in-from-right duration-400">
             <div className="text-left space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tighter">Final Sync</h2>
                <p className="text-slate-400 text-sm">Review your Spine operating preferences.</p>
            </div>

            <div className="space-y-4">
                <div className="bg-slate-900 rounded-[2.5rem] p-6 border border-white/10 space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Ledger</span>
                        <span className="text-xs font-black text-emerald-500 uppercase">Automated</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Analytics Basis</span>
                        <span className="text-xs font-black text-white uppercase">Accrual</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Slash Integration</span>
                        <span className="text-xs font-black text-white uppercase">Ready</span>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Icon name="language" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase">Interface Language</p>
                                <p className="text-sm font-black text-white">English (Default)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-blue-500/10 rounded-[2rem] border border-blue-500/20 flex gap-4">
                    <Icon name="verified" className="text-blue-500 text-2xl" />
                    <div>
                        <h4 className="font-black text-white text-sm">System Ready</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-tighter mt-1">
                            Your Spine vault is calibrated. All sales records contribute to your global credit score.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <button 
                    onClick={handleFinish} 
                    className="w-full py-5 bg-emerald-600 text-white font-black uppercase text-xs tracking-[0.4em] rounded-[2rem] shadow-2xl active:scale-95 transition-all shadow-emerald-500/20"
                >
                    Launch Spine
                </button>
                <button onClick={() => setStep(2)} className="w-full py-3 text-slate-600 font-black uppercase text-[10px] tracking-widest">
                    Edit Details
                </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto text-center pb-8 opacity-30">
          <p className="text-[8px] font-black text-white uppercase tracking-[0.5em]">Powered by Mix Spine OS v2.4</p>
      </div>
    </div>
  );
};
