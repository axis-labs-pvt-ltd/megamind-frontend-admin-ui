'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Question } from '@/types';
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

export function QuestionRenderer({
  question,
  userAnswer,
  onAnswerChange,
  showResult = false,
}: QuestionRendererProps) {

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Question Text */}
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            {question.text}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1 mb-4">
            {question.type === 'mcq' || question.type === 'true-false' || question.type === 'yes-no' ? 'Select one option' :
             question.type === 'multi-select' ? 'Select all correct options' :
             question.type === 'text' ? 'Type your answer below' :
             question.type === 'drag-drop' ? 'Arrange items in the correct order' : ''}
          </p>
           {/* Reference Video Button */}
           {question.referenceVideoUrl && !showResult && (
             <div className="mb-4">
                 <Button variant="outline" size="sm" onClick={() => window.open(question.referenceVideoUrl, '_blank')}>
                    <span className="mr-2">🎥</span> Watch Reference Video
                 </Button>
             </div>
          )}
        </div>

        {/* MCQ & Multi-Select Options */}
        {(question.type === 'mcq' || question.type === 'multi-select') && (
            <MCQQuestion 
                question={question}
                userAnswer={userAnswer}
                onAnswerChange={onAnswerChange}
                showResult={showResult}
            />
        )}

        {/* Yes/No & True/False (Simplified MCQ) */}
        {(question.type === 'yes-no' || question.type === 'true-false') && (
            <SimplifiedMCQQuestion
                question={question}
                userAnswer={userAnswer as string}
                onAnswerChange={(val) => onAnswerChange(val)}
                showResult={showResult}
            />
        )}

        {/* Drag & Drop */}
        {question.type === 'drag-drop' && (
            <DragDropQuestion
                question={question}
                userAnswer={userAnswer as string[]}
                onAnswerChange={(val) => onAnswerChange(val)}
                showResult={showResult}
            />
        )}

        {/* Text Question (Rich Text) */}
        {question.type === 'text' && (
            <TextQuestion
                question={question}
                userAnswer={userAnswer as string}
                onAnswerChange={(val) => onAnswerChange(val)}
                showResult={showResult}
            />
        )}
      </div>
    </Card>
  );
}
