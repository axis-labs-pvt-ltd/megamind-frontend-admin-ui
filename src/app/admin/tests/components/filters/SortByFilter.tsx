import { Calendar } from 'lucide-react';
import { SortOption } from '../../hooks/useTestFilters';

interface SortByFilterProps {
  sortBy: SortOption;
  setSortBy: (value: SortOption) => void;
}

export function SortByFilter({ sortBy, setSortBy }: SortByFilterProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Sort By
      </label>
      <select
        className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="title">Title (A-Z)</option>
        <option value="difficulty">Difficulty</option>
        <option value="attempts">Most Attempted</option>
      </select>
    </div>
  );
}
