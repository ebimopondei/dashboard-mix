import React from 'react';

export const StatsSection: React.FC = () => {
  return (
    <section className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-slate-800/50 shadow-sm border border-slate-100 dark:border-slate-700/50">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">
          Total Investment
        </p>
        <p className="text-slate-800 dark:text-white tracking-tight text-2xl font-bold leading-tight">
          ₦125,430
        </p>
      </div>
      <div className="flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-slate-800/50 shadow-sm border border-slate-100 dark:border-slate-700/50">
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">
          Total Earnings
        </p>
        <p className="text-slate-800 dark:text-white tracking-tight text-2xl font-bold leading-tight">
          ₦15,880
        </p>
      </div>
    </section>
  );
};