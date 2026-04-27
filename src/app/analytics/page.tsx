'use client';

import { AdminOnlyGate } from '@/components/layout/AdminGuard';
import { PerformanceTrend } from '@/components/features/analytics/PerformanceTrend';
import { StatCard } from '@/components/features/analytics/StatCard';
import { TestPerformanceItem } from '@/components/features/analytics/TestPerformanceItem';
import { Card } from '@/components/ui/card';
import { useAnalyticsData } from './hooks/useAnalyticsData';

function AnalyticsPageContent() {
  const {
    totalAttempts,
    averageScore,
    totalTimeSpent,
    passedTests,
    testPerformance,
    recentTrends,
  } = useAnalyticsData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Analytics Dashboard</h2>
        <p className="text-[var(--text-secondary)]">Track your progress and performance over time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          iconName="Target"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          label="Total Tests"
          value={totalAttempts}
          delay={100}
        />
        <StatCard
          iconName="TrendingUp"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          label="Average Score"
          value={`${averageScore}%`}
          delay={200}
        />
        <StatCard
          iconName="Award"
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          label="Tests Passed"
          value={passedTests}
          delay={300}
        />
        <StatCard
          iconName="Clock"
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          label="Time Spent"
          value={`${totalTimeSpent}m`}
          delay={400}
        />
      </div>

      {/* Performance Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Performance Trends</h3>
        <div className="space-y-4">
          {recentTrends.map((trend, index) => (
            <PerformanceTrend
              key={index}
              period={trend.period}
              score={trend.score}
              change={trend.change}
              trend={trend.trend}
              delay={index * 100}
            />
          ))}
        </div>
      </Card>

      {/* Test Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Test Performance</h3>
        <div className="space-y-4">
          {testPerformance.map((perf, index) => (
            <TestPerformanceItem
              key={index}
              performance={perf}
              delay={index * 50}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  return <AdminOnlyGate><AnalyticsPageContent /></AdminOnlyGate>;
}
