// Client Component - Reusable stat display card with icon
'use client';

import { Award, Clock, Target, TrendingUp } from 'lucide-react';

interface StatCardProps {
  iconName: 'Target' | 'TrendingUp' | 'Award' | 'Clock';
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
  delay?: number;
}

const iconMap = { Target, TrendingUp, Award, Clock };

export function StatCard({ iconName, iconBgColor, iconColor, label, value, delay = 0 }: StatCardProps) {
  const Icon = iconMap[iconName];
  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-5 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 ${iconBgColor} rounded-lg flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-[var(--text-secondary)]">{label}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
      </div>
    </div>
  );
}
