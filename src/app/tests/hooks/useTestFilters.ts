import { mockTests } from '@/lib/mock-data';
import { useMemo, useState } from 'react';
import { filterTests, sortTests } from './TestFilterUtils';

export type SortOption = 'newest' | 'oldest' | 'title' | 'difficulty' | 'attempts';
export type FilterType = 'all' | 'static' | 'dynamic';
export type FilterDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';
export type FilterStatus = 'all' | 'active' | 'inactive';
export type FilterTimeLimit = 'all' | '0-30' | '31-60' | '61-120' | '120+';
export type FilterPassingScore = 'all' | '0-60' | '61-80' | '81-100';

export function useTestFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<FilterType>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<FilterDifficulty>('all');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [timeLimitRange, setTimeLimitRange] = useState<FilterTimeLimit>('all');
  const [passingScoreRange, setPassingScoreRange] = useState<FilterPassingScore>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredTests = useMemo(() => {
    return filterTests(mockTests, {
      searchTerm,
      selectedType,
      selectedDifficulty,
      selectedStatus,
      selectedSubject,
      timeLimitRange,
      passingScoreRange
    });
  }, [searchTerm, selectedType, selectedDifficulty, selectedStatus, selectedSubject, timeLimitRange, passingScoreRange]);

  const sortedTests = useMemo(() => {
    return sortTests(filteredTests, sortBy);
  }, [filteredTests, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
    setSelectedSubject('all');
    setTimeLimitRange('all');
    setPassingScoreRange('all');
    setSortBy('newest');
  };

  const activeFiltersCount = [
    selectedType !== 'all',
    selectedDifficulty !== 'all',
    selectedStatus !== 'all',
    selectedSubject !== 'all',
    timeLimitRange !== 'all',
    passingScoreRange !== 'all',
    searchTerm !== ''
  ].filter(Boolean).length;

  return {
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
    totalTests: mockTests.length
  };
}
