import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface TestsHeaderProps {
  totalTests: number;
  availableTestsCount: number;
  activeFiltersCount: number;
}

export function TestsHeader({ totalTests, availableTestsCount, activeFiltersCount }: TestsHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Available Tests</h2>
        <p className="text-[var(--text-secondary)]">
          {availableTestsCount} test{availableTestsCount !== 1 ? 's' : ''} available
          {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied)`}
        </p>
      </div>
      <Button
        variant="primary"
        onClick={() => router.push('/tests/create')}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
      >
        Create Test
      </Button>
    </div>
  );
}
