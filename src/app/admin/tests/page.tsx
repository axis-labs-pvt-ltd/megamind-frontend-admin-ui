// TestsPage.tsx
'use client';

import { fetchTests } from '@/services/api/tests';
import { Test } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import { TestsAdvancedFilters } from './components/TestsAdvancedFilters';
import { TestsEmptyState } from './components/TestsEmptyState';
import { TestsGrid } from './components/TestsGrid';
import { TestsHeader } from './components/TestsHeader';
import { TestsSearchAndFilter } from './components/TestsSearchAndFilter';
import { useTestFilters } from './hooks/useTestFilters';

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const loadTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTests();
      setTests(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load tests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTests(); }, [loadTests]);

  const {
  searchTerm, setSearchTerm,
  selectedType, setSelectedType,
  selectedDifficulty, setSelectedDifficulty,
  selectedStatus, setSelectedStatus,
  selectedSubject, setSelectedSubject,
  timeLimitRange, setTimeLimitRange,
  passingScoreRange, setPassingScoreRange,
  sortBy, setSortBy,
  sortedTests,
  clearAllFilters,
  activeFiltersCount,
  totalTests,
} = useTestFilters(tests); // pass real tests instead of mock  tests

  if (loading) return <div className="py-12 text-center text-[var(--text-secondary)]">Loading tests...</div>;

  return (
    <div className="space-y-6">
      <TestsHeader
        totalTests={totalTests}
        availableTestsCount={sortedTests.length}
        activeFiltersCount={activeFiltersCount}
      />

      {error && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
      )}

      <TestsSearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showAdvancedFilters={showAdvancedFilters}
        setShowAdvancedFilters={setShowAdvancedFilters}
        activeFiltersCount={activeFiltersCount}
        clearAllFilters={clearAllFilters}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {showAdvancedFilters && (
        <TestsAdvancedFilters
          timeLimitRange={timeLimitRange}
          setTimeLimitRange={setTimeLimitRange}
          passingScoreRange={passingScoreRange}
          setPassingScoreRange={setPassingScoreRange}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          sortBy={sortBy}
          setSortBy={setSortBy}
          totalTests={totalTests}
          availableTestsCount={sortedTests.length}
          activeFiltersCount={activeFiltersCount}
          onClose={() => setShowAdvancedFilters(false)}
          onReset={clearAllFilters}
        />
      )}

      <TestsGrid tests={sortedTests} totalTests={totalTests} activeFiltersCount={activeFiltersCount} />

      {sortedTests.length === 0 && (
        <TestsEmptyState activeFiltersCount={activeFiltersCount} onClearFilters={clearAllFilters} />
      )}
    </div>
  );
}