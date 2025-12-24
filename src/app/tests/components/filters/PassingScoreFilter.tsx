import { Target } from 'lucide-react';
import { FilterPassingScore } from '../../hooks/useTestFilters';

interface PassingScoreFilterProps {
  passingScoreRange: FilterPassingScore;
  setPassingScoreRange: (value: FilterPassingScore) => void;
}

export function PassingScoreFilter({ passingScoreRange, setPassingScoreRange }: PassingScoreFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
        <Target className="h-4 w-4" />
        Passing Score
      </label>
      <div className="space-y-2">
        {([
          { value: 'all', label: 'Any Score' },
          { value: '0-60', label: '≤ 60%' },
          { value: '61-80', label: '61-80%' },
          { value: '81-100', label: '81-100%' }
        ] as const).map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="passingScore"
              value={option.value}
              checked={passingScoreRange === option.value}
              onChange={(e) => setPassingScoreRange(e.target.value as FilterPassingScore)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-[var(--text-secondary)]">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
