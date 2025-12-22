import { Question } from '@/types';
import { useMemo, useState } from 'react';

type QuestionType = 'all' | 'mcq' | 'yes-no' | 'drag-drop';
type DifficultyLevel = 'all' | 'easy' | 'medium' | 'hard';

export function useQuestionFilters(questions: Question[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<QuestionType>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('all');

  const filteredQuestions = useMemo(() => {
    return questions.filter(question => {
      const matchesSearch = question.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || question.type === selectedType;
      const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
      return matchesSearch && matchesType && matchesDifficulty;
    });
  }, [questions, searchTerm, selectedType, selectedDifficulty]);

  return {
    searchTerm,
    selectedType,
    selectedDifficulty,
    filteredQuestions,
    setSearchTerm,
    setSelectedType,
    setSelectedDifficulty,
  };
}
