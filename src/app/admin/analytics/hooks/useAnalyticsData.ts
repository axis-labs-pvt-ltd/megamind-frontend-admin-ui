import type { TestPerformance } from '@/components/features/analytics/types';
import { mockTestAttempts, mockTests } from '@/lib/mock-data';

export function useAnalyticsData() {
  const totalAttempts = mockTestAttempts.length;
  const averageScore = Math.round(
    mockTestAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / (totalAttempts || 1)
  );
  const totalTimeSpent = mockTestAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0);
  const passedTests = mockTestAttempts.filter(attempt => attempt.score >= 70).length;

  const testPerformance: TestPerformance[] = mockTests.map(test => {
    const attempts = mockTestAttempts.filter(attempt => attempt.testId === test.id);
    const lastAttemptDate = attempts.length > 0 ? attempts[attempts.length - 1].completedAt : null;
    return {
      test,
      attempts: attempts.length,
      averageScore: attempts.length > 0 
        ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) 
        : 0,
      bestScore: attempts.length > 0 ? Math.max(...attempts.map(attempt => attempt.score)) : 0,
      lastAttempt: lastAttemptDate ? new Date(lastAttemptDate).toISOString() : null
    };
  });

  const recentTrends = [
    { period: 'This Week', score: 85, change: 5, trend: 'up' as const },
    { period: 'This Month', score: 78, change: -2, trend: 'down' as const },
    { period: 'Last Month', score: 82, change: 8, trend: 'up' as const },
  ];

  return {
    totalAttempts,
    averageScore,
    totalTimeSpent,
    passedTests,
    testPerformance,
    recentTrends,
  };
}
