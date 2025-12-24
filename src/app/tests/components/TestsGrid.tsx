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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test, index) => (
          <div 
            key={test.id} 
            className="animate-slide-up" 
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TestCard
              test={test}
              attemptCount={mockTestAttempts.filter(attempt => attempt.testId === test.id).length}
              onStart={() => router.push('/tests/take-test')}
            />
          </div>
        ))}
      </div>

       {/* Results Summary */}
       {tests.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-6 border-t">
          Showing {tests.length} of {totalTests} tests
          {activeFiltersCount > 0 && ` with ${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied`}
        </div>
      )}
    </>
  );
}
