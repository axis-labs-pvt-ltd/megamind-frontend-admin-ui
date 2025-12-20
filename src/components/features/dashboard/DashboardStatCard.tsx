

import { LucideIcon } from 'lucide-react';

interface DashboardStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle: string;
  subtitleColor?: string;
  delay?: number;
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red';
}

export function DashboardStatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  subtitleColor = 'text-green-600',
  delay = 0,
  color = 'blue'
}: DashboardStatCardProps) {
  const colorMap = {
    blue: {
      bg: 'bg-[var(--accent-blue)]/10',
      text: 'text-[var(--accent-blue)]'
    },
    green: {
      bg: 'bg-[var(--accent-green)]/10',
      text: 'text-[var(--accent-green)]'
    },
    yellow: {
      bg: 'bg-[var(--accent-yellow)]/10',
      text: 'text-[var(--accent-yellow)]'
    },
    purple: {
      bg: 'bg-[var(--accent-purple)]/10',
      text: 'text-[var(--accent-purple)]'
    },
    red: {
      bg: 'bg-[var(--accent-red)]/10',
      text: 'text-[var(--accent-red)]'
    }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <div 
      className="bg-[var(--bg-card)] rounded-xl p-4 md:p-6 shadow-sm border border-[var(--border-primary)] hover:shadow-lg transition-all duration-200 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${colors.bg} rounded-xl`}>
          <Icon className={`h-6 w-6 ${colors.text}`} />
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
