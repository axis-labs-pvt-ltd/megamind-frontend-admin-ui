import { PerformanceChart } from '@/components/features/analytics/PerformanceChart';
import React from 'react';

interface PerformanceChartsProps {
  performanceOverTime: Array<{ name: string; value: number }>;
  subjectPerformance: Array<{ subject: string; value: number }>;
  monthlyProgress: Array<{ name: string; value: number }>;
  weeklyActivity: Array<{ name: string; value: number }>;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  performanceOverTime,
  subjectPerformance,
  monthlyProgress,
  weeklyActivity
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Performance Over Time */}
      <PerformanceChart
        type="line"
        data={performanceOverTime}
        title="Performance Trend"
        description="Your score progression over the last 8 weeks"
        height={300}
        colors={['#3b82f6']}
      />

      {/* Subject Performance Radar */}
      <PerformanceChart
        type="radar"
        data={subjectPerformance}
        title="Subject Mastery"
        description="Performance breakdown by subject area"
        height={300}
        colors={['#8b5cf6']}
      />

      {/* Monthly Progress */}
      <PerformanceChart
        type="bar"
        data={monthlyProgress}
        title="Monthly Progress"
        description="Average scores by month"
        height={300}
        colors={['#10b981']}
      />

      {/* Weekly Activity */}
      <PerformanceChart
        type="bar"
        data={weeklyActivity}
        title="Weekly Activity"
        description="Tests taken per day this week"
        height={300}
        colors={['#f59e0b']}
      />
    </div>
  );
};
