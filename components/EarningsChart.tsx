import React from 'react';
import {
  AreaChart,
  Area,
  ResponsiveContainer
} from 'recharts';
import { Icon } from './Icon';
import { CHART_DATA } from '../constants';

export const EarningsChart: React.FC = () => {
  return (
    <section className="flex flex-col gap-4 rounded-xl p-4 bg-white dark:bg-slate-800/50 shadow-sm border border-slate-100 dark:border-slate-700/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-normal">
            Daily Earnings
          </p>
          <p className="text-slate-800 dark:text-white tracking-tight text-3xl font-bold leading-tight truncate">
            ₦210.55
          </p>
        </div>
        <div className="flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-lg">
          <Icon name="trending_up" className="text-lg" />
          <p className="text-sm font-bold leading-normal">+1.5%</p>
        </div>
      </div>
      
      <div className="flex flex-col w-full h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10B981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between px-2">
        {CHART_DATA.map((item) => (
          <p key={item.day} className="text-slate-400 dark:text-slate-500 text-xs font-bold leading-normal">
            {item.day}
          </p>
        ))}
      </div>
    </section>
  );
};