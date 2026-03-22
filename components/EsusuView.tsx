
import React from 'react';
import { Icon } from './Icon';
// Fix: Use the shared ESUSU_GROUPS defined in constants.ts
import { ESUSU_GROUPS } from '../constants';

interface EsusuViewProps {
  onBack: () => void;
}

export const EsusuView: React.FC<EsusuViewProps> = ({ onBack }) => {
  // Fix: Removed local redundant definition and assigned imported data
  const myGroups = ESUSU_GROUPS;

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
          Esusu Groups
        </h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="add" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Active Groups */}
        <section>
            <h2 className="font-bold text-slate-800 dark:text-white mb-4">My Active Circles</h2>
            <div className="space-y-4">
                {myGroups.map((group) => (
                    <div key={group.id} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Icon name="groups" className="text-8xl" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg">{group.name}</h3>
                                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white">{group.frequency} Contribution</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-indigo-200 uppercase font-bold">Payout</p>
                                    <p className="font-bold">{group.payoutDate}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-black/20 rounded-lg p-2">
                                    <p className="text-xs text-indigo-200">Contribution</p>
                                    <p className="font-bold text-lg">₦{group.contributionAmount.toLocaleString()}</p>
                                </div>
                                <div className="bg-black/20 rounded-lg p-2">
                                    <p className="text-xs text-indigo-200">My Savings</p>
                                    <p className="font-bold text-lg">₦{group.totalSaved.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-indigo-100 bg-white/10 p-2 rounded-lg">
                                <Icon name="info" className="text-sm" />
                                <span>You are number {group.myPosition} of {group.membersCount} to collect.</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Explore Public Groups */}
        <section>
            <h2 className="font-bold text-slate-800 dark:text-white mb-4">Explore New Groups</h2>
            <div className="space-y-3">
                 {[1, 2].map((i) => (
                     <div key={i} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                 <Icon name="savings" />
                             </div>
                             <div>
                                 <p className="font-bold text-slate-800 dark:text-white text-sm">Weekly Shop Owners</p>
                                 <p className="text-xs text-slate-500 dark:text-slate-400">₦200 / Weekly</p>
                             </div>
                         </div>
                         <button className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                             Join
                         </button>
                     </div>
                 ))}
            </div>
        </section>

      </div>
    </div>
  );
};
