'use client';

import { useState } from 'react';
import { TestsAdvancedFilters } from './components/TestsAdvancedFilters';
import { TestsEmptyState } from './components/TestsEmptyState';
import { TestsGrid } from './components/TestsGrid';
import { TestsHeader } from './components/TestsHeader';
import { TestsSearchAndFilter } from './components/TestsSearchAndFilter';
import { useTestFilters } from './hooks/useTestFilters';

export default function TestsPage() {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

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
    totalTests
  } = useTestFilters();

  return (
    <div className="space-y-6">
      {/* Header */}
      <TestsHeader 
        totalTests={totalTests} 
        availableTestsCount={sortedTests.length} 
        activeFiltersCount={activeFiltersCount} 
      />

      {/* Search and Quick Filters */}
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

      {/* Advanced Filters Panel */}
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

      {/* Tests Grid */}
      <TestsGrid
        tests={sortedTests}
        totalTests={totalTests}
        activeFiltersCount={activeFiltersCount}
      />

      {/* Empty State */}
      {sortedTests.length === 0 && (
        <TestsEmptyState
          activeFiltersCount={activeFiltersCount}
          onClearFilters={clearAllFilters}
        />
      )}
    </div>
  );
}
