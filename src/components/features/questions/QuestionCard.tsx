'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import { Question } from '@/types';
import { Folder, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { AnswerOptions } from './AnswerOptions';
import { CorrectAnswerDisplay } from './CorrectAnswerDisplay';
import { QuestionHeader } from './QuestionHeader';

interface QuestionCardProps {
  question: Question;
  showAnswer?: boolean;
  userAnswer?: string | string[];
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
  onClick?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  showAnswer = false,
  userAnswer,
  onEdit,
  onDelete,
  className = '',
  onClick
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleCardClick = () => {
    if (onClick) onClick();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <>
      <Card 
        className={cn(className, !!onClick && "cursor-pointer hover:shadow-md")}
        onClick={handleCardClick}
      >
      <div className="flex flex-col gap-4 p-4 h-full">
        <QuestionHeader 
          question={question} 
          onEdit={onEdit} 
          onDelete={onDelete ? () => setShowDeleteConfirm(true) : undefined} 
        />
        
        <div className="flex-1">
          <p className="text-lg font-medium text-[var(--text-primary)] mb-4">
            {question.text}
          </p>
          
          {/* Answer Options */}
          {(question.type === 'mcq' || question.type === 'multi-select') && question.options && (
            <AnswerOptions
              options={question.options}
              correctAnswer={question.correctAnswer as string | string[]}
              userAnswer={userAnswer}
              showAnswer={showAnswer}
              isMultiSelect={question.type === 'multi-select'}
            />
          )}

          {/* Yes/No Options */}
          {question.type === 'yes-no' && (
            <div className="flex space-x-4">
              {['Yes', 'No'].map((option) => (
                <div
                  key={option}
                  className={cn(
                    "flex-1 p-3 rounded-lg border text-center font-medium",
                     showAnswer && String(question.correctAnswer) === option
                      ? 'bg-green-500/10 border-green-500/30 text-green-700'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)]'
                  )}
                >
                  {option}
                </div>
              ))}
            </div>
          )}

          {/* Drag and Drop */}
          {question.type === 'drag-drop' && question.options && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-[var(--text-secondary)] mb-2">Correct Order:</div>
              <div className="space-y-2">
                {(Array.isArray(question.correctAnswer) ? question.correctAnswer : []).map((item, index) => (
                  <div 
                    key={index}
                    className="p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] flex items-center gap-3"
                  >
                   <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--bg-card)] text-xs font-bold text-[var(--text-secondary)] border border-[var(--border-primary)]">
                      {index + 1}
                    </span>
                    <span className="text-[var(--text-primary)]">{item as string}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Correct Answer Indicator (when not showing as test answer) */}
        {!showAnswer && (
          <CorrectAnswerDisplay question={question} />
        )}

        {/* Categories and Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t mt-auto">
          {question.categories.map((category) => (
            <Badge key={category.id} variant="outline" className="text-xs">
              <Folder className="h-3 w-3 mr-1" />
              {category.name}
            </Badge>
          ))}
          {question.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
};
