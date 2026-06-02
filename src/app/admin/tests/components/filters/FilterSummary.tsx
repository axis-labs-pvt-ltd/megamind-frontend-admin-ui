import { Button } from '@/components/ui/button';

interface FilterSummaryProps {
  availableTestsCount: number;
  totalTests: number;
  onReset: () => void;
}

export function FilterSummary({ availableTestsCount, totalTests, onReset }: FilterSummaryProps) {
  return (
    <div className="pt-4 border-t border-blue-200">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {availableTestsCount} of {totalTests} tests
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
