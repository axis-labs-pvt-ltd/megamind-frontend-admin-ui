// Client Component - Display correct answer indicator in question bank

'use client';

import type { Question } from '@/types';

interface CorrectAnswerDisplayProps {
  question: Question;
}

export function CorrectAnswerDisplay({ question }: CorrectAnswerDisplayProps) {
  const getCorrectAnswerText = () => {
    if (question.type === 'mcq' || question.type === 'multi-select' || question.type === 'drag-drop') {
      const ids = Array.isArray(question.correctAnswer) 
        ? (question.correctAnswer as string[]) 
        : [String(question.correctAnswer)];
      
      const textValues = ids.map(id => {
        const option = question.options?.find(opt => opt.id === id);
        return option ? option.text : id;
      });

      return textValues.join(', ');
    }
    if (question.type === 'yes-no' || question.type === 'true-false') {
        // Find text for Yes/No ID
        const id = String(question.correctAnswer);
        const option = question.options?.find(opt => opt.id === id);
        return option ? option.text : id;
    }
    if (question.type === 'fill-in-blank') {
      const answers = [String(question.correctAnswer)];
      if (question.acceptableAnswers?.length) {
        answers.push(...question.acceptableAnswers);
      }
      return answers.join(' / ');
    }
    if (question.type === 'matching') {
      return `${question.matchingPairs?.length || 0} matching pairs`;
    }
    return '-';
  };

  return (
    <div className="mt-4 p-3 rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30">
      <div className="flex items-start gap-2">
        <span className="text-xs font-semibold text-[var(--accent-blue)] uppercase tracking-wide">
          Correct Answer:
        </span>
        <span className="text-sm text-[var(--text-primary)] font-medium">
          {getCorrectAnswerText()}
        </span>
      </div>
    </div>
  );
}
