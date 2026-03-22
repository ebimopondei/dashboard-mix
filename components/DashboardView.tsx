
import React from 'react';
import { StatsSection } from './StatsSection';
import { EarningsChart } from './EarningsChart';
import { InvestmentList } from './InvestmentList';
import { BalanceCard } from './BalanceCard';
import { Icon } from './Icon';
import { ViewType, UserProfile } from '../types';
import { OnboardingWidget } from './OnboardingWidget';
import { SavingsStreak } from './SavingsStreak';

interface DashboardViewProps {
  onNavigate?: (view: ViewType, id?: string) => void;
  userProfile: UserProfile;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, userProfile }) => {
  const isFreshUser = userProfile.totalInvested === 0;
  const onboardingSteps = userProfile.onboardingSteps || [];
  const isOnboardingComplete = onboardingSteps.length > 0 && onboardingSteps.every(s => s.isCompleted);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="space-y-4">
        <BalanceCard balance={userProfile.walletBalance} />
        <SavingsStreak onClick={() => onNavigate && onNavigate(ViewType.SAVINGS_STREAK_DETAIL)} />
      </div>
      
      {/* Show Onboarding Widget if not complete */}
      {!isOnboardingComplete && onboardingSteps.length > 0 ? (
          <OnboardingWidget 
            steps={onboardingSteps} 
            onNavigate={(view) => onNavigate && onNavigate(view)} 
          />
      ) : (
          /* Only show charts if onboarding is done/investments exist */
          <>
            <div className="relative group">
                <StatsSection />
                {onNavigate && (
                <button 
                    onClick={() => onNavigate(ViewType.ANALYTICS)}
                    className="absolute -top-3 -right-3 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-primary hover:scale-110 transition-transform z-10 border border-slate-100 dark:border-slate-700"
                    title="View Analytics"
                >
                    <Icon name="bar_chart" className="text-xl" />
                </button>
                )}
            </div>
            
            {/* Handle Empty Chart Data */}
            {userProfile.chartData && userProfile.chartData.length > 0 && (
                <EarningsChart />
            )}
          </>
      )}

      {/* Financial Goals Widget - Only show if goals exist or user is expert */}
      {userProfile.goals && userProfile.goals.length > 0 && (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Icon name="track_changes" className="text-primary" />
                    Financial Goals
                </h3>
                <button 
                    onClick={() => onNavigate && onNavigate(ViewType.AUTO_INVEST)}
                    className="text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Manage
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
                {userProfile.goals.map(goal => {
                    const percent = Math.round((goal.currentAmount / goal.targetAmount) * 100);
                    return (
                        <div key={goal.id} className="min-w-[140px] p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                            <div className={`size-8 rounded-full ${goal.color} flex items-center justify-center text-white`}>
                                <Icon name={goal.icon} className="text-sm" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{goal.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{percent}% of ₦{goal.targetAmount/1000}k</p>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1">
                                <div className={`h-1 rounded-full ${goal.color}`} style={{ width: `${percent}%` }} />
                            </div>
                        </div>
                    )
                })}
                <button 
                    onClick={() => onNavigate && onNavigate(ViewType.AUTO_INVEST)}
                    className="min-w-[50px] flex items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                    <Icon name="add" />
                </button>
            </div>
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Your Portfolio</h3>
          {userProfile.investments && userProfile.investments.length > 0 && (
             <button 
                onClick={() => onNavigate && onNavigate(ViewType.ANALYTICS)}
                className="text-sm font-medium text-primary hover:text-primary/80"
             >
                View Analytics
             </button>
          )}
        </div>

        {/* Empty State for Investments */}
        {!userProfile.investments || userProfile.investments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3">
                    <Icon name="savings" className="text-3xl text-slate-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">No active investments</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] mb-4">Start your journey by exploring available market clusters.</p>
                <button 
                    onClick={() => onNavigate && onNavigate(ViewType.EXPLORE)}
                    className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-primary/90"
                >
                    Explore Markets
                </button>
            </div>
        ) : (
            <InvestmentList 
                investments={userProfile.investments} 
                onInvestmentClick={(id) => onNavigate && onNavigate(ViewType.INVESTMENT_DETAIL, id)}
            />
        )}
      </div>
    </div>
  );
};
