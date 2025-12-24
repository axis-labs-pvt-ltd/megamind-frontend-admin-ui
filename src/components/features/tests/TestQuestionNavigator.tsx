import { cn } from '@/lib/utils';
import { Question } from '@/types';

interface TestQuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string | string[]>;
  flaggedQuestions: Set<string>;
  isSubmitted: boolean;
  onNavigate: (index: number) => void;
}

interface NavigatorButtonProps {
  index: number;
  isActive: boolean;
  isFlagged: boolean;
  isAnswered: boolean;
  isSubmitted: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  onClick: () => void;
}

function getButtonStateClasses({
  isActive,
  isSubmitted,
  isCorrect,
  isWrong,
  isFlagged,
  isAnswered,
}: Pick<NavigatorButtonProps, 'isActive' | 'isSubmitted' | 'isCorrect' | 'isWrong' | 'isFlagged' | 'isAnswered'>): string {
  let classes = "w-full aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-all duration-200 border-2";

  if (isActive) {
    return `${classes} border-[var(--accent-blue)] ring-2 ring-[var(--accent-blue)]/20 bg-[var(--accent-blue)] text-white shadow-md z-10 transform scale-110`;
  }

  if (isSubmitted) {
    if (isCorrect) return `${classes} border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400`;
    if (isWrong) return `${classes} border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400`;
    return `${classes} border-[var(--border-primary)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] opacity-50`;
  }

  if (isFlagged) {
    return `${classes} border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400`;
  }

  if (isAnswered) {
    return `${classes} border-[var(--accent-blue)]/50 bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]`;
  }

  return `${classes} border-[var(--border-primary)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]`;
}

function NavigatorButton(props: NavigatorButtonProps) {
  const {
    index,
    isActive,
    isFlagged,
    isSubmitted,
    onClick,
  } = props;

  const className = getButtonStateClasses(props);

  return (
    <button
      onClick={onClick}
      className={cn(className, "relative group")}
      aria-label={`Go to question ${index + 1}`}
      title={`Question ${index + 1}${isFlagged ? ' (Flagged)' : ''}${props.isAnswered ? ' (Answered)' : ''}`}
    >
      {index + 1}
      {/* Show Flag indicator even if submitted */}
      {isFlagged && !isActive && (
        <div className={cn(
            "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white dark:border-gray-800",
            isSubmitted ? "bg-amber-500 z-10" : "bg-amber-500"
        )} />
      )}
    </button>
  );
}

function NavigatorLegend({ isSubmitted }: { isSubmitted: boolean }) {
  if (!isSubmitted) {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border-2 border-[var(--accent-blue)] bg-[var(--accent-blue)]" />
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border-2 border-[var(--accent-blue)]/50 bg-[var(--accent-blue)]/10" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border-2 border-amber-400 bg-amber-50 dark:bg-amber-900/20" />
          <span>Flagged</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border-2 border-[var(--border-primary)] bg-[var(--bg-card)]" />
          <span>Unanswered</span>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm border-2 border-green-500 bg-green-50" />
        <span>Correct</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm border-2 border-red-500 bg-red-50" />
        <span>Wrong</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative w-3 h-3 rounded-sm border-2 border-gray-300 bg-gray-100">
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
        </div>
        <span>Flagged</span>
      </div>
    </>
  );
}

export function TestQuestionNavigator({
  questions,
  currentIndex,
  answers,
  flaggedQuestions,
  isSubmitted,
  onNavigate,
}: TestQuestionNavigatorProps) {
  
  // Calculate stats
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flaggedQuestions.size;
  const totalCount = questions.length;

  return (
    <div className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-24 space-y-4">
        <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border-primary)] shadow-sm overflow-hidden flex flex-col max-h-[calc(100vh-8rem)]">
          <div className="p-4 border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 flex-shrink-0">
            <h3 className="font-semibold text-[var(--text-primary)]">Question Navigator</h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-secondary)]">
              <div className="flex items-center gap-1">
                <span className="font-medium text-[var(--text-primary)]">{answeredCount}/{totalCount}</span>
                <span>Answered</span>
              </div>
              <div className="w-px h-3 bg-[var(--border-primary)]" />
              <div className="flex items-center gap-1">
                 <span className="font-medium text-amber-600">{flaggedCount}</span>
                 <span>Flagged</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isFlagged = flaggedQuestions.has(q.id);
                // Fix: ensure boolean context for isAnswered
                const isAnswered = answers && !!answers[q.id];
                const isCorrect = isSubmitted && (answers?.[q.id] === q.correctAnswer);
                // Fix: ensure boolean context for isWrong
                const isWrong = isSubmitted && !!answers?.[q.id] && (answers?.[q.id] !== q.correctAnswer);

                return (
                  <NavigatorButton
                    key={q.id}
                    index={idx}
                    isActive={isCurrent}
                    isFlagged={isFlagged}
                    isAnswered={isAnswered}
                    isSubmitted={isSubmitted}
                    isCorrect={isCorrect}
                    isWrong={isWrong}
                    onClick={() => onNavigate(idx)}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 space-y-2 text-xs text-[var(--text-secondary)] border-t border-[var(--border-primary)] pt-4">
               <NavigatorLegend isSubmitted={isSubmitted} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
