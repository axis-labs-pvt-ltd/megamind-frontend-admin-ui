'use client';

import { cn } from '@/lib/utils';
import { Question } from '@/types';

interface SimplifiedMCQQuestionProps {
  question: Question;
  userAnswer: string | string[] | undefined;
  onAnswerChange: (answer: string) => void;
  showResult?: boolean;
}

function getDefaultOptions(type: string) {
  if (type === 'true-false') {
    return [
      { id: 'true', text: 'True' },
      { id: 'false', text: 'False' },
    ];
  }
  if (type === 'yes-no') {
    return [
      { id: 'Yes', text: 'Yes' },
      { id: 'No', text: 'No' },
    ];
  }
  return [];
}

function normalise(val: string) {
  return val?.toString().toLowerCase().trim();
}

export function SimplifiedMCQQuestion({
  question,
  userAnswer,
  onAnswerChange,
  showResult = false,
}: SimplifiedMCQQuestionProps) {
  const options =
    question.options && question.options.length > 0
      ? question.options
      : getDefaultOptions(question.type);

  if (!options.length) return null;

  // Normalise userAnswer to string
  const answer = Array.isArray(userAnswer) ? userAnswer[0] : userAnswer;

  // Normalise correctAnswer to string — handles string, string[], MatchingPair
  const correctAnswer = Array.isArray(question.correctAnswer)
    ? String(question.correctAnswer[0])
    : String(question.correctAnswer ?? '');

  return (
    <div className="flex space-x-4">
      {options.map((option) => {
        const isSelected =
          normalise(answer ?? '') === normalise(option.id) ||
          normalise(answer ?? '') === normalise(option.text);

        const isCorrect =
          normalise(correctAnswer) === normalise(option.id) ||
          normalise(correctAnswer) === normalise(option.text);

        let borderClass = 'border-[var(--border-primary)]';
        let bgClass = '';

        if (showResult) {
          if (isCorrect) {
            borderClass = 'border-green-500 bg-green-50 text-green-700';
          } else if (isSelected && !isCorrect) {
            borderClass = 'border-red-500 bg-red-50 text-red-700';
          }
        } else if (isSelected) {
          borderClass =
            'border-[var(--accent-blue)] bg-[var(--accent-blue)] text-white shadow-md';
        } else {
          bgClass = 'hover:bg-[var(--bg-secondary)]';
        }

        return (
          <div
            key={option.id}
            className={cn(
              'flex-1 p-4 rounded-lg border cursor-pointer transition-all duration-200 text-center font-medium text-lg',
              borderClass,
              bgClass,
              showResult && 'cursor-default'
            )}
            onClick={() => !showResult && onAnswerChange(option.id)}
          >
            {option.text}
          </div>
        );
      })}
    </div>
  );
}