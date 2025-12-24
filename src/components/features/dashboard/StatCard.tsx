import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type LucideIcon } from 'lucide-react';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
    period: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'indigo';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-[var(--accent-blue)]/10',
      text: 'text-[var(--accent-blue)]',
      trend: {
        up: 'text-[var(--accent-green)] bg-[var(--accent-green)]/10',
        down: 'text-[var(--accent-red)] bg-[var(--accent-red)]/10',
        stable: 'text-[var(--text-secondary)] bg-[var(--bg-secondary)]'
      }
    },
    green: {
      bg: 'bg-[var(--accent-green)]/10',
      text: 'text-[var(--accent-green)]',
      trend: {
        up: 'text-[var(--accent-green)] bg-[var(--accent-green)]/10',
        down: 'text-[var(--accent-red)] bg-[var(--accent-red)]/10',
        stable: 'text-[var(--text-secondary)] bg-[var(--bg-secondary)]'
      }
    },
    yellow: {
      bg: 'bg-[var(--accent-yellow)]/10',
      text: 'text-[var(--accent-yellow)]',
      trend: {
        up: 'text-[var(--accent-green)] bg-[var(--accent-green)]/10',
        down: 'text-[var(--accent-red)] bg-[var(--accent-red)]/10',
        stable: 'text-[var(--text-secondary)] bg-[var(--bg-secondary)]'
      }
    },
    red: {
      bg: 'bg-[var(--accent-red)]/10',
      text: 'text-[var(--accent-red)]',
      trend: {
        up: 'text-[var(--accent-green)] bg-[var(--accent-green)]/10',
        down: 'text-[var(--accent-red)] bg-[var(--accent-red)]/10',
        stable: 'text-[var(--text-secondary)] bg-[var(--bg-secondary)]'
      }
    },
    purple: {
      bg: 'bg-[var(--accent-purple)]/10',
      text: 'text-[var(--accent-purple)]',
      trend: {
        up: 'text-[var(--accent-green)] bg-[var(--accent-green)]/10',
        down: 'text-[var(--accent-red)] bg-[var(--accent-red)]/10',
        stable: 'text-[var(--text-secondary)] bg-[var(--bg-secondary)]'
      }
    },
    indigo: {
      bg: 'bg-[var(--accent-blue)]/10',
      text: 'text-[var(--accent-blue)]',
      trend: {
        up: 'text-[var(--accent-green)] bg-[var(--accent-green)]/10',
        down: 'text-[var(--accent-red)] bg-[var(--accent-red)]/10',
        stable: 'text-[var(--text-secondary)] bg-[var(--bg-secondary)]'
      }
    }
  };

  const getTrendSymbol = (direction: string) => {
    switch (direction) {
      case 'up': return '↗';
      case 'down': return '↘';
      default: return '→';
    }
  };

  return (
    <Card className={cn("p-4 md:p-6 hover:shadow-lg transition-all duration-200", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-3 rounded-xl ${colorClasses[color].bg}`}>
              <Icon className={`h-6 w-6 ${colorClasses[color].text}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
              {subtitle && (
                <p className="text-xs text-[var(--text-secondary)]">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-[var(--text-primary)]">{value}</p>
            
            {trend && (
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  size="sm"
                  className={`${colorClasses[color].trend[trend.direction]} border-0`}
                >
                  {getTrendSymbol(trend.direction)} {Math.abs(trend.value)}%
                </Badge>
                <span className="text-xs text-[var(--text-secondary)]">{trend.period}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
