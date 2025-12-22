'use client';

import { TestCard } from '@/components/features/tests/TestCard';
import { Button } from '@/components/ui/button';
import { mockTestAttempts, mockTests } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

export function AvailableTestsList() {
  const router = useRouter();

  return (
    <div className="animate-slide-up animation-delay-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)]">Available Tests</h3>
          <p className="text-[var(--text-secondary)] mt-1">
            Continue your learning with these recommended tests
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push('/tests')}
          className="hover:bg-[var(--accent-blue)]/10 hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]"
        >
          View All Tests
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTests.slice(0, 3).map((test) => (
          <TestCard
            key={test.id}
            test={test}
            attemptCount={mockTestAttempts.filter((attempt) => attempt.testId === test.id).length}
            onStart={() => router.push('/tests/take-test')}
          />
        ))}
      </div>
    </div>
  );
}
