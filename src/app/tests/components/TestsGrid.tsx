// Client Component - Grid of test cards
'use client';

import { TestCard } from '@/components/features/tests/TestCard';
import { mockTestAttempts } from '@/lib/mock-data';
import { Test } from '@/types';
import { useRouter } from 'next/navigation';

interface TestsGridProps {
  tests: Test[];
  totalTests: number;
  activeFiltersCount: number;
}

export function TestsGrid({ tests, totalTests, activeFiltersCount }: TestsGridProps) {
  const router = useRouter();

  if (tests.length === 0) return null;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {tests.map(test => (
          <TestCard
            key={test.id}
            test={test}
            attemptCount={mockTestAttempts.filter(a => a.testId === test.id).length}
            onStart={() => router.push(`/tests/take-test?testId=${test.id}`)}
          />
        ))}
      </div>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-primary)' }}>
        Showing {tests.length} of {totalTests} test{totalTests !== 1 ? 's' : ''}
        {activeFiltersCount > 0 && ` · ${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied`}
      </p>
    </div>
  );
}
