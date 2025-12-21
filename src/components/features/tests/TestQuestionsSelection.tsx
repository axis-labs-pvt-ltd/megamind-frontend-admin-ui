// Client Component - Static Question Selection
'use client';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockQuestions } from '@/lib/mock-data';
import { CreateTestValues } from '@/lib/validations/test';
import { FieldErrors, UseFormSetValue } from 'react-hook-form';

interface TestQuestionsSelectionProps {
  selectedQuestions: string[];
  setValue: UseFormSetValue<CreateTestValues>;
  errors: FieldErrors<CreateTestValues>;
}

export function TestQuestionsSelection({ selectedQuestions, setValue, errors }: TestQuestionsSelectionProps) {
  
  const toggleQuestion = (questionId: string) => {
    const current = selectedQuestions;
    const updated = current.includes(questionId)
      ? current.filter(id => id !== questionId)
      : [...current, questionId];
    setValue('questions', updated, { shouldValidate: true });
  };

  return (
    <Card className="p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Select Questions</h3>
        <Badge variant="primary" size="md">
            {selectedQuestions.length} selected
        </Badge>
        </div>
        <div className="space-y-3">
        {mockQuestions.map((question) => (
            <div
            key={question.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedQuestions.includes(question.id)
                ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
            }`}
            onClick={() => toggleQuestion(question.id)}
            >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                <p className="font-medium text-[var(--text-primary)]">{question.text}</p>
                <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" size="sm">
                    {question.type.toUpperCase()}
                    </Badge>
                    <Badge variant="warning" size="sm">
                    {question.difficulty}
                    </Badge>
                </div>
                </div>
                <div className="flex items-center space-x-2">
                {selectedQuestions.includes(question.id) && (
                    <Badge variant="success" size="sm">Selected</Badge>
                )}
                </div>
            </div>
            </div>
        ))}
        </div>
        {errors.questions && <p className="text-sm text-[var(--accent-red)] mt-4 text-center">Please select at least one question.</p>}
    </Card>
  );
}
