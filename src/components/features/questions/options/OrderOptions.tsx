'use client';

import { QuestionOption } from '@/types';

interface OrderOptionsProps {
  options: QuestionOption[];
  correctAnswer?: string | string[];
}

export const OrderOptions: React.FC<OrderOptionsProps> = ({
  options,
  correctAnswer,
}) => {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">Correct Order:</div>
      <div className="space-y-2">
        {(Array.isArray(correctAnswer) ? correctAnswer : []).map((id, index) => {
          // Find the text for the ID
          const option = options?.find(opt => opt.id === id);
          return (
            <div 
                key={index}
                className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] flex items-center gap-3"
            >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-card)] text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-primary)]">
                {index + 1}
                </span>
                <span className="text-[var(--text-primary)]">{option ? option.text : id as string}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
