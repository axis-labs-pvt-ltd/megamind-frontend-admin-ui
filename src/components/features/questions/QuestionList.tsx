// Client Component - Displays and manages list of questions

'use client';

import { Button } from '@/components/ui/button';
import { Question } from '@/types';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { QuestionCard } from './QuestionCard';

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
  onCreateNew: () => void;
}

export function QuestionList({ questions, onEdit, onDelete, onCreateNew }: QuestionListProps) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-primary)]">No questions found matching your criteria.</p>
        <Button
          variant="primary"
          onClick={onCreateNew}
          className="mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Your First Question
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {questions.map((question, index) => (
        <div 
          key={question.id} 
          className="relative group animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <QuestionCard
            question={question}
            className="hover:shadow-md transition-shadow h-full"
          />
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(question)}
                className="bg-[var(--bg-card)] shadow-sm hover:bg-[var(--accent-blue)]/10"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(question.id)}
                className="bg-[var(--bg-card)] shadow-sm hover:bg-[var(--accent-red)]/10 text-[var(--accent-red)]"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
