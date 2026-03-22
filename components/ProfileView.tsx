
import React, { useState } from 'react';
import { Icon } from './Icon';
import { PROFILE_IMAGE_URL } from '../constants';
import { BalanceCard } from './BalanceCard';
import { ViewType, UserProfile } from '../types';

interface ProfileViewProps {
  onLogout?: () => void;
  onNavigate?: (view: ViewType) => void;
  userProfile: UserProfile;
  onSimulateProfile: (type: 'fresh' | 'starter' | 'expert') => void;
  assignedAgent?: {
      name: string;
      phone: string;
      photo: string;
  };
  isSpineEnabled?: boolean;
  onToggleSpine?: () => void;
  isSlashEnabled?: boolean;
  onToggleSlash?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  onLogout, 
  onNavigate, 
  userProfile, 
  onSimulateProfile, 
  assignedAgent,
  isSpineEnabled,
  onToggleSpine,
  isSlashEnabled,
  onToggleSlash
}) => {
  const [showDemoOptions, setShowDemoOptions] = useState(false);

  // Check if Tax Profile exists to determine navigation target
  const taxAction = userProfile.taxProfile ? ViewType.TAX_DASHBOARD : ViewType.TAX_PROFILE;

  const menuItems = [
    { 
        icon: 'verified_user', 
        label: 'Identity Verification', 
        sub: userProfile.id === 'fresh_01' ? 'Not Started' : 'Tier 1 - Verified', 
        action: () => onNavigate && onNavigate(ViewType.KYC),
        badge: userProfile.id === 'fresh_01' ? 'Action Required' : undefined
    },
    { 
        icon: 'gavel', 
        label: 'TaxDesk', 
        sub: 'Automated Tax & Filing', 
        action: () => onNavigate && onNavigate(taxAction),
        badge: 'New'
    },
    { icon: 'person', label: 'Personal Information', sub: 'Name, Email, Phone', action: () => {} },
    { icon: 'account_balance_wallet', label: 'Payment Methods', sub: 'Bank Accounts, Cards', action: () => onNavigate && onNavigate(ViewType.PAYMENT_METHODS) },
    { icon: 'eco', label: 'My Impact', sub: 'Social & Environmental stats', action: () => onNavigate && onNavigate(ViewType.IMPACT) },
    { icon: 'card_giftcard', label: 'Refer & Earn', sub: 'Invite friends, earn cash', action: () => onNavigate && onNavigate(ViewType.REFERRAL) },
    { icon: 'school', label: 'Learning Hub', sub: 'Tutorials, Guides, News', action: () => onNavigate && onNavigate(ViewType.LEARN) },
    { icon: 'security', label: 'Security', sub: 'Password, 2FA', action: () => onNavigate && onNavigate(ViewType.SECURITY) },
    { icon: 'notifications', label: 'Notifications', sub: 'Email, Push, SMS', action: () => onNavigate && onNavigate(ViewType.NOTIFICATIONS_SETTINGS) },
    { icon: 'description', label: 'Terms & Privacy', sub: 'Legal Information', action: () => {} },
    { icon: 'help', label: 'Help & Support', sub: 'FAQ, Contact Support', action: () => onNavigate && onNavigate(ViewType.HELP) },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center gap-3 py-4 mt-2">
        <div className="relative group cursor-pointer">
            <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-28 ring-4 ring-white dark:ring-slate-800 shadow-xl transition-transform group-hover:scale-105"
            style={{ backgroundImage: `url("${PROFILE_IMAGE_URL}")` }}
            />
            <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full border-4 border-background-light dark:border-background-dark shadow-sm">
                <Icon name="edit" className="text-xs font-bold" />
            </div>
        </div>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{userProfile.name}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{userProfile.email}</p>
        </div>
        <button 
            onClick={() => onNavigate && onNavigate(ViewType.TIERS)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors"
        >
            <Icon name="military_tech" className="text-lg" />
            <span className="text-xs font-bold uppercase tracking-wide">{userProfile.tier}</span>
            <Icon name="chevron_right" className="text-sm" />
        </button>
      </div>

      <BalanceCard compact balance={userProfile.walletBalance} />

      {/* My Agent Card (If applicable) */}
      {assignedAgent && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-4">
              <div className="relative">
                  <div 
                      className="size-14 rounded-full bg-cover bg-center bg-slate-200 dark:bg-slate-700" 
                      style={{ backgroundImage: `url(${assignedAgent.photo})` }}
                  />
                  <div className="absolute bottom-0 right-0 size-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
              </div>
              <div className="flex-1">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide mb-0.5">Your Field Agent</p>
                  <h3 className="font-bold text-slate-800 dark:text-white">{assignedAgent.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Available Mon-Sat</p>
              </div>
              <div className="flex gap-2">
                  <button className="size-9 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-200 dark:hover:bg-emerald-500/30 transition-colors">
                      <Icon name="call" className="text-lg" />
                  </button>
                  <button className="size-9 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-200 dark:hover:bg-blue-500/30 transition-colors">
                      <Icon name="chat" className="text-lg" />
                  </button>
              </div>
          </div>
      )}

      {/* Feature Toggles (Spine & Slash Modules) */}
      <div className="space-y-3">
        {userProfile.tier === 'Trader' && onToggleSpine && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm p-4 animate-in slide-in-from-left duration-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <Icon name="storefront" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 dark:text-white text-sm">Spine Module</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Inventory & Sales tracking</p>
                        </div>
                    </div>
                    <button 
                        onClick={onToggleSpine}
                        className={`width-12 height-6 rounded-full transition-colors relative ${isSpineEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${isSpineEnabled ? 'right-1' : 'left-1 shadow-sm'}`} />
                    </button>
                </div>
            </div>
        )}

        {/* Slash Toggle for Investors */}
        {userProfile.tier !== 'Trader' && onToggleSlash && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm p-4 animate-in slide-in-from-left duration-300">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-md">
                                <Icon name="bolt" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm">Slash E-commerce</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Browse & shop local businesses</p>
                            </div>
                        </div>
                        <button 
                            onClick={onToggleSlash}
                            className={`w-12 h-6 rounded-full transition-colors relative ${isSlashEnabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${isSlashEnabled ? 'right-1' : 'left-1 shadow-sm'}`} />
                        </button>
                    </div>

                    {isSlashEnabled && (
                        <button 
                            onClick={() => onNavigate && onNavigate(ViewType.INVESTOR_SLASH_SHOP)}
                            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 animate-in zoom-in-95 duration-300"
                        >
                            <Icon name="shopping_basket" className="text-sm" />
                            Visit Marketplace
                        </button>
                    )}
                </div>
            </div>
        )}
      </div>

      {/* Menu Options */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 overflow-hidden shadow-sm">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={item.action}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
                <Icon name={item.icon} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-800 dark:text-white text-sm">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
                {item.badge && (
                    <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
                <Icon name="chevron_right" className="text-slate-400" />
            </div>
          </button>
        ))}
      </div>

      <button 
        onClick={onLogout}
        className="w-full py-4 rounded-xl text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-2"
      >
        <Icon name="logout" />
        <span>Log Out</span>
      </button>

      {/* Simulation Toggle - DEVELOPER SETTINGS */}
      <div className="mt-8 mb-4 border-t border-slate-200 dark:border-slate-700 pt-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center mb-4 opacity-50">Version 2.4.0 • Build 882</p>
        
        <button 
            onClick={() => setShowDemoOptions(!showDemoOptions)}
            className="text-xs font-bold text-slate-400 uppercase tracking-widest w-full text-center hover:text-primary transition-colors mb-4"
        >
            {showDemoOptions ? 'Hide Demo Control' : 'Show Demo Control'}
        </button>
        
        {showDemoOptions && (
            <div className="grid grid-cols-3 gap-2">
                <button 
                    onClick={() => onSimulateProfile('fresh')}
                    className={`p-2 rounded-lg text-xs font-bold border ${userProfile.id === 'fresh_01' ? 'bg-primary text-white border-primary' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'}`}
                >
                    Fresh User
                </button>
                <button 
                    onClick={() => onSimulateProfile('starter')}
                    className={`p-2 rounded-lg text-xs font-bold border ${userProfile.id === 'start_01' ? 'bg-primary text-white border-primary' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'}`}
                >
                    Starter
                </button>
                <button 
                    onClick={() => onSimulateProfile('expert')}
                    className={`p-2 rounded-lg text-xs font-bold border ${userProfile.id === 'expert_01' ? 'bg-primary text-white border-primary' : 'bg-transparent text-slate-500 border-slate-300 dark:border-slate-700'}`}
                >
                    Expert
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
