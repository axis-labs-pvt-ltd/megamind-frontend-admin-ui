'use client';

import { cn } from '@/lib/utils';
import { QuestionOption } from '@/types';

interface BooleanOptionsProps {
  options: QuestionOption[];
  correctAnswer?: string | string[];
  showAnswer?: boolean;
}

export const BooleanOptions: React.FC<BooleanOptionsProps> = ({
  options,
  correctAnswer,
  showAnswer = false,
}) => {
  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <div
          key={option.id}
          className={cn(
            "flex-1 p-3 rounded-lg border text-center font-medium",
            showAnswer && correctAnswer === option.id
              ? 'bg-green-500/10 border-green-500/30 text-green-700'
              : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)]'
          )}
        >
          {option.text}
        </div>
      ))}
    </div>
  );
};
