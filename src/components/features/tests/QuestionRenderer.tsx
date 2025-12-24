'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Question, QuestionType } from '@/types';
import { DragDropQuestion } from './questions/DragDropQuestion';
import { MCQQuestion } from './questions/MCQQuestion';
import { SimplifiedMCQQuestion } from './questions/SimplifiedMCQQuestion';
import { TextQuestion } from './questions/TextQuestion';

interface QuestionRendererProps {
  question: Question;
  userAnswer: string | string[] | undefined;
  onAnswerChange: (answer: string | string[]) => void;
  showResult?: boolean; // Review Mode
}

const getHelperText = (type: QuestionType): string => {
  switch (type) {
    case 'mcq':
    case 'true-false':
    case 'yes-no':
      return 'Select one option';
    case 'multi-select':
      return 'Select all correct options';
    case 'text':
      return 'Type your answer below';
    case 'drag-drop':
      return 'Arrange items in the correct order';
    default:
      return '';
  }
};

const QuestionInput = ({
  question,
  userAnswer,
  onAnswerChange,
  showResult,
}: QuestionRendererProps) => {
  switch (question.type) {
    case 'mcq':
    case 'multi-select':
      return (
        <MCQQuestion
          question={question}
          userAnswer={userAnswer}
          onAnswerChange={onAnswerChange}
          showResult={showResult}
        />
      );

    case 'yes-no':
    case 'true-false':
      return (
        <SimplifiedMCQQuestion
          question={question}
          userAnswer={userAnswer as string}
          onAnswerChange={(val) => onAnswerChange(val)}
          showResult={showResult}
        />
      );

    case 'drag-drop':
      return (
        <DragDropQuestion
          question={question}
          userAnswer={userAnswer as string[]}
          onAnswerChange={(val) => onAnswerChange(val)}
          showResult={showResult}
        />
      );

    case 'text':
      return (
        <TextQuestion
          question={question}
          userAnswer={userAnswer as string}
          onAnswerChange={(val) => onAnswerChange(val)}
          showResult={showResult}
        />
      );

    default:
      return null;
  }
};

export function QuestionRenderer(props: QuestionRendererProps) {
  const { question, showResult = false } = props;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Question Text */}
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            {question.text}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">
            {getHelperText(question.type)}
          </p>
          {/* Reference Video Button */}
          {question.referenceVideoUrl && !showResult && (
            <div className="mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(question.referenceVideoUrl!, '_blank')}
              >
                <span className="mr-2">🎥</span> Watch Reference Video
              </Button>
            </div>
          )}
        </div>

        {/* Question Input */}
        <QuestionInput {...props} />
      </div>
    </Card>
  );
}
