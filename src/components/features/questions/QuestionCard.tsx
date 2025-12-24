// Client Component - Question Card for Lists
'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';
import { Question } from '@/types';
import { Folder, Tag } from 'lucide-react';
import React, { useState } from 'react';
import { CorrectAnswerDisplay } from './CorrectAnswerDisplay';
import { QuestionBody } from './QuestionBody';
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
        
        <QuestionBody 
          question={question}
          userAnswer={userAnswer}
          showAnswer={showAnswer}
        />

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

