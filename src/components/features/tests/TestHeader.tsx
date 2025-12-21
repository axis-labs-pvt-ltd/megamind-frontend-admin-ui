// Client Component - Test Header (Timer & Progress)
'use client';

import { Badge } from '@/components/ui/badge';
import { Timer } from '@/components/ui/timer';

interface TestHeaderProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredCount: number;
  timeLimit: number; // in minutes
  onTimeUp: () => void;
  isSubmitted?: boolean;
}

export function TestHeader({
  currentQuestionIndex,
  totalQuestions,
  answeredCount,
  timeLimit,
  onTimeUp,
  isSubmitted = false,
}: TestHeaderProps) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
        <div className="flex items-center justify-between md:justify-start w-full md:w-auto space-x-4">
          <Badge variant="primary">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Badge>
          <Timer
            initialTime={timeLimit * 60}
            onTimeUp={onTimeUp}
            isRunning={!isSubmitted}
          />
        </div>
        <div className="flex items-center justify-end w-full md:w-auto space-x-2">
          <span className="text-sm text-[var(--text-secondary)]">
            {answeredCount}/{totalQuestions} answered
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[var(--bg-secondary)] rounded-full h-2">
        <div
          className="bg-[var(--accent-blue)] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
