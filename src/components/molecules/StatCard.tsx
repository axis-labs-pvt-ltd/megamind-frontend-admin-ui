import React from 'react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import { DivideIcon as LucideIcon } from 'lucide-react';

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
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        stable: 'text-gray-600 bg-gray-100'
      }
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        stable: 'text-gray-600 bg-gray-100'
      }
    },
    yellow: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        stable: 'text-gray-600 bg-gray-100'
      }
    },
    red: {
      bg: 'bg-red-100',
      text: 'text-red-600',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        stable: 'text-gray-600 bg-gray-100'
      }
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        stable: 'text-gray-600 bg-gray-100'
      }
    },
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        stable: 'text-gray-600 bg-gray-100'
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
    <Card className={`p-6 hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`p-3 rounded-xl ${colorClasses[color].bg}`}>
              <Icon className={`h-6 w-6 ${colorClasses[color].text}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            
            {trend && (
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary" 
                  size="sm"
                  className={`${colorClasses[color].trend[trend.direction]} border-0`}
                >
                  {getTrendSymbol(trend.direction)} {Math.abs(trend.value)}%
                </Badge>
                <span className="text-xs text-gray-500">{trend.period}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};