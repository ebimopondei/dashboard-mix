
import React from 'react';
import { Collection } from '../types';
import { Icon } from './Icon';

interface ClusterCardProps {
  cluster: Collection; // Re-using props name to minimize file rename friction, but type is Collection
  onClick?: () => void;
}

export const ClusterCard: React.FC<ClusterCardProps> = ({ cluster: collection, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col gap-4 rounded-xl p-4 bg-white dark:bg-slate-800/50 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-[0.99]"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg size-10 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Icon name={collection.iconName} />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{collection.name}</p>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <Icon name="location_on" className="text-[14px]" />
              <p className="text-sm">{collection.location}, {collection.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
        {collection.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 py-2">
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Up to</p>
          <p className="text-lg font-bold text-primary">{collection.maxReturn}% Return</p>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Min Investment</p>
          <p className="text-lg font-bold text-slate-800 dark:text-white">₦{collection.minInvestment.toLocaleString()}</p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 pt-3">
        <span>{collection.totalInvestors} Active Investors</span>
        <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <span>View 3 Cycles</span>
            <Icon name="arrow_forward" className="text-sm" />
        </div>
      </div>
    </div>
  );
};
