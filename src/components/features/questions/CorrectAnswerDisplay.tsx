// Client Component - Display correct answer indicator in question bank

'use client';

import type { Question } from '@/types';

interface CorrectAnswerDisplayProps {
  question: Question;
}

export function CorrectAnswerDisplay({ question }: CorrectAnswerDisplayProps) {
  const getCorrectAnswerText = () => {
    if (question.type === 'mcq' || question.type === 'multi-select' || question.type === 'drag-drop') {
      if (Array.isArray(question.correctAnswer)) {
        return (question.correctAnswer as string[]).join(', ');
      }
      return String(question.correctAnswer);
    }
    if (question.type === 'yes-no') {
      return String(question.correctAnswer);
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
