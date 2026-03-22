
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';

interface SavingsStreakProps {
  streakDays?: number;
  currentProgress?: number;
  targetProgress?: number;
  completedDays?: string[]; // e.g. ['Mon', 'Tue', 'Wed']
  onClick?: () => void;
}

export const SavingsStreak: React.FC<SavingsStreakProps> = ({
  streakDays = 142,
  currentProgress = 5863,
  targetProgress = 8000,
  completedDays = ['Mon', 'Tue', 'Wed'],
  onClick
}) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const progressPercent = Math.min(100, (currentProgress / targetProgress) * 100);

  useEffect(() => {
    // Small delay to ensure the mount animation is visible
    const timer = setTimeout(() => {
      setAnimatedWidth(progressPercent);
    }, 100);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  return (
    <div 
      onClick={onClick}
      className={`w-full bg-black rounded-[2rem] p-4 shadow-2xl border border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}`}
    >
      <div className="flex gap-4 items-center">
        {/* Left Side: Fire Icon & Streak */}
        <div className="flex flex-col items-center justify-center p-3 bg-slate-900/50 rounded-2xl min-w-[90px] border border-white/5">
          <div className="relative mb-2">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-40 rounded-full animate-pulse"></div>
            <div className="relative size-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <Icon name="local_fire_department" className="text-white text-xl" />
            </div>
          </div>
          <div className="text-center">
            <h4 className="text-lg font-extrabold text-white tracking-tight">{streakDays} days</h4>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Savings streak</p>
          </div>
        </div>

        {/* Right Side: Progress & Days */}
        <div className="flex-1 space-y-3">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-white">{currentProgress.toLocaleString()}</span>
              <span className="text-[10px] font-medium text-slate-600">/ {targetProgress.toLocaleString()}</span>
            </div>
            
            <div className="relative w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              {/* Glowing progress bar */}
              <div 
                className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-all duration-[1500ms] ease-out"
                style={{ width: `${animatedWidth}%` }}
              ></div>
            </div>
          </div>

          {/* Days Row - Reduced size to prevent overlap */}
          <div className="flex justify-between items-center px-0.5">
            {days.map((day) => {
              const isCompleted = completedDays.includes(day);
              return (
                <div key={day} className="flex flex-col items-center gap-1">
                  <div className={`size-5 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-md scale-110' 
                      : 'bg-slate-800/80 border border-white/5'
                  }`}>
                    {isCompleted && <Icon name="check" className="text-white text-[10px] font-bold" />}
                  </div>
                  <span className={`text-[8px] font-bold uppercase ${isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
