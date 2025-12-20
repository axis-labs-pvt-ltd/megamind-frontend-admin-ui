// Client Component - Question creation and editing form

'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { mockSubjects } from '@/lib/mock-data';
import { Question } from '@/types';
import { Plus, Trash2, Video } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuestionFormState {
  type: 'mcq' | 'yes-no' | 'drag-drop';
  text: string;
  options: string[];
  correctAnswer: string;
  solutionVideoUrl: string;
  moduleId: string;
  categoryIds: string[];
  tagIds: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface QuestionFormProps {
  editingQuestion: Question | null;
  onSubmit: (formData: QuestionFormState) => void;
  onCancel: () => void;
}

export function QuestionForm({ editingQuestion, onSubmit, onCancel }: QuestionFormProps) {
  const [questionForm, setQuestionForm] = useState<QuestionFormState>({
    type: 'mcq',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    solutionVideoUrl: '',
    moduleId: '',
    categoryIds: [],
    tagIds: [],
    difficulty: 'medium'
  });

  useEffect(() => {
    if (editingQuestion) {
      setQuestionForm({
        type: editingQuestion.type,
        text: editingQuestion.text,
        options: editingQuestion.options || ['', '', '', ''],
        correctAnswer: Array.isArray(editingQuestion.correctAnswer) 
          ? editingQuestion.correctAnswer.join(' → ') 
          : editingQuestion.correctAnswer,
        solutionVideoUrl: editingQuestion.solutionVideoUrl || '',
        moduleId: editingQuestion.moduleId,
        categoryIds: editingQuestion.categories.map(c => c.id),
        tagIds: editingQuestion.tags.map(t => t.id),
        difficulty: editingQuestion.difficulty
      });
    }
  }, [editingQuestion]);

  const updateOption = (index: number, value: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const addOption = () => {
    setQuestionForm({
      ...questionForm,
      options: [...questionForm.options, '']
    });
  };

  const removeOption = (index: number) => {
    const newOptions = questionForm.options.filter((_, i) => i !== index);
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleSubmit = () => {
    onSubmit(questionForm);
  };

  return (
    <Card className="p-6 border-2 border-[var(--border-primary)] bg-[var(--bg-card)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          {editingQuestion ? 'Edit Question' : 'Create New Question'}
        </h3>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <div className="space-y-6">
        {/* Question Type */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Question Type</label>
          <div className="flex space-x-4">
            {(['mcq', 'yes-no', 'drag-drop'] as const).map((type) => (
              <div
                key={type}
                className={`flex items-center space-x-3 p-3 bg-[var(--bg-card)] border-2 rounded-lg cursor-pointer transition-all ${
                  questionForm.type === type
                    ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10'
                    : 'border-[var(--border-primary)] hover:border-[var(--border-hover)]'
                }`}
                onClick={() => setQuestionForm({ ...questionForm, type })}
              >
                <p className="font-medium text-[var(--text-primary)] capitalize">{type.replace('-', ' ')}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Question Text</label>
          <textarea
            className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            value={questionForm.text}
            onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
            placeholder="Enter your question here..."
          />
        </div>

        {/* Options (for MCQ and Drag-Drop) */}
        {(questionForm.type === 'mcq' || questionForm.type === 'drag-drop') && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Options</label>
              <Button variant="outline" size="sm" onClick={addOption}>
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {questionForm.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-[var(--text-muted)] w-6">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <Input
                    value={option}
                    onChange={(value) => updateOption(index, value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1"
                  />
                  {questionForm.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Correct Answer */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Correct Answer</label>
          {questionForm.type === 'mcq' && (
            <select
              className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={questionForm.correctAnswer}
              onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
            >
              <option value="">Select correct answer</option>
              {questionForm.options.filter(opt => opt.trim()).map((option, index) => (
                <option key={index} value={option}>
                  {String.fromCharCode(65 + index)} - {option}
                </option>
              ))}
            </select>
          )}
          {questionForm.type === 'yes-no' && (
            <select
              className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={questionForm.correctAnswer}
              onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
            >
              <option value="">Select correct answer</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          )}
          {questionForm.type === 'drag-drop' && (
            <Input
              value={questionForm.correctAnswer}
              onChange={(value) => setQuestionForm({ ...questionForm, correctAnswer: value })}
              placeholder="Enter correct order (e.g., Option A → Option B → Option C)"
            />
          )}
        </div>

        {/* Additional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Module</label>
            <select
              className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={questionForm.moduleId}
              onChange={(e) => setQuestionForm({ ...questionForm, moduleId: e.target.value })}
            >
              <option value="">Select Module</option>
              {mockSubjects.flatMap(subject =>
                subject.modules.map(module => (
                  <option key={module.id} value={module.id}>
                    {subject.name} - {module.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Difficulty</label>
            <select
              className="w-full px-3 py-2 bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={questionForm.difficulty}
              onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value as any })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {/* Solution Video URL */}
        <Input
          label="Solution Video URL (Optional)"
          value={questionForm.solutionVideoUrl}
          onChange={(value) => setQuestionForm({ ...questionForm, solutionVideoUrl: value })}
          placeholder="https://example.com/video"
          icon={Video}
        />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!questionForm.text || !questionForm.correctAnswer}
          >
            {editingQuestion ? 'Update Question' : 'Create Question'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
