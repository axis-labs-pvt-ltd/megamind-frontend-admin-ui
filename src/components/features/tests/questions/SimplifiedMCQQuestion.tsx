'use client';

import { cn } from '@/lib/utils';
import { Question } from '@/types';

interface SimplifiedMCQQuestionProps {
  question: Question;
  userAnswer: string | undefined;
  onAnswerChange: (answer: string) => void;
  showResult?: boolean;
}

export function SimplifiedMCQQuestion({
  question,
  userAnswer,
  onAnswerChange,
  showResult = false,
}: SimplifiedMCQQuestionProps) {
    if (!question.options) return null;

    const handleAnswerSelect = (optionId: string) => {
        if (showResult) return;
        onAnswerChange(optionId);
    };

    return (
        <div className="flex space-x-4">
            {question.options.map((option) => {
            const isSelected = userAnswer === option.id;
            const isCorrect = question.correctAnswer === option.id; // Correct answer stores ID

                // Styling logic
            let borderClass = 'border-[var(--border-primary)]';
            let bgClass = '';
            let textColor = 'text-[var(--text-primary)]';

            if (showResult) {
                if (isCorrect) {
                        borderClass = 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300';
                } else if (isSelected && !isCorrect) {
                        borderClass = 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300';
                }
            } else if (isSelected) {
                    borderClass = 'border-[var(--accent-blue)] bg-[var(--accent-blue)] text-white shadow-md';
                    textColor = 'text-white';
            } else {
                    bgClass = 'hover:bg-[var(--bg-secondary)]';
            }

            return (
                <div
                key={option.id}
                className={cn(
                    "flex-1 p-4 rounded-lg border cursor-pointer transition-all duration-200 text-center font-medium text-lg",
                    borderClass,
                    bgClass,
                    showResult && "cursor-default"
                )}
                onClick={() => handleAnswerSelect(option.id)}
                >
                    {option.text}
                </div>
            );
            })}
        </div>
    );
}
