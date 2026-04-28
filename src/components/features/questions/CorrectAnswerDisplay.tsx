// Client Component - Display correct answer indicator in question bank

'use client';

import type { Question } from '@/types';

interface CorrectAnswerDisplayProps {
  question: Question;
}

function getSafeAnswerArray(question: Question): string[] {
  if (Array.isArray(question.correctAnswer)) {
    return question.correctAnswer as string[];
  }
  return [String(question.correctAnswer)];
}

function formatChoiceAnswer(question: Question): string {
  const ids = getSafeAnswerArray(question);
  const textValues = ids.map(id => {
    const option = question.options?.find(opt => opt.id === id);
    return option ? option.text : id;
  });
  return textValues.join(', ');
}

function formatFillInBlankAnswer(question: Question): string {
  const answers = [String(question.correctAnswer)];
  if (question.acceptableAnswers?.length) {
    answers.push(...question.acceptableAnswers);
  }
  return answers.join(' / ');
}

function formatCorrectAnswer(question: Question): string {
  switch (question.type) {
    case 'yes-no':
    case 'true-false':
      return String(question.correctAnswer);
    case 'mcq':
    case 'multi-select':
    case 'drag-drop':
      return formatChoiceAnswer(question);
    case 'fill-in-blank':
      return formatFillInBlankAnswer(question);
    case 'matching':
      return `${question.matchingPairs?.length || 0} matching pairs`;
    default:
      return '-';
  }
}

export function CorrectAnswerDisplay({ question }: CorrectAnswerDisplayProps) {
  return (
    <div className="mt-4 p-3 rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30">
      <div className="flex items-start gap-2">
        <span className="text-xs font-semibold text-[var(--accent-blue)] uppercase tracking-wide">
          Correct Answer:
        </span>
        <span className="text-sm text-[var(--text-primary)] font-medium">
          {formatCorrectAnswer(question)}
        </span>
      </div>
    </div>
  );
}
