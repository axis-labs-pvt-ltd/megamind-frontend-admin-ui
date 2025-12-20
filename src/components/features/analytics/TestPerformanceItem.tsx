// Client Component - Displays individual test performance metrics

'use client';

import { Badge } from '@/components/ui/badge';
import { NeumorphicWrapper } from '@/components/ui/neumorphic-wrapper';
import { TestPerformance } from './types';

interface TestPerformanceItemProps {
  performance: TestPerformance;
  delay?: number;
}

export function TestPerformanceItem({ performance, delay = 0 }: TestPerformanceItemProps) {
  return (
    <NeumorphicWrapper
      variant="secondary" // Inset/Pressed look for list items
      className="p-4 border border-[var(--border-primary)] rounded-lg animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-[var(--text-primary)]">{performance.test.title}</h4>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {performance.attempts} attempts
          </Badge>
          <Badge variant={performance.averageScore >= 80 ? 'success' : performance.averageScore >= 60 ? 'warning' : 'danger'}>
            {performance.averageScore}% avg
          </Badge>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div>
          <p className="text-[var(--text-secondary)]">Average Score</p>
          <p className="font-medium text-[var(--text-primary)]">{performance.averageScore}%</p>
        </div>
        <div>
          <p className="text-[var(--text-secondary)]">Best Score</p>
          <p className="font-medium text-[var(--text-primary)]">{performance.bestScore}%</p>
        </div>
        <div>
          <p className="text-[var(--text-secondary)]">Attempts</p>
          <p className="font-medium text-[var(--text-primary)]">{performance.attempts}</p>
        </div>
        <div>
          <p className="text-[var(--text-secondary)]">Last Attempt</p>
          <p className="font-medium text-[var(--text-primary)]">
            {performance.lastAttempt ? new Date(performance.lastAttempt).toLocaleDateString() : 'Never'}
          </p>
        </div>
      </div>
    </NeumorphicWrapper>
  );
}
