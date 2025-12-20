// Client Component - Display answer options for MCQ and Multi-Select questions

'use client';

import { cn } from '@/lib/utils';

interface AnswerOptionsProps {
  options: string[];
  correctAnswer: string | string[];
  userAnswer?: string | string[];
  showAnswer?: boolean;
  isMultiSelect?: boolean;
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
      {options.map((option, index) => {
        const isCorrectOption = correctAnswers.includes(option);
        const isUserAnswer = userAnswers.includes(option);
        
        return (
          <div
            key={index}
            className={cn(
              "p-3 rounded-lg border",
               showAnswer
                ? isCorrectOption
                  ? 'bg-green-500/10 border-green-500/30'
                  : isUserAnswer && !isCorrectOption
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'
                : 'bg-[var(--bg-secondary)] border-[var(--border-primary)]'
            )}
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-sm text-[var(--text-primary)] whitespace-normal">{option}</span>
              {isMultiSelect && showAnswer && isCorrectOption && (
                <span className="ml-auto text-green-500 text-xs">✓</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
