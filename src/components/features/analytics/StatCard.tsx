// Client Component - Reusable stat display card with icon

'use client';

import { Card } from '@/components/ui/card';
import { Award, Clock, Target, TrendingUp } from 'lucide-react';

interface StatCardProps {
  iconName: 'Target' | 'TrendingUp' | 'Award' | 'Clock';
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
  delay?: number;
}

const iconMap = {
  Target,
  TrendingUp,
  Award,
  Clock
};

export function StatCard({ iconName, iconBgColor, iconColor, label, value, delay = 0 }: StatCardProps) {
  const Icon = iconMap[iconName];
  
  return (
    <Card className="p-6 animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-[var(--text-secondary)]">{label}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
      </div>
    </Card>
  );
}
