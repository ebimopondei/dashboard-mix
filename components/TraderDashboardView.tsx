
import React, { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Icon } from './Icon';
import { TraderProfile, ViewType } from '../types';
import { OnboardingWidget } from './OnboardingWidget';
import { SavingsStreak } from './SavingsStreak';

interface TraderDashboardViewProps {
  onNavigate: (view: ViewType, id?: string) => void;
  traderProfile: TraderProfile;
}

export const TraderDashboardView: React.FC<TraderDashboardViewProps> = ({ onNavigate, traderProfile }) => {
  const [activeChart, setActiveChart] = useState<'trend' | 'factors'>('trend');
  
  const hasActiveLoan = !!traderProfile.activeLoan;
  const isKycComplete = traderProfile.kycStatus === 'Verified';

  // Mock Data for Charts
  const CREDIT_TREND = [
      { month: 'May', score: 620 },
      { month: 'Jun', score: 635 },
      { month: 'Jul', score: 650 },
      { month: 'Aug', score: 680 },
      { month: 'Sep', score: 710 },
      { month: 'Oct', score: traderProfile.creditScore || 720 },
  ];

  const CREDIT_FACTORS = [
      { name: 'History', value: 95, color: '#10B981', label: 'Payment History' }, // Emerald
      { name: 'Usage', value: 75, color: '#3B82F6', label: 'Credit Utilization' }, // Blue
      { name: 'Age', value: 60, color: '#F59E0B', label: 'Credit Age' }, // Amber
      { name: 'Mix', value: 40, color: '#6366F1', label: 'Account Mix' }, // Indigo
  ];

  // Credit Score Color
  const getScoreColor = (score: number) => {
      if (score >= 700) return 'text-emerald-500';
      if (score >= 600) return 'text-amber-500';
      return 'text-rose-500';
  };

  const handleRepayClick = () => {
      if (hasActiveLoan) {
          const element = document.getElementById('active-loan-card');
          if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
      } else {
          onNavigate(ViewType.ACTIVITY);
      }
  };

  const quickActions = [
      { 
          label: 'Apply', 
          icon: 'request_quote', 
          color: 'text-blue-600 dark:text-blue-400',
          bg: 'bg-blue-50 dark:bg-blue-500/10',
          action: () => onNavigate(ViewType.TRADER_LOAN_APPLY) 
      },
      { 
          label: 'Repay', 
          icon: 'payments', 
          color: 'text-emerald-600 dark:text-emerald-400',
          bg: 'bg-emerald-50 dark:bg-emerald-500/10',
          action: handleRepayClick
      },
      { 
          label: 'Esusu', 
          icon: 'savings', 
          color: 'text-purple-600 dark:text-purple-400',
          bg: 'bg-purple-50 dark:bg-purple-500/10',
          action: () => onNavigate(ViewType.TRADER_ESUSU) 
      },
      { 
          label: 'Profile', 
          icon: 'person', 
          color: 'text-amber-600 dark:text-amber-400',
          bg: 'bg-amber-50 dark:bg-amber-500/10',
          action: () => onNavigate(ViewType.PROFILE) 
      }
  ];

  const primarySavingsPlan = traderProfile.savingsPlans[0];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-20">
      
      {/* Header / Credit Score */}
      <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 p-8 opacity-10">
              <Icon name="speed" className="text-9xl" />
          </div>
          
          <div className="relative z-10 flex justify-between items-start">
              <div>
                  <h2 className="text-3xl font-bold mb-1">{traderProfile.businessName}</h2>
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                      <Icon name="location_on" className="text-xs" />
                      {traderProfile.location}
                  </p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                  <p className="text-xs text-slate-300 uppercase font-bold mb-1">Credit Score</p>
                  <p className={`text-3xl font-bold ${getScoreColor(traderProfile.creditScore)}`}>
                      {traderProfile.creditScore > 0 ? traderProfile.creditScore : 'N/A'}
                  </p>
              </div>
          </div>
          
          <div className="relative z-10 mt-6 flex gap-4">
              <div className="flex-1 bg-white/5 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Wallet Balance</p>
                  <p className="text-xl font-bold">₦{traderProfile.walletBalance.toLocaleString()}</p>
              </div>
              <button 
                onClick={() => onNavigate(ViewType.PAYMENT_METHODS)}
                className="flex items-center justify-center px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition-colors font-bold text-sm shadow-lg shadow-emerald-500/30"
              >
                  <Icon name="add" className="mr-1" /> Top Up
              </button>
          </div>
      </div>

      <SavingsStreak 
        streakDays={45} 
        currentProgress={125000} 
        targetProgress={500000} 
        completedDays={['Mon', 'Tue', 'Wed', 'Thu']}
        onClick={() => onNavigate(ViewType.SAVINGS_STREAK_DETAIL)}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
              <button 
                  key={action.label} 
                  onClick={action.action}
                  className="flex flex-col items-center gap-2 group"
              >
                  <div className={`size-14 rounded-2xl flex items-center justify-center shadow-sm border border-transparent transition-all group-active:scale-95 ${action.bg} ${action.color} group-hover:brightness-110 dark:group-hover:brightness-125`}>
                      <Icon name={action.icon} className="text-2xl" />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{action.label}</span>
              </button>
          ))}
      </div>

      {/* Credit Analysis Chart Section */}
      {traderProfile.creditScore > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 text-sm">
                      <Icon name="analytics" className="text-primary text-lg" /> Credit Insights
                  </h3>
                  <div className="flex bg-slate-100 dark:bg-slate-700/50 rounded-lg p-1">
                      <button
                          onClick={() => setActiveChart('trend')}
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                              activeChart === 'trend' 
                              ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                          }`}
                      >
                          Trend
                      </button>
                      <button
                          onClick={() => setActiveChart('factors')}
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${
                              activeChart === 'factors' 
                              ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' 
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                          }`}
                      >
                          Factors
                      </button>
                  </div>
              </div>

              <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      {activeChart === 'trend' ? (
                          <AreaChart data={CREDIT_TREND}>
                              <defs>
                                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                  </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                              <XAxis 
                                  dataKey="month" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                                  dy={10}
                              />
                              <Tooltip 
                                  contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} 
                                  itemStyle={{color: '#fff'}}
                                  cursor={{stroke: '#10B981', strokeWidth: 2}}
                              />
                              <Area 
                                  type="monotone" 
                                  dataKey="score" 
                                  stroke="#10B981" 
                                  strokeWidth={3} 
                                  fillOpacity={1} 
                                  fill="url(#colorScore)" 
                                  activeDot={{ r: 6, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }}
                              />
                          </AreaChart>
                      ) : (
                          <BarChart data={CREDIT_FACTORS} barSize={24}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                              <XAxis 
                                  dataKey="name" 
                                  axisLine={false} 
                                  tickLine={false} 
                                  tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                                  dy={10}
                              />
                              <Tooltip 
                                  cursor={{fill: 'transparent'}}
                                  content={({ active, payload }) => {
                                      if (active && payload && payload.length) {
                                          const data = payload[0].payload;
                                          return (
                                              <div className="bg-slate-800 text-white text-xs p-2 rounded-lg shadow-xl">
                                                  <p className="font-bold mb-1">{data.label}</p>
                                                  <p>Impact: {data.value}%</p>
                                              </div>
                                          );
                                      }
                                      return null;
                                  }}
                              />
                              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                  {CREDIT_FACTORS.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                              </Bar>
                          </BarChart>
                      )}
                  </ResponsiveContainer>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                      {activeChart === 'trend' 
                          ? 'Consistent repayment has boosted your score by 15%.' 
                          : 'Payment History has the highest impact on your eligibility.'}
                  </p>
              </div>
          </div>
      )}

      {/* Onboarding Checklist (if KYC not done or no loan) */}
      {!hasActiveLoan && (
          <OnboardingWidget 
            steps={traderProfile.onboardingSteps} 
            onNavigate={onNavigate} 
          />
      )}

      {/* Active Loan Card */}
      {hasActiveLoan && traderProfile.activeLoan && (
          <div 
            id="active-loan-card" 
            onClick={() => onNavigate(ViewType.TRADER_LOAN_DETAIL)}
            className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden scroll-mt-24 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.01]"
          >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Icon name="verified_user" className="text-9xl" />
              </div>

              <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                              <Icon name="request_quote" />
                          </div>
                          <div>
                              <h3 className="font-bold text-white">Active Loan</h3>
                              <p className="text-xs text-emerald-100">{traderProfile.activeLoan.collectionName}</p>
                          </div>
                      </div>
                      <span className="text-xs font-bold bg-white text-emerald-700 px-2 py-1 rounded-full shadow-sm">
                          {traderProfile.activeLoan.status}
                      </span>
                  </div>

                  <div className="space-y-4">
                      <div className="flex justify-between items-end">
                          <div>
                              <p className="text-xs text-emerald-100 mb-1">Outstanding Balance</p>
                              <p className="text-2xl font-bold text-white">
                                  ₦{(traderProfile.activeLoan.totalRepayment - traderProfile.activeLoan.amountPaid).toLocaleString()}
                              </p>
                          </div>
                          <div className="text-right">
                              <p className="text-xs text-emerald-100 mb-1">Due Date</p>
                              <p className="text-sm font-bold text-white">{traderProfile.activeLoan.dueDate}</p>
                          </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                          <div className="flex justify-between text-xs mb-1 text-emerald-100">
                              <span>Repayment Progress</span>
                              <span className="font-bold text-white">{Math.round((traderProfile.activeLoan.amountPaid / traderProfile.activeLoan.totalRepayment) * 100)}%</span>
                          </div>
                          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000" 
                                style={{ width: `${(traderProfile.activeLoan.amountPaid / traderProfile.activeLoan.totalRepayment) * 100}%` }}
                              />
                          </div>
                      </div>

                      {/* Daily Repayment Action */}
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center justify-between border border-white/10">
                          <div>
                              <p className="text-xs text-emerald-100 font-bold uppercase">Daily Installment</p>
                              <p className="text-lg font-bold text-white">₦{traderProfile.activeLoan.dailyRepaymentAmount.toLocaleString()}</p>
                          </div>
                          <button 
                            className="px-6 py-2 bg-white text-emerald-700 font-bold rounded-lg shadow-md hover:bg-emerald-50 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent card navigation if clicking button explicitly
                                onNavigate(ViewType.TRADER_LOAN_DETAIL);
                            }}
                          >
                              Pay Now
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Savings Goal Snapshot */}
      {primarySavingsPlan && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <Icon name="flag" className="text-primary" />
                      Primary Goal
                  </h3>
                  <button 
                    onClick={() => onNavigate(ViewType.TRADER_SAVINGS)}
                    className="text-xs font-bold text-primary"
                  >
                      View All
                  </button>
              </div>
              
              <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{primarySavingsPlan.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">₦{primarySavingsPlan.balance.toLocaleString()} / ₦{primarySavingsPlan.targetAmount.toLocaleString()}</span>
              </div>
              
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-3">
                  <div 
                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (primarySavingsPlan.balance / primarySavingsPlan.targetAmount) * 100)}%` }}
                  />
              </div>
              
              <div className="flex justify-end">
                  <button className="text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                      + Add Funds
                  </button>
              </div>
          </div>
      )}

      {/* Recent Activity Mini-Feed */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800 dark:text-white">Recent Activity</h3>
              <button 
                onClick={() => onNavigate(ViewType.ACTIVITY)}
                className="text-xs font-bold text-primary"
              >
                  See All
              </button>
          </div>
          
          <div className="space-y-4">
              {traderProfile.activities.slice(0, 3).map(activity => (
                  <div key={activity.id} className="flex items-center gap-3">
                      <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                          activity.amount > 0 
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}>
                          <Icon name={activity.amount > 0 ? 'arrow_downward' : 'arrow_upward'} />
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-slate-800 dark:text-white truncate">{activity.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{activity.date}</p>
                      </div>
                      <span className={`font-bold text-sm ${activity.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>
                          {activity.amount > 0 ? '+' : ''}₦{Math.abs(activity.amount).toLocaleString()}
                      </span>
                  </div>
              ))}
              {traderProfile.activities.length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-2">No recent activity</p>
              )}
          </div>
      </div>

      {/* Esusu Card */}
      <div 
        onClick={() => onNavigate(ViewType.TRADER_ESUSU)}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg cursor-pointer hover:shadow-xl transition-shadow relative overflow-hidden"
      >
          <div className="absolute -right-6 -bottom-6 opacity-20">
              <Icon name="groups" className="text-9xl" />
          </div>
          
          <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                      <Icon name="savings" /> Esusu Groups
                  </h3>
                  <Icon name="chevron_right" />
              </div>

              {traderProfile.esusuGroups.length > 0 ? (
                  <div className="space-y-3">
                      {traderProfile.esusuGroups.map(group => (
                          <div key={group.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                              <div className="flex justify-between mb-1">
                                  <span className="font-bold text-sm">{group.name}</span>
                                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white">{group.frequency} Contribution</span>
                              </div>
                              <p className="text-xs text-indigo-100">Saved: ₦{group.totalSaved.toLocaleString()}</p>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-4">
                      <p className="text-sm font-medium mb-2">Join a savings circle today</p>
                      <span className="bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">Explore Groups</span>
                  </div>
              )}
          </div>
      </div>

    </div>
  );
};
