'use client';

import { QuestionFilters } from '@/components/features/questions/QuestionFilters';
import { QuestionForm } from '@/components/features/questions/QuestionForm';
import { QuestionList } from '@/components/features/questions/QuestionList';
import { Button } from '@/components/ui/button';
import { useCreateQuestion, useDeleteQuestion, useQuestions, useUpdateQuestion } from '@/hooks/queries/useQuestions';
import { QuestionFormData } from '@/lib/validations/question';
import { Question } from '@/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useQuestionFilters } from './hooks/useQuestionFilters';

export default function QuestionsPage() {
  const { data: questions = [], isLoading, error } = useQuestions();
  const createMutation = useCreateQuestion();
  const updateMutation = useUpdateQuestion();
  const deleteMutation = useDeleteQuestion();

  const [showForm, setShowForm]           = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const { searchTerm, selectedType, selectedDifficulty, filteredQuestions, setSearchTerm, setSelectedType, setSelectedDifficulty } = useQuestionFilters(questions);

  const handleSubmit = async (formData: QuestionFormData) => {
    if (editingQuestion) {
      await updateMutation.mutateAsync({ id: editingQuestion.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setShowForm(false);
    setEditingQuestion(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    await deleteMutation.mutateAsync(id);
  };

  const handleEdit = (q: Question) => { setEditingQuestion(q); setShowForm(true); };
  const handleOpen  = ()           => { setEditingQuestion(null); setShowForm(true); };
  const handleCancel = ()          => { setShowForm(false); setEditingQuestion(null); };

  const mutationError = createMutation.error ?? updateMutation.error ?? deleteMutation.error;

  if (isLoading) return <div className="flex items-center justify-center py-12"><p className="text-[var(--text-secondary)]">Loading questions...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Question Bank</h2>
          <p className="text-[var(--text-secondary)]">Manage your collection of questions</p>
        </div>
        <Button variant="primary" onClick={handleOpen} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Plus className="h-4 w-4 mr-2" /> Create Question
        </Button>
      </div>

      {(error || mutationError) && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {(error as Error)?.message ?? (mutationError as Error)?.message}
        </div>
      )}

      {showForm && (
        <QuestionForm editingQuestion={editingQuestion} onSubmit={handleSubmit} onCancel={handleCancel} />
      )}

      <QuestionFilters
        searchTerm={searchTerm} selectedType={selectedType} selectedDifficulty={selectedDifficulty}
        onSearchChange={setSearchTerm} onTypeChange={setSelectedType} onDifficultyChange={setSelectedDifficulty}
      />

      <QuestionList
        questions={filteredQuestions}
        onEdit={handleEdit} onDelete={handleDelete} onCreateNew={handleOpen}
      />
    </div>
  );
}
