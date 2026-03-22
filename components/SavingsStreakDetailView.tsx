
import React from 'react';
import { Icon } from './Icon';

interface SavingsStreakDetailViewProps {
  onBack: () => void;
}

export const SavingsStreakDetailView: React.FC<SavingsStreakDetailViewProps> = ({ onBack }) => {
  const days = [
    { label: 'Mo', checked: true },
    { label: 'Tu', checked: true },
    { label: 'We', checked: true },
    { label: 'Th', checked: true, current: true },
    { label: 'Fr', checked: false },
    { label: 'Sa', checked: false },
    { label: 'Su', checked: false },
  ];

  return (
    <div className="fixed inset-0 z-[60] bg-background-dark flex flex-col animate-in slide-in-from-bottom duration-500 overflow-y-auto">
      {/* Top Header */}
      <header className="flex items-center justify-between p-6 sticky top-0 bg-background-dark/90 backdrop-blur-md z-10">
        <button 
          onClick={onBack}
          className="size-10 rounded-full bg-slate-900 flex items-center justify-center text-white"
        >
          <Icon name="arrow_back" />
        </button>
        <div className="flex items-center gap-4 text-white font-bold">
           <Icon name="chevron_left" className="text-slate-500" />
           <span className="text-base">Today</span>
           <Icon name="chevron_right" className="text-slate-500" />
        </div>
        <button className="size-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
          <Icon name="settings" />
        </button>
      </header>

      <div className="flex-1 px-6 space-y-8 pb-10">
        {/* Days Row */}
        <div className="flex justify-between items-center px-2">
            {days.map((day) => (
                <div key={day.label} className="flex flex-col items-center gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{day.label}</span>
                    <div className={`size-10 rounded-full flex items-center justify-center transition-all ${
                        day.checked 
                            ? 'bg-slate-800' 
                            : day.current 
                                ? 'bg-primary' 
                                : 'bg-slate-900 border border-slate-800'
                    }`}>
                        {day.checked && <Icon name="check" className="text-white text-sm" />}
                        {day.current && !day.checked && <div className="size-2 rounded-full bg-white" />}
                        {!day.current && !day.checked && <div className="size-2 rounded-full bg-slate-800" />}
                    </div>
                </div>
            ))}
        </div>

        {/* Score Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-[2.5rem] p-6 flex items-center gap-6 border border-emerald-500/10 shadow-lg">
            <div className="relative size-24 shrink-0">
                <svg className="size-full" viewBox="0 0 100 100">
                    <circle 
                        className="text-emerald-500/10" 
                        strokeWidth="8" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="42" 
                        cx="50" 
                        cy="50" 
                    />
                    <circle 
                        className="text-primary" 
                        strokeWidth="8" 
                        strokeDasharray="263.89" 
                        strokeDashoffset="65.97" 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="42" 
                        cx="50" 
                        cy="50" 
                        style={{ transformOrigin: 'center', transform: 'rotate(-90deg)' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-800 dark:text-white leading-none">84</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Score</span>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Excellent consistency!</h3>
                <p className="text-primary font-bold text-sm mb-1">142 Days Streak!</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">You're ₦2,137 away from hitting your monthly reward.</p>
            </div>
        </div>

        {/* Budget Status Range */}
        <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800">
            <div className="flex items-center gap-5">
                <div className="relative w-20 h-10 bg-slate-800 rounded-full overflow-hidden shrink-0">
                    <div className="absolute inset-y-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-500 opacity-60"></div>
                    <div 
                        className="absolute top-1/2 -translate-y-1/2 size-8 bg-white rounded-full shadow-2xl border-4 border-slate-900 transition-all duration-1000"
                        style={{ left: '20%' }}
                    ></div>
                </div>
                <p className="text-sm font-medium text-slate-300">
                    Your spending is <span className="text-white font-bold">well within budget</span> for this period.
                </p>
            </div>
        </div>

        {/* Savings Performance */}
        <div className="space-y-4">
            <div className="flex justify-between items-end">
                <h3 className="text-lg font-bold text-white">Savings Velocity</h3>
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">9.2</span>
                    <span className="text-xs font-bold text-emerald-500 flex items-center">
                        <Icon name="arrow_drop_up" /> 12%
                    </span>
                </div>
            </div>

            {/* Simulated Vertical Bar Chart */}
            <div className="flex items-end justify-between h-12 gap-1 px-1">
                {Array.from({ length: 40 }).map((_, i) => {
                    const height = Math.random() * 80 + 20;
                    const isFocus = i > 25 && i < 28;
                    return (
                        <div 
                            key={i} 
                            className={`flex-1 rounded-full ${isFocus ? 'bg-primary' : 'bg-slate-800'}`}
                            style={{ height: isFocus ? '100%' : `${height}%` }}
                        />
                    );
                })}
            </div>

            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase tracking-widest px-1">
                <span>V. Low</span>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
            </div>
        </div>

        {/* Grid Metrics */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 rounded-[2rem] p-5 border border-slate-800 flex flex-col gap-4">
                <div className="size-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Icon name="water_drop" className="text-lg" />
                </div>
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">₦5.8k</span>
                        <span className="text-xs text-slate-500">/ 8k</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Goal Saved</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-5 border border-slate-800 flex flex-col gap-4">
                <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon name="bolt" className="text-lg" />
                </div>
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">₦210</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Daily Avg</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-5 border border-slate-800 flex flex-col gap-4">
                <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Icon name="trending_up" className="text-lg" />
                </div>
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">₦840</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Interest</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-5 border border-slate-800 flex flex-col gap-4">
                <div className="size-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Icon name="bedtime" className="text-lg" />
                </div>
                <div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-white">3.2m</span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Safety Net</p>
                </div>
            </div>
        </div>

        {/* Sync Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 border border-slate-800 flex items-center justify-between group cursor-pointer hover:bg-slate-800/80 transition-colors">
            <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0">
                    <div className="relative">
                        <div className="size-8 rounded bg-primary animate-pulse"></div>
                        <Icon name="sync" className="absolute inset-0 flex items-center justify-center text-white" />
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-bold text-white">Optimize your savings</h4>
                    <p className="text-sm text-slate-500">Connect your bank for automated tracking.</p>
                </div>
            </div>
            <div className="size-10 rounded-full bg-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Icon name="arrow_forward" />
            </div>
        </div>
      </div>
    </div>
  );
};
