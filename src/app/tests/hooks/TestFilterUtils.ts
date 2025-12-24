import { mockTestAttempts } from '@/lib/mock-data';
import { DynamicTestRule, Test } from '@/types';
import { FilterDifficulty, FilterPassingScore, FilterStatus, FilterTimeLimit, FilterType, SortOption } from './useTestFilters';

export const getQuestionCount = (test: Test): number => {
  return test.type === 'static' 
    ? test.questionIds.length 
    : test.rules.reduce((sum: number, rule: DynamicTestRule) => sum + rule.questionCount, 0);
};

export const getDifficultyLevel = (questionCount: number): string => {
  if (questionCount <= 5) return 'beginner';
  if (questionCount <= 15) return 'intermediate';
  return 'advanced';
};

export interface FilterState {
  searchTerm: string;
  selectedType: FilterType;
  selectedDifficulty: FilterDifficulty;
  selectedStatus: FilterStatus;
  selectedSubject: string;
  timeLimitRange: FilterTimeLimit;
  passingScoreRange: FilterPassingScore;
}

export const checkSearchTerm = (test: Test, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  const term = searchTerm.toLowerCase();
  return test.title.toLowerCase().includes(term) ||
         test.description.toLowerCase().includes(term) ||
         (test.tags && test.tags.some(tag => tag.toLowerCase().includes(term))) || false;
};

export const checkStatus = (test: Test, status: FilterStatus): boolean => {
  if (status === 'all') return true;
  if (status === 'active') return test.isActive;
  if (status === 'inactive') return !test.isActive;
  return false;
};

export const checkTimeLimit = (test: Test, range: FilterTimeLimit): boolean => {
  if (range === 'all') return true;
  const { timeLimit } = test;
  if (range === '0-30') return timeLimit <= 30;
  if (range === '31-60') return timeLimit > 30 && timeLimit <= 60;
  if (range === '61-120') return timeLimit > 60 && timeLimit <= 120;
  if (range === '120+') return timeLimit > 120;
  return false;
};

export const checkPassingScore = (test: Test, range: FilterPassingScore): boolean => {
  if (range === 'all') return true;
  const { passingScore } = test;
  if (range === '0-60') return passingScore <= 60;
  if (range === '61-80') return passingScore > 60 && passingScore <= 80;
  if (range === '81-100') return passingScore > 80;
  return false;
};


export const checkType = (test: Test, type: FilterType): boolean => {
  return type === 'all' || test.type === type;
};

export const checkDifficulty = (difficulty: string, selectedDifficulty: FilterDifficulty): boolean => {
  return selectedDifficulty === 'all' || difficulty === selectedDifficulty;
};

export const checkSubject = (test: Test, subjectId: string): boolean => {
  return subjectId === 'all' || test.subjectId === subjectId;
};

export const filterTests = (tests: Test[], filters: FilterState): Test[] => {
  return tests.filter(test => {
    const questionCount = getQuestionCount(test);
    const difficulty = getDifficultyLevel(questionCount);

    return checkType(test, filters.selectedType) &&
           checkDifficulty(difficulty, filters.selectedDifficulty) &&
           checkSubject(test, filters.selectedSubject) &&
           checkSearchTerm(test, filters.searchTerm) &&
           checkStatus(test, filters.selectedStatus) &&
           checkTimeLimit(test, filters.timeLimitRange) &&
           checkPassingScore(test, filters.passingScoreRange);
  });
};


export const sortTests = (tests: Test[], sortBy: SortOption): Test[] => {
  return [...tests].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      case 'difficulty':
        const difficultyOrder: Record<string, number> = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        return difficultyOrder[getDifficultyLevel(getQuestionCount(a))] - difficultyOrder[getDifficultyLevel(getQuestionCount(b))];
      case 'attempts':
        const attemptsA = mockTestAttempts.filter((attempt: any) => attempt.testId === a.id).length;
        const attemptsB = mockTestAttempts.filter((attempt: any) => attempt.testId === b.id).length;
        return attemptsB - attemptsA;
      default:
        return 0;
    }
  });
};
