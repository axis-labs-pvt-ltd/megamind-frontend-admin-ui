import { Clock } from 'lucide-react';
import { FilterTimeLimit } from '../../hooks/useTestFilters';

interface TimeLimitFilterProps {
  timeLimitRange: FilterTimeLimit;
  setTimeLimitRange: (value: FilterTimeLimit) => void;
}

export function TimeLimitFilter({ timeLimitRange, setTimeLimitRange }: TimeLimitFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Time Limit
      </label>
      <div className="space-y-2">
        {([
          { value: 'all', label: 'Any Duration' },
          { value: '0-30', label: '≤ 30 minutes' },
          { value: '31-60', label: '31-60 minutes' },
          { value: '61-120', label: '61-120 minutes' },
          { value: '120+', label: '> 120 minutes' }
        ] as const).map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="timeLimit"
              value={option.value}
              checked={timeLimitRange === option.value}
              onChange={(e) => setTimeLimitRange(e.target.value as FilterTimeLimit)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-[var(--text-secondary)]">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
