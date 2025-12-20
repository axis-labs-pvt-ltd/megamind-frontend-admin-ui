// Shared Analytics Types

import { Test } from '@/types';

export interface TestPerformance {
  test: Test;
  attempts: number;
  averageScore: number;
  bestScore: number;
  lastAttempt: string | null;
}

export interface PerformanceTrendData {
  period: string;
  score: number;
  change: number;
  trend: 'up' | 'down';
}
