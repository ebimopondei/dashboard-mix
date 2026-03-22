import React from 'react';
import { ViewType } from '../types';

interface SegmentedControlProps {
  currentView: ViewType;
  onChange: (view: ViewType) => void;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ currentView, onChange }) => {
  return (
    <section className="sticky top-[76px] z-10 py-2 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md -mx-4 px-4">
      <div className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800/80 p-1">
        <button
          onClick={() => onChange(ViewType.DASHBOARD)}
          className={`
            flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold leading-normal transition-all duration-200
            ${currentView === ViewType.DASHBOARD
              ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }
          `}
        >
          My Investments
        </button>
        <button
          onClick={() => onChange(ViewType.EXPLORE)}
          className={`
            flex h-full grow items-center justify-center rounded-lg px-2 text-sm font-semibold leading-normal transition-all duration-200
            ${currentView === ViewType.EXPLORE
              ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }
          `}
        >
          Explore Pools
        </button>
      </div>
    </section>
  );
};