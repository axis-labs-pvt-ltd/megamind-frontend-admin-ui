// Server Component - Analytics page with computed data

import { PerformanceTrend } from '@/components/features/analytics/PerformanceTrend';
import { StatCard } from '@/components/features/analytics/StatCard';
import { TestPerformanceItem } from '@/components/features/analytics/TestPerformanceItem';
import type { TestPerformance } from '@/components/features/analytics/types';
import { Card } from '@/components/ui/card';
import { mockTestAttempts, mockTests } from '@/lib/mock-data';

export default function AnalyticsPage() {
  const totalAttempts = mockTestAttempts.length;
  const averageScore = Math.round(mockTestAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / (totalAttempts || 1));
  const totalTimeSpent = mockTestAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
  const passedTests = mockTestAttempts.filter(attempt => attempt.score >= 70).length;

  const testPerformance: TestPerformance[] = mockTests.map(test => {
    const attempts = mockTestAttempts.filter(attempt => attempt.testId === test.id);
    const lastAttemptDate = attempts.length > 0 ? attempts[attempts.length - 1].completedAt : null;
    return {
      test,
      attempts: attempts.length,
      averageScore: attempts.length > 0 ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) : 0,
      bestScore: attempts.length > 0 ? Math.max(...attempts.map(attempt => attempt.score)) : 0,
      lastAttempt: lastAttemptDate ? new Date(lastAttemptDate).toISOString() : null
    };
  });

  const recentTrends = [
    { period: 'This Week', score: 85, change: 5, trend: 'up' as const },
    { period: 'This Month', score: 78, change: -2, trend: 'down' as const },
    { period: 'Last Month', score: 82, change: 8, trend: 'up' as const },
  ];

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
