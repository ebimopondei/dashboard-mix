
import React, { useState } from 'react';
import { Icon } from './Icon';
import { SpineShop, ViewType } from '../types';

interface SpineManagementViewProps {
  shop: SpineShop;
  onBack: () => void;
}

export const SpineManagementView: React.FC<SpineManagementViewProps> = ({ shop, onBack }) => {
  const [activeTab, setActiveTab] = useState<'outlets' | 'team'>('outlets');

  return (
    <div className="fixed inset-0 z-[60] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-right duration-300">
      <header className="flex items-center gap-4 p-4 sticky top-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
          <Icon name="arrow_back" className="text-2xl" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white truncate flex-1">Shop Administration</h1>
      </header>

      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-background-light dark:bg-background-dark">
         <button 
            onClick={() => setActiveTab('outlets')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'outlets' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
         >
            Branches
         </button>
         <button 
            onClick={() => setActiveTab('team')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest border-b-2 transition-colors ${activeTab === 'team' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}
         >
            Team Members
         </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'outlets' ? (
            <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{shop.outlets.length} Active Outlets</p>
                    <button className="text-xs font-bold text-primary flex items-center gap-1">
                        <Icon name="add" className="text-sm" /> New Branch
                    </button>
                </div>

                <div className="space-y-3">
                    {shop.outlets.map(o => (
                        <div key={o.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400">
                                <Icon name={o.isHQ ? "apartment" : "storefront"} className="text-2xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{o.name}</p>
                                    {o.isHQ && <span className="text-[8px] font-black bg-primary text-white px-1.5 py-0.5 rounded uppercase">HQ</span>}
                                </div>
                                <p className="text-xs text-slate-500 truncate">{o.address}</p>
                            </div>
                            <button className="text-slate-300 hover:text-primary transition-colors">
                                <Icon name="settings" className="text-lg" />
                            </button>
                        </div>
                    ))}
                </div>
                
                <div className="p-6 bg-blue-50 dark:bg-blue-500/5 rounded-[2rem] border border-blue-100 dark:border-blue-500/10 text-center">
                    <Icon name="hub" className="text-4xl text-blue-500 mb-2" />
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm">Unified SKU Catalog</h4>
                    <p className="text-xs text-slate-500 mt-1">All branches share the same products, but maintain independent stock levels and local bargaining power.</p>
                </div>
            </div>
        ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
                 <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{shop.users.length} Active Staff</p>
                    <button className="text-xs font-bold text-primary flex items-center gap-1">
                        <Icon name="person_add" className="text-sm" /> Add Member
                    </button>
                </div>

                <div className="space-y-3">
                    {shop.users.map(u => (
                        <div key={u.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
                            <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500 font-bold">
                                {u.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <p className="font-bold text-slate-800 dark:text-white text-sm">{u.name}</p>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${
                                        u.role === 'Owner' ? 'bg-amber-100 text-amber-600' :
                                        u.role === 'Manager' ? 'bg-blue-100 text-blue-600' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {u.role}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate">
                                    {u.assignedOutletId === 'all' ? 'All Outlets' : shop.outlets.find(o => o.id === u.assignedOutletId)?.name}
                                </p>
                            </div>
                            <button className="text-slate-300 hover:text-primary transition-colors">
                                <Icon name="shield_person" className="text-lg" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-800 dark:text-white text-sm mb-3">Permissions Guide</h4>
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <Icon name="visibility" className="text-xs text-primary mt-0.5" />
                            <p className="text-[10px] text-slate-500"><span className="font-bold text-slate-700 dark:text-slate-300">Staff:</span> POS & Stock View only. No deletions or high-level analytics.</p>
                        </div>
                        <div className="flex gap-3">
                            <Icon name="verified_user" className="text-xs text-primary mt-0.5" />
                            <p className="text-[10px] text-slate-500"><span className="font-bold text-slate-700 dark:text-slate-300">Manager:</span> Restock, Void Sales, Branch Reports.</p>
                        </div>
                        <div className="flex gap-3">
                            <Icon name="admin_panel_settings" className="text-xs text-primary mt-0.5" />
                            <p className="text-[10px] text-slate-500"><span className="font-bold text-slate-700 dark:text-slate-300">Owner:</span> Full Access across all branches and profit analytics.</p>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
