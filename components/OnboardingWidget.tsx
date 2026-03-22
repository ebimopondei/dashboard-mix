
import React from 'react';
import { Icon } from './Icon';
import { OnboardingStep, ViewType } from '../types';

interface OnboardingWidgetProps {
    steps: OnboardingStep[];
    onNavigate: (view: ViewType) => void;
}

export const OnboardingWidget: React.FC<OnboardingWidgetProps> = ({ steps, onNavigate }) => {
    const completedCount = steps.filter(s => s.isCompleted).length;
    const progress = Math.round((completedCount / steps.length) * 100);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm animate-in slide-in-from-top duration-500">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Get Started</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Complete setup to start earning</p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{progress}%</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-6">
                <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${progress}%` }} 
                />
            </div>

            {/* Steps List */}
            <div className="space-y-3">
                {steps.map((step, index) => (
                    <div 
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                            step.isCompleted 
                                ? 'bg-emerald-50 dark:bg-emerald-500/5 border-emerald-100 dark:border-emerald-500/20' 
                                : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 cursor-pointer hover:border-primary/30'
                        }`}
                        onClick={() => !step.isCompleted && onNavigate(step.action)}
                    >
                        {/* Checkbox / Icon Area */}
                        <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                            step.isCompleted 
                                ? 'bg-emerald-500 text-white' 
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}>
                            <Icon name={step.isCompleted ? 'check' : step.icon} className="text-lg" />
                        </div>

                        <div className="flex-1">
                            <p className={`text-sm font-bold ${
                                step.isCompleted ? 'text-emerald-800 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'
                            }`}>
                                {step.label}
                            </p>
                        </div>

                        {!step.isCompleted && (
                            <Icon name="chevron_right" className="text-slate-400" />
                        )}
                    </div>
                ))}
            </div>

            {progress === 100 && (
                 <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl text-center animate-in fade-in">
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-300">All set! You are ready to invest.</p>
                 </div>
            )}
        </div>
    );
};
