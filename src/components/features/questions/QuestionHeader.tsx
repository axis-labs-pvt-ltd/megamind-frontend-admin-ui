// Client Component - QuestionCard header with badges and action buttons

'use client';

import { Badge } from '@/components/ui/badge';
import type { Question } from '@/types';
import { Edit, PlayCircle, Trash2 } from 'lucide-react';

interface QuestionHeaderProps {
  question: Question;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function QuestionHeader({ question, onEdit, onDelete }: QuestionHeaderProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-2">
        <Badge variant="secondary">
          {question.type.toUpperCase()}
        </Badge>
        <Badge variant={getDifficultyColor(question.difficulty)}>
          {question.difficulty}
        </Badge>
      </div>
      
      <div className="flex items-center space-x-2">
        {question.solutionVideoUrl && (
          <PlayCircle className="h-5 w-5 text-blue-500 cursor-pointer hover:text-blue-600" />
        )}
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors"
            title="Edit question"
          >
            <Edit className="h-4 w-4" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Parent component will handle the delete confirmation dialog
              onDelete();
            }}
            className="p-2 rounded-lg hover:bg-red-50 text-[var(--text-secondary)] hover:text-red-600 transition-colors"
            title="Delete question"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
