'use client';

import { TestCard } from '@/components/features/tests/TestCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockSubjects, mockTestAttempts, mockTests } from '@/lib/mock-data';
import { DynamicTestRule, Test } from '@/types';
import { BookOpen, Calendar, Clock, Filter, Search, SlidersHorizontal, Target, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TestsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'static' | 'dynamic'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [timeLimitRange, setTimeLimitRange] = useState<'all' | '0-30' | '31-60' | '61-120' | '120+'>('all');
  const [passingScoreRange, setPassingScoreRange] = useState<'all' | '0-60' | '61-80' | '81-100'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'difficulty' | 'attempts'>('newest');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getDifficultyLevel = (questionCount: number) => {
    if (questionCount <= 5) return 'beginner';
    if (questionCount <= 15) return 'intermediate';
    return 'advanced';
  };

  const getQuestionCount = (test: Test) => {
    return test.type === 'static' 
      ? test.questionIds.length 
      : test.rules.reduce((sum: number, rule: DynamicTestRule) => sum + rule.questionCount, 0);
  };

  const filteredTests = mockTests.filter(test => {
    const questionCount = getQuestionCount(test);
    const difficulty = getDifficultyLevel(questionCount);
    
    // Search filter
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (test.tags && test.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Type filter
    const matchesType = selectedType === 'all' || test.type === selectedType;
    
    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'all' || difficulty === selectedDifficulty;
    
    // Status filter
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'active' && test.isActive) ||
                         (selectedStatus === 'inactive' && !test.isActive);
    
    // Time limit filter
    const matchesTimeLimit = timeLimitRange === 'all' ||
                            (timeLimitRange === '0-30' && test.timeLimit <= 30) ||
                            (timeLimitRange === '31-60' && test.timeLimit > 30 && test.timeLimit <= 60) ||
                            (timeLimitRange === '61-120' && test.timeLimit > 60 && test.timeLimit <= 120) ||
                            (timeLimitRange === '120+' && test.timeLimit > 120);
    
    // Passing score filter
    const matchesPassingScore = passingScoreRange === 'all' ||
                               (passingScoreRange === '0-60' && test.passingScore <= 60) ||
                               (passingScoreRange === '61-80' && test.passingScore > 60 && test.passingScore <= 80) ||
                               (passingScoreRange === '81-100' && test.passingScore > 80);

    return matchesSearch && matchesType && matchesDifficulty && matchesStatus && matchesTimeLimit && matchesPassingScore;
  });

  // Sort tests
  const sortedTests = [...filteredTests].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'difficulty':
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return difficultyOrder[getDifficultyLevel(getQuestionCount(a))] - difficultyOrder[getDifficultyLevel(getQuestionCount(b))];
      case 'attempts':
        const attemptsA = mockTestAttempts.filter(attempt => attempt.testId === a.id).length;
        const attemptsB = mockTestAttempts.filter(attempt => attempt.testId === b.id).length;
        return attemptsB - attemptsA;
      default:
        return 0;
    }
  });

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Available Tests</h2>
          <p className="text-[var(--text-secondary)]">
            {sortedTests.length} test{sortedTests.length !== 1 ? 's' : ''} available
            {activeFiltersCount > 0 && ` (${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied)`}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push('/tests/create')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Create Test
        </Button>
      </div>

      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <Input
          type="search"
          placeholder="Search tests, descriptions, tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
          className="flex-1"
        />
        
        <div className="flex items-center gap-3">
          <Button
            variant={showAdvancedFilters ? "primary" : "outline"}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="whitespace-nowrap"
          >
             <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" size="sm" className="ml-2 bg-blue-100 text-blue-800">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
               <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filter Badges */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
        </div>
        
        {/* Test Type */}
        <div className="flex gap-1">
          {(['all', 'static', 'dynamic'] as const).map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? 'primary' : 'secondary'}
              className="cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setSelectedType(type)}
            >
              {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          ))}
        </div>

        {/* Difficulty */}
        <div className="flex gap-1">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
            <Badge
              key={difficulty}
              variant={selectedDifficulty === difficulty ? 'primary' : 'secondary'}
              className="cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setSelectedDifficulty(difficulty)}
            >
              {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
          ))}
        </div>

        {/* Status */}
        <div className="flex gap-1">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <Badge
              key={status}
              variant={selectedStatus === status ? 'primary' : 'secondary'}
              className="cursor-pointer hover:bg-gray-200 transition-colors"
              onClick={() => setSelectedStatus(status)}
            >
              {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
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
                onClick={() => setShowAdvancedFilters(false)}
              >
                  <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Time Limit Filter */}
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
                        onChange={(e) => setTimeLimitRange(e.target.value as 'all' | '0-30' | '31-60' | '61-120' | '120+')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-[var(--text-secondary)]">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Passing Score Filter */}
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
                        onChange={(e) => setPassingScoreRange(e.target.value as 'all' | '0-60' | '61-80' | '81-100')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-[var(--text-secondary)]">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Subject
                </label>
                <select
                  className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value="all">All Subjects</option>
                  {mockSubjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Sort By
                </label>
                <select
                  className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'title' | 'difficulty' | 'attempts')}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="difficulty">Difficulty</option>
                  <option value="attempts">Most Attempted</option>
                </select>
              </div>
            </div>

            {/* Filter Summary */}
            {activeFiltersCount > 0 && (
              <div className="pt-4 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing {sortedTests.length} of {mockTests.length} tests
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedTests.map((test, index) => (
          <div 
            key={test.id} 
            className="animate-slide-up" 
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <TestCard
              test={test}
              attemptCount={mockTestAttempts.filter(attempt => attempt.testId === test.id).length}
              onStart={() => router.push('/tests/take-test')}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedTests.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-[var(--icon-secondary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No tests found</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              {activeFiltersCount > 0 
                ? "Try adjusting your filters to see more results."
                : "No tests match your search criteria."
              }
            </p>
            {activeFiltersCount > 0 ? (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="mr-3"
              >
                Clear Filters
              </Button>
            ) : null}
            <Button
              variant="primary"
              onClick={() => router.push('/tests/create')}
            >
              Create Your First Test
            </Button>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {sortedTests.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-6 border-t">
          Showing {sortedTests.length} of {mockTests.length} tests
          {activeFiltersCount > 0 && ` with ${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} applied`}
        </div>
      )}
    </div>
  );
}
