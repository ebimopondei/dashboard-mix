
import React from 'react';
import { Icon } from './Icon';
import { IMPACT_STATS } from '../constants';

interface ImpactProfileViewProps {
  onBack: () => void;
}

export const ImpactProfileView: React.FC<ImpactProfileViewProps> = ({ onBack }) => {
  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">
          My Impact
        </h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="share" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-20">
        
        {/* World Map Visualization Mock */}
        <div className="relative h-64 bg-slate-900 overflow-hidden">
             {/* Abstract Map Dots */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             
             {/* Nigeria Pin */}
             <div className="absolute top-[40%] left-[55%] flex flex-col items-center animate-bounce duration-1000">
                 <div className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 shadow-lg shadow-emerald-500/50">Lagos</div>
                 <div className="size-3 bg-emerald-500 rounded-full ring-4 ring-emerald-500/30"></div>
             </div>

             {/* Ghana Pin */}
             <div className="absolute top-[38%] left-[48%] flex flex-col items-center">
                 <div className="size-2 bg-blue-500 rounded-full ring-4 ring-blue-500/30 animate-pulse"></div>
             </div>

             <div className="absolute bottom-4 left-4 right-4">
                 <h2 className="text-white font-bold text-xl">Your Footprint</h2>
                 <p className="text-slate-400 text-xs">You are financing growth in 2 countries.</p>
             </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-4 -mt-6 relative z-10">
            {IMPACT_STATS.map((stat) => (
                <div key={stat.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-lg">
                    <div className={`size-10 rounded-lg ${stat.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                        <Icon name={stat.icon} />
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">{stat.label}</p>
                </div>
            ))}
        </div>

        {/* Stories */}
        <div className="px-4 py-2 space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white">Impact Stories</h3>
            
            <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <div className="size-16 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 overflow-hidden">
                     <img src="https://picsum.photos/seed/farmer/200/200" alt="Farmer" className="w-full h-full object-cover" />
                 </div>
                 <div>
                     <h4 className="font-bold text-slate-800 dark:text-white text-sm">Empowering Local Farmers</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                         Your investment in Kano Rice Mills helped purchase 3 new tractors, increasing harvest efficiency by 40%.
                     </p>
                 </div>
            </div>

            <div className="flex gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">
                 <div className="size-16 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0 overflow-hidden">
                     <img src="https://picsum.photos/seed/tech/200/200" alt="Tech" className="w-full h-full object-cover" />
                 </div>
                 <div>
                     <h4 className="font-bold text-slate-800 dark:text-white text-sm">Tech Talent Growth</h4>
                     <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                         Computer Village Hub funds supported the training of 15 new mobile technicians this quarter.
                     </p>
                 </div>
            </div>
        </div>

        {/* Badge */}
        <div className="mx-4 my-6 p-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl text-center text-white shadow-lg relative overflow-hidden">
            <Icon name="eco" className="text-9xl absolute -bottom-4 -right-4 opacity-20" />
            <div className="relative z-10">
                <p className="text-sm font-bold uppercase tracking-widest mb-2 opacity-80">Badge Earned</p>
                <h3 className="text-2xl font-bold mb-2">Sustainable Investor</h3>
                <p className="text-sm opacity-90 max-w-xs mx-auto">
                    You belong to the top 10% of contributors to sustainable agriculture in West Africa.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};