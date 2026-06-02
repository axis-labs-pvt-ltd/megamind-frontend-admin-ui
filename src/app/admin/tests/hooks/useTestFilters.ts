// hooks/useTestFilters.ts
import { Test } from '@/types';
import { useMemo, useState } from 'react';

export type FilterType = 'all' | 'static' | 'dynamic';
export type FilterDifficulty = 'all' | 'beginner' | 'intermediate' | 'advanced';
export type FilterStatus = 'all' | 'active' | 'inactive';
export type FilterTimeLimit = 'all' | 'short' | 'medium' | 'long';
export type FilterPassingScore = 'all' | 'easy' | 'moderate' | 'strict';
export type SortOption = 'newest' | 'oldest' | 'title' | 'passing-score';

export function useTestFilters(tests: Test[] = []) { // ✅ accept tests as param
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<FilterType>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<FilterDifficulty>('all');
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [timeLimitRange, setTimeLimitRange] = useState<FilterTimeLimit>('all');
  const [passingScoreRange, setPassingScoreRange] = useState<FilterPassingScore>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredTests = useMemo(() => {
    return tests.filter(test => {
      const matchesSearch =
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = selectedType === 'all' || test.type === selectedType;

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && test.isActive) ||
        (selectedStatus === 'inactive' && !test.isActive);

      const matchesTimeLimit =
        timeLimitRange === 'all' ||
        (timeLimitRange === 'short' && test.timeLimit <= 20) ||
        (timeLimitRange === 'medium' && test.timeLimit > 20 && test.timeLimit <= 45) ||
        (timeLimitRange === 'long' && test.timeLimit > 45);

      const matchesPassingScore =
        passingScoreRange === 'all' ||
        (passingScoreRange === 'easy' && test.passingScore < 60) ||
        (passingScoreRange === 'moderate' && test.passingScore >= 60 && test.passingScore < 80) ||
        (passingScoreRange === 'strict' && test.passingScore >= 80);

      return matchesSearch && matchesType && matchesStatus && matchesTimeLimit && matchesPassingScore;
    });
  }, [tests, searchTerm, selectedType, selectedStatus, timeLimitRange, passingScoreRange]);

  const sortedTests = useMemo(() => {
    return [...filteredTests].sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title': return a.title.localeCompare(b.title);
        case 'passing-score': return b.passingScore - a.passingScore;
        default: return 0;
      }
    });
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
    searchTerm !== '',
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
    totalTests: tests.length,
  };
}