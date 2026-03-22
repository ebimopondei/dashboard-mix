
import React, { useState } from 'react';
import { Icon } from './Icon';
import { SpineActivity } from '../types';

interface SpineActivitiesViewProps {
  activities: SpineActivity[];
  onBack: () => void;
}

export const SpineActivitiesView: React.FC<SpineActivitiesViewProps> = ({ activities, onBack }) => {
  const [filter, setFilter] = useState<'all' | 'alert' | 'warning'>('all');

  const filteredActivities = activities.filter(a => {
    if (filter === 'all') return true;
    return a.severity === filter;
  });

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'product_added': return 'add_circle';
      case 'stock_update': return 'inventory';
      case 'price_change': return 'sell';
      case 'sale_recorded': return 'receipt_long';
      case 'sale_voided': return 'cancel';
      case 'shop_settings_update': return 'settings';
      default: return 'history';
    }
  };

  const getSeverityStyles = (severity: string) => {
    switch(severity) {
      case 'alert': return 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400';
      case 'warning': return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">System Logs</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="file_download" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pb-10">
        <div className="p-4 space-y-4">
          {/* Filters */}
          <div className="flex gap-2">
            {['all', 'alert', 'warning'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  filter === f 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' 
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id}
                className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden group"
              >
                <div className="flex gap-4">
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${getSeverityStyles(activity.severity)}`}>
                    <Icon name={getActionIcon(activity.action)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-black text-slate-800 dark:text-white capitalize">
                        {activity.action.replace(/_/g, ' ')}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{activity.timestamp}</span>
                    </div>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                      {activity.details}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <div className="size-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <Icon name="person" className="text-[10px] text-slate-400" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Performer: {activity.performer}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="py-20 text-center animate-in fade-in duration-300">
                <div className="size-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Icon name="history_toggle_off" className="text-4xl" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-bold">No activity logs found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
