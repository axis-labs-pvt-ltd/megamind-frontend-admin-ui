import { Award, Clock, Target, TrendingUp } from 'lucide-react';
import React from 'react';
import { StatCard } from './StatCard';
import { formatTime, getPerformanceLevel } from './statsUtils';

interface PerformanceOverviewProps {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
}

export const PerformanceOverview: React.FC<PerformanceOverviewProps> = ({
  totalAttempts,
  averageScore,
  bestScore,
  totalTimeSpent
}) => {
  const performanceLevel = getPerformanceLevel(averageScore);

  return (
    <div>
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Performance Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tests Taken"
          value={totalAttempts}
          subtitle="All time"
          icon={Target}
          trend={{ value: 15, direction: 'up', period: 'vs last month' }}
          color="blue"
        />
        
        <StatCard
          title="Average Score"
          value={`${averageScore}%`}
          subtitle={performanceLevel.level}
          icon={TrendingUp}
          trend={{ value: 8, direction: 'up', period: 'vs last month' }}
          color={performanceLevel.color}
        />
        
        <StatCard
          title="Best Performance"
          value={`${bestScore}%`}
          subtitle="Personal record"
          icon={Award}
          trend={{ value: 5, direction: 'up', period: 'new record' }}
          color="yellow"
        />
        
        <StatCard
          title="Study Time"
          value={formatTime(totalTimeSpent)}
          subtitle="This month"
          icon={Clock}
          trend={{ value: 22, direction: 'up', period: 'vs last month' }}
          color="purple"
        />
      </div>
    </div>
  );
};
