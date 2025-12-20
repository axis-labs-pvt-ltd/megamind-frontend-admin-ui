import React from 'react';

interface GoalProgressProps {
  label: string;
  valueLabel: string;
  percentage: number;
  colorClass: string;
}

export const GoalProgress: React.FC<GoalProgressProps> = ({ 
  label, 
  valueLabel, 
  percentage, 
  colorClass 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[var(--text-secondary)]">{label}</span>
        <span className="text-sm text-[var(--text-secondary)]">{valueLabel}</span>
      </div>
      <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${colorClass}`} 
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>
    </div>
  );
};
