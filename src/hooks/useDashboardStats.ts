import { mockTestAttempts, mockTests } from '@/lib/mock-data';

export interface DashboardStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  recentAttempts: Array<{
    testTitle: string;
    score: number;
    completedAt: Date;
  }>;
}

export function useDashboardStats(): DashboardStats {
  const stats = {
    totalAttempts: mockTestAttempts.length,
    averageScore: Math.round(
      mockTestAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / mockTestAttempts.length
    ),
    bestScore: Math.max(...mockTestAttempts.map((attempt) => attempt.score)),
    totalTimeSpent: mockTestAttempts.reduce((sum, attempt) => sum + attempt.timeSpent, 0),
    recentAttempts: mockTestAttempts.slice(-3).map((attempt) => ({
      testTitle: mockTests.find((test) => test.id === attempt.testId)?.title || 'Unknown Test',
      score: attempt.score,
      completedAt: attempt.completedAt,
    })),
  };

  return stats;
}
