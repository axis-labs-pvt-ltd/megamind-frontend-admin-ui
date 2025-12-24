import { Activity, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import React from 'react';
import { StatCard } from './StatCard';

export const AdvancedAnalytics: React.FC = () => {
  return (
    <div>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Detailed Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Consistency Score"
          value="87%"
          subtitle="Performance stability"
          icon={Activity}
          trend={{ value: 3, direction: 'up', period: 'improving' }}
          color="indigo"
        />
        
        <StatCard
          title="Learning Velocity"
          value="12.5"
          subtitle="Points per week"
          icon={Zap}
          trend={{ value: 18, direction: 'up', period: 'accelerating' }}
          color="green"
        />
        
        <StatCard
          title="Completion Rate"
          value="94%"
          subtitle="Tests finished"
          icon={CheckCircle}
          trend={{ value: 2, direction: 'up', period: 'excellent' }}
          color="green"
        />
        
        <StatCard
          title="Focus Areas"
          value="3"
          subtitle="Need attention"
          icon={AlertCircle}
          trend={{ value: 1, direction: 'down', period: 'improving' }}
          color="red"
        />
      </div>
    </div>
  );
};
