// Client Component - Display answer options for MCQ and Multi-Select questions
'use client';

import { cn } from '@/lib/utils';
import { QuestionOption } from '@/types';

interface AnswerOptionsProps {
  options: QuestionOption[];
  correctAnswer: string | string[];
  userAnswer?: string | string[];
  showAnswer?: boolean;
  isMultiSelect?: boolean;
}

const getOptionVariant = (
  isCorrectOption: boolean,
  isUserAnswer: boolean,
  showAnswer: boolean
) => {
  if (!showAnswer) return 'bg-[var(--bg-secondary)] border-[var(--border-primary)]';
  
  if (isCorrectOption) {
    return 'bg-green-500/10 border-green-500/30';
  }
  
  if (isUserAnswer && !isCorrectOption) {
    return 'bg-red-500/10 border-red-500/30';
  }
  
  return 'bg-[var(--bg-secondary)] border-[var(--border-primary)]';
};

interface AnswerOptionItemProps {
  option: QuestionOption;
  index: number;
  isCorrectOption: boolean;
  isUserAnswer: boolean;
  showAnswer: boolean;
  isMultiSelect: boolean;
}

function AnswerOptionItem({
  option,
  index,
  isCorrectOption,
  isUserAnswer,
  showAnswer,
  isMultiSelect
}: AnswerOptionItemProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-lg border",
        getOptionVariant(isCorrectOption, isUserAnswer, showAnswer)
      )}
    >
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          {String.fromCharCode(65 + index)}
        </span>
        <span className="text-sm text-[var(--text-primary)] whitespace-normal">{option.text}</span>
        {isMultiSelect && showAnswer && isCorrectOption && (
          <span className="ml-auto text-green-500 text-xs">✓</span>
        )}
      </div>
    </div>
  );
}

export function AnswerOptions({
  options,
  correctAnswer,
  userAnswer,
  showAnswer = false,
  isMultiSelect = false
}: AnswerOptionsProps) {
  const correctAnswers = Array.isArray(correctAnswer) 
    ? (correctAnswer as string[])
    : [correctAnswer as string];
  
  const userAnswers = Array.isArray(userAnswer)
    ? (userAnswer as string[])
    : userAnswer ? [userAnswer as string] : [];

  return (
    <div className="flex flex-col gap-2 w-full">
      {options.map((option, index) => (
        <AnswerOptionItem
          key={option.id}
          option={option}
          index={index}
          isCorrectOption={correctAnswers.includes(option.id)}
          isUserAnswer={userAnswers.includes(option.id)}
          showAnswer={showAnswer}
          isMultiSelect={isMultiSelect}
        />
      ))}
    </div>
  );
}
