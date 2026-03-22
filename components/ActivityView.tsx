
import React, { useState } from 'react';
import { Icon } from './Icon';
import { ACTIVITIES } from '../constants';
import { ActivityItem, ViewType } from '../types';

interface ActivityViewProps {
    onNavigate?: (view: ViewType, id?: string) => void;
    activities?: ActivityItem[];
    role?: 'investor' | 'trader' | 'agent';
}

export const ActivityView: React.FC<ActivityViewProps> = ({ onNavigate, activities, role = 'investor' }) => {
  const [filter, setFilter] = useState<'all' | 'wallet' | 'investment' | 'commissions'>('all');

  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'deposit': return { name: 'arrow_downward', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' };
      case 'withdrawal': return { name: 'arrow_upward', color: 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' };
      case 'investment': return { name: 'trending_up', color: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' };
      case 'payout': 
      case 'yield': return { name: 'monetization_on', color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' };
      case 'commission': return { name: 'military_tech', color: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' };
      case 'repayment': return { name: 'history_edu', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' };
      default: return { name: 'circle', color: 'bg-slate-100 text-slate-600' };
    }
  };

  const sourceActivities = activities || ACTIVITIES;

  const filteredActivities = sourceActivities.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'wallet') return item.type === 'deposit' || item.type === 'withdrawal';
    if (filter === 'investment') return item.type === 'investment' || item.type === 'payout' || item.type === 'yield';
    if (filter === 'commissions') return item.type === 'commission' || item.type === 'repayment';
    return true;
  });

  const filterOptions = role === 'agent' 
    ? ['all', 'wallet', 'commissions'] 
    : ['all', 'wallet', 'investment'];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-4">
      {/* Filter Tabs */}
      <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
              filter === f 
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Activity List */}
      <div className="flex flex-col gap-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((item) => {
            const icon = getIcon(item.type);
            const isPositive = item.amount > 0;

            return (
              <div 
                key={item.id} 
                onClick={() => onNavigate && onNavigate(ViewType.TRANSACTION_DETAIL, item.id)}
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${icon.color}`}>
                  <Icon name={icon.name} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 dark:text-white truncate pr-2 text-sm">{item.title}</h4>
                    <span className={`font-black whitespace-nowrap text-sm ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                      {isPositive ? '+' : ''}₦{Math.abs(item.amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-1">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate pr-2 uppercase">{item.description}</p>
                    <p className="text-[9px] font-bold text-slate-400 whitespace-nowrap uppercase">{item.date}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
           <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Icon name="history" className="text-3xl text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No transactions found</p>
            </div>
        )}
      </div>
    </div>
  );
};
