import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TestsEmptyStateProps {
  activeFiltersCount: number;
  onClearFilters: () => void;
}

export function TestsEmptyState({ activeFiltersCount, onClearFilters }: TestsEmptyStateProps) {
  const router = useRouter();

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="h-8 w-8 text-[var(--icon-secondary)]" />
        </div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No tests found</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          {activeFiltersCount > 0 
            ? "Try adjusting your filters to see more results."
            : "No tests match your search criteria."
          }
        </p>
        {activeFiltersCount > 0 ? (
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="mr-3"
          >
            Clear Filters
          </Button>
        ) : null}
        <Button
          variant="primary"
          onClick={() => router.push('/tests/create')}
        >
          Create Your First Test
        </Button>
      </div>
    </div>
  );
}
