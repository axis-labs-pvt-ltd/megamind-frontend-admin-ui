// Client Component - Expandable advanced filter panel
'use client';

import { X } from 'lucide-react';
import { FilterPassingScore, FilterTimeLimit, SortOption } from '../hooks/useTestFilters';
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
  timeLimitRange, setTimeLimitRange,
  passingScoreRange, setPassingScoreRange,
  selectedSubject, setSelectedSubject,
  sortBy, setSortBy,
  totalTests, availableTestsCount, activeFiltersCount,
  onClose, onReset,
}: TestsAdvancedFiltersProps) {
  return (
    <div style={{
      border: '1.5px solid var(--border-primary)',
      borderRadius: 14,
      background: 'var(--bg-secondary)',
      padding: 24,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Advanced Filters</span>
        <button
          onClick={onClose}
          style={{ width: 28, height: 28, borderRadius: 8, border: '1.5px solid var(--border-primary)', background: 'var(--bg-card)', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Filter grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
        <TimeLimitFilter timeLimitRange={timeLimitRange} setTimeLimitRange={setTimeLimitRange} />
        <PassingScoreFilter passingScoreRange={passingScoreRange} setPassingScoreRange={setPassingScoreRange} />
        <SubjectFilter selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} />
        <SortByFilter sortBy={sortBy} setSortBy={setSortBy} />
      </div>

      {/* Footer summary */}
      {activeFiltersCount > 0 && (
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{availableTestsCount}</strong> of {totalTests} tests
          </span>
          <button
            onClick={onReset}
            style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
