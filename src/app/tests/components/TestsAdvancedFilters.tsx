import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SlidersHorizontal, X } from 'lucide-react';
import { FilterPassingScore, FilterTimeLimit, SortOption } from '../hooks/useTestFilters';
import { FilterSummary } from './filters/FilterSummary';
import { PassingScoreFilter } from './filters/PassingScoreFilter';
import { SortByFilter } from './filters/SortByFilter';
import { SubjectFilter } from './filters/SubjectFilter';
import { TimeLimitFilter } from './filters/TimeLimitFilter';

interface TestsAdvancedFiltersProps {
  timeLimitRange: FilterTimeLimit;
  setTimeLimitRange: (value: FilterTimeLimit) => void;
  passingScoreRange: FilterPassingScore;
  setPassingScoreRange: (value: FilterPassingScore) => void;
  selectedSubject: string;
  setSelectedSubject: (value: string) => void;
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
  totalTests: number;
  availableTestsCount: number;
  activeFiltersCount: number;
  onClose: () => void;
  onReset: () => void;
}

export function TestsAdvancedFilters({
  timeLimitRange,
  setTimeLimitRange,
  passingScoreRange,
  setPassingScoreRange,
  selectedSubject,
  setSelectedSubject,
  sortBy,
  setSortBy,
  totalTests,
  availableTestsCount,
  activeFiltersCount,
  onClose,
  onReset
}: TestsAdvancedFiltersProps) {
  return (
    <Card className="p-6 border-2 border-blue-100 bg-blue-50/30">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Advanced Filters
          </h3>
          <Button
            variant="ghost"
            size="sm"
            style={{ padding: 8 }}
            onClick={onClose}
          >
              <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TimeLimitFilter
            timeLimitRange={timeLimitRange}
            setTimeLimitRange={setTimeLimitRange}
          />

          <PassingScoreFilter
            passingScoreRange={passingScoreRange}
            setPassingScoreRange={setPassingScoreRange}
          />

          <SubjectFilter
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
          />

          <SortByFilter
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {activeFiltersCount > 0 && (
          <FilterSummary
            availableTestsCount={availableTestsCount}
            totalTests={totalTests}
            onReset={onReset}
          />
        )}
      </div>
    </Card>
  );
}
