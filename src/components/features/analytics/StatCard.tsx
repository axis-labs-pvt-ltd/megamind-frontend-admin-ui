// Client Component - Reusable stat display card with icon

'use client';

import { Card } from '@/components/ui/card';
import { NeumorphicWrapper } from '@/components/ui/neumorphic-wrapper';
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
    <NeumorphicWrapper 
      as={Card} 
      variant="primary" // Outset Shadow
      className="p-6 animate-slide-up" 
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-3">
        <NeumorphicWrapper 
          variant="secondary" // Inset text/icon container for that "pressed" look the user might like for icons?
          // Actually, looking at the image provided, icons are often in "inset" circles or "outset" chips.
          // Let's try standard colored bg first, but wrapped if we want consistent shape.
          // The image shows icon containers that look somewhat flat or slightly inset. 
          // Let's just keep the original structure but ensure the outer card is Neumorphic.
          // The original code was: <div className={`p-2 ${iconBgColor} rounded-lg`}>
          // Let's keep that but ensure it doesn't conflict.
          active={false} 
          hoverEffect={false}
          className={`p-2 ${iconBgColor} rounded-lg transition-transform hover:scale-110`}
        >
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </NeumorphicWrapper>
        <div>
          <p className="text-sm text-[var(--text-secondary)]">{label}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
        </div>
      </div>
    </NeumorphicWrapper>
  );
}
