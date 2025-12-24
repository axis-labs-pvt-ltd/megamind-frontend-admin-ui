'use client';

import { cn } from '@/lib/utils';
import { Question, QuestionOption } from '@/types';

// Helper function for styling logic
function getOptionStyles({
  isSelected,
  isCorrectTarget,
  showResult
}: {
  isSelected: boolean;
  isCorrectTarget: boolean;
  showResult: boolean;
}) {
  let borderClass = 'border-[var(--border-primary)]';
  let bgClass = '';

  if (showResult) {
    if (isCorrectTarget) {
      borderClass = 'border-green-500 bg-green-50 dark:bg-green-900/20';
    } else if (isSelected && !isCorrectTarget) {
      borderClass = 'border-red-500 bg-red-50 dark:bg-red-900/20';
    }
  } else if (isSelected) {
    borderClass = 'border-[var(--accent-blue)]';
    bgClass = 'bg-[var(--accent-blue)]/5'; 
  } else {
    bgClass = 'hover:bg-[var(--bg-secondary)]';
  }

  return { borderClass, bgClass };
}

interface OptionIndicatorProps {
  isMultiSelect: boolean;
  isSelected: boolean;
  isCorrectTarget: boolean;
  showResult: boolean;
}

function getIndicatorStateClass({
  isSelected,
  isCorrectTarget,
  showResult
}: Pick<OptionIndicatorProps, 'isSelected' | 'isCorrectTarget' | 'showResult'>) {
  if (showResult) {
    if (isCorrectTarget) return "bg-green-500 border-green-500";
    if (isSelected && !isCorrectTarget) return "bg-red-500 border-red-500";
  }
  return isSelected 
    ? "bg-[var(--accent-blue)] border-[var(--accent-blue)]" 
    : "border-[var(--border-hover)] bg-white";
}

function OptionIndicatorContent({ 
  isSelected, 
  isCorrectTarget, 
  showResult 
}: Pick<OptionIndicatorProps, 'isSelected' | 'isCorrectTarget' | 'showResult'>) {
  if (showResult) {
    if (isCorrectTarget) return <span className="text-white text-xs">✓</span>;
    if (isSelected && !isCorrectTarget) return <span className="text-white text-xs">✕</span>;
    return null;
  }
  if (isSelected) return <div className="w-2 h-2 bg-white rounded-full" />;
  return null;
}

function OptionIndicator({
  isMultiSelect,
  isSelected,
  isCorrectTarget,
  showResult
}: OptionIndicatorProps) {
  const baseClasses = "w-5 h-5 mt-0.5 rounded flex-shrink-0 border flex items-center justify-center transition-colors";
  const shapeClass = isMultiSelect ? "rounded-md" : "rounded-full";
  const stateClass = getIndicatorStateClass({ isSelected, isCorrectTarget, showResult });

  return (
    <div className={cn(baseClasses, shapeClass, stateClass)}>
      <OptionIndicatorContent 
        isSelected={isSelected} 
        isCorrectTarget={isCorrectTarget} 
        showResult={showResult} 
      />
    </div>
  );
}

interface MCQQuestionProps {
  question: Question;
  userAnswer: string | string[] | undefined;
  onAnswerChange: (answer: string | string[]) => void;
  showResult?: boolean;
}

export function MCQQuestion({
  question,
  userAnswer,
  onAnswerChange,
  showResult = false,
}: MCQQuestionProps) {
  if (!question.options) return null;

  const handleAnswerSelect = (optionId: string) => {
    if (showResult) return;
    
    if (question.type === 'multi-select') {
      const currentAnswers = Array.isArray(userAnswer) ? [...userAnswer] : [];
      if (currentAnswers.includes(optionId)) {
        onAnswerChange(currentAnswers.filter(id => id !== optionId));
      } else {
        onAnswerChange([...currentAnswers, optionId]);
      }
    } else {
      onAnswerChange(optionId);
    }
  };

  const isMultiSelect = question.type === 'multi-select';

  return (
    <div className={cn("grid gap-3", question.options.some(o => o.media) ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
      {question.options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          isMultiSelect={isMultiSelect}
          userAnswer={userAnswer}
          correctAnswer={question.correctAnswer as string | string[] | undefined}
          showResult={showResult}
          onSelect={handleAnswerSelect}
        />
      ))}
    </div>
  );
}

interface OptionCardProps {
  option: QuestionOption;
  isMultiSelect: boolean;
  userAnswer: string | string[] | undefined;
  correctAnswer: string | string[] | undefined;
  showResult: boolean;
  onSelect: (id: string) => void;
}

function OptionCard({
  option,
  isMultiSelect,
  userAnswer,
  correctAnswer,
  showResult,
  onSelect
}: OptionCardProps) {
  const isSelected = Array.isArray(userAnswer) 
    ? userAnswer.includes(option.id) 
    : userAnswer === option.id;

  const isCorrectTarget = Array.isArray(correctAnswer) 
    ? (correctAnswer as string[]).includes(option.id)
    : correctAnswer === option.id;

  const { borderClass, bgClass } = getOptionStyles({ isSelected, isCorrectTarget, showResult });

  return (
    <div
      className={cn(
        "relative p-4 rounded-lg border cursor-pointer transition-all duration-200 flex flex-col gap-2",
        borderClass,
        bgClass,
        showResult && "cursor-default"
      )}
      onClick={() => onSelect(option.id)}
    >
      {/* Media Content */}
      {option.media && (
        <div className="w-full aspect-video rounded-md overflow-hidden bg-black/5 mb-2">
          {option.media.type === 'image' ? (
            <img src={option.media.url} alt={option.media.altText || 'Option Image'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">Video Placeholder</div>
          )}
        </div>
      )}

      <div className="flex items-start space-x-3">
        <OptionIndicator 
          isMultiSelect={isMultiSelect}
          isSelected={isSelected}
          isCorrectTarget={isCorrectTarget}
          showResult={showResult}
        />

        <div className="flex-1">
          <span className="text-base font-medium text-[var(--text-primary)]">{option.text}</span>
        </div>
      </div>
    </div>
  );
}
