// Client Component - Displays performance trend with visual indicators

'use client';

import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { PerformanceTrendData } from './types';

interface PerformanceTrendProps extends PerformanceTrendData {
  delay?: number;
}

export function PerformanceTrend({ period, score, change, trend, delay = 0 }: PerformanceTrendProps) {
  return (
    <div 
      className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div>
        <p className="font-medium text-[var(--text-primary)]">{period}</p>
        <p className="text-sm text-[var(--text-secondary)]">Average Score</p>
      </div>
      <div className="flex items-center space-x-3">
        <Badge variant={score >= 80 ? 'success' : score >= 60 ? 'warning' : 'danger'}>
          {score}%
        </Badge>
        <div className={`flex items-center space-x-1 ${
          trend === 'up' ? 'text-[var(--accent-green)]' : 'text-[var(--accent-red)]'
        }`}>
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">{change}%</span>
        </div>
      </div>
    </div>
  );
}
