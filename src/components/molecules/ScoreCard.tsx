import React from 'react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  className?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  totalQuestions,
  percentage,
  trend,
  trendValue,
  className = '',
}) => {
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
      default: return 'text-gray-500';
    }
  };

  const TrendIcon = getTrendIcon(trend);

  return (
    <Card className={`${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Badge variant={getScoreColor(percentage)} size="md">
            {percentage}%
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-gray-900">
            {score}/{totalQuestions}
          </div>
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 ${getTrendColor(trend)}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{trendValue}%</span>
            </div>
          )}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              percentage >= 80 
                ? 'bg-green-500' 
                : percentage >= 60 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </Card>
  );
};