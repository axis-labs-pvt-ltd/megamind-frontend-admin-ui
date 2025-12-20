// Client Component - Reusable dashboard stat card

'use client';

import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  label: string;
  value: string | number;
  subtitle: string;
  subtitleColor?: string;
  delay?: number;
}

export function DashboardStatCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  label,
  value,
  subtitle,
  subtitleColor = 'text-green-600',
  delay = 0
}: DashboardStatCardProps) {
  return (
    <div 
      className="bg-[var(--bg-card)] rounded-xl p-6 shadow-sm border border-[var(--border-primary)] hover:shadow-md transition-shadow animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${iconBgColor} rounded-xl`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--text-secondary)]">{label}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          <p className={`text-xs ${subtitleColor} font-medium`}>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
