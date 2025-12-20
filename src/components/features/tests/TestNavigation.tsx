// Client Component - Test Navigation
'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, ChevronLeft, ChevronRight, Flag } from 'lucide-react';

interface TestNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onFlag: () => void;
  isFlagged: boolean;
}

export function TestNavigation({
  currentIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  onFlag,
  isFlagged,
}: TestNavigationProps) {
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 md:gap-0">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentIndex === 0}
        className="w-full md:w-auto"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>

      <div className="flex items-center space-x-2 w-full md:w-auto justify-center">
        <Button
          variant={isFlagged ? "secondary" : "ghost"}
          onClick={onFlag}
          className={`w-full md:w-auto ${isFlagged ? "text-yellow-600 bg-yellow-100 hover:bg-yellow-200" : ""}`}
        >
          <Flag className={`h-4 w-4 mr-2 ${isFlagged ? "fill-current" : ""}`} />
          {isFlagged ? "Flagged" : "Flag for Review"}
        </Button>
      </div>

      {isLastQuestion ? (
        <Button
          variant="primary"
          onClick={onSubmit}
          className="w-full md:w-auto"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Submit Test
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={onNext}
          className="w-full md:w-auto"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
}
