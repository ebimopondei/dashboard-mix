
import React from 'react';
import { Icon } from './Icon';
import { NOTIFICATIONS } from '../constants';

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
      <div className="absolute top-16 right-4 z-50 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
          <button className="text-xs font-medium text-primary hover:underline">Mark all read</button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto">
          {NOTIFICATIONS.length > 0 ? (
            NOTIFICATIONS.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${!item.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}`}
              >
                <div className="flex gap-3">
                  <div className={`mt-1 size-2 rounded-full flex-shrink-0 ${item.type === 'success' ? 'bg-emerald-500' : item.type === 'alert' ? 'bg-rose-500' : 'bg-blue-500'}`} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-white leading-tight mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-2">{item.message}</p>
                    <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">No new notifications</p>
            </div>
          )}
        </div>
        
        <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <button className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white py-2 w-full">
            View Settings
          </button>
        </div>
      </div>
    </>
  );
};
