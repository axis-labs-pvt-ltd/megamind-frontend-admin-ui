'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

interface ScoreCardProps {
  title: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  className?: string;
}

const getScoreColor = (percentage: number) => {
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'warning';
  return 'danger';
};

const getTrendIcon = (trend?: string) => {
  switch (trend) {
    case 'up': return TrendingUp;
    case 'down': return TrendingDown;
    default: return Minus;
  }
};

const getTrendColor = (trend?: string) => {
  switch (trend) {
    case 'up': return 'text-green-500';
    case 'down': return 'text-red-500';
    default: return 'text-[var(--text-secondary)]';
  }
};

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  totalQuestions,
  percentage,
  trend,
  trendValue,
  className,
}) => {

  const TrendIcon = getTrendIcon(trend);

  return (
    <Card className={cn(className)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
          <Badge variant={getScoreColor(percentage)}>
            {percentage}%
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-[var(--text-primary)]">
            {score}/{totalQuestions}
          </div>
          {trend && trendValue && (
            <div className={cn("flex items-center space-x-1", getTrendColor(trend))}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{trendValue}%</span>
            </div>
          )}
        </div>

        <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              percentage >= 80 
                ? 'bg-green-500' 
                : percentage >= 60 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};
