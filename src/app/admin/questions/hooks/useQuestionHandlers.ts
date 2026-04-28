// hooks/useQuestionHandlers.ts
import { createQuestion, deleteQuestion, updateQuestion } from '@/services/api/quections';
import { QuestionFormData } from '@/lib/validations/question';
import { Question } from '@/types';
import { useCallback, useState } from 'react';

export function useQuestionHandlers(
  onQuestionsChange: () => void  // callback to refetch
) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateQuestion = useCallback(async (formData: QuestionFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion.id, formData);
      } else {
        await createQuestion(formData);
      }
      setShowCreateForm(false);
      setEditingQuestion(null);
      onQuestionsChange(); // trigger refetch
    } catch (err: any) {
      setError(err.message ?? 'Failed to save question');
    } finally {
      setIsSubmitting(false);
    }
  }, [editingQuestion, onQuestionsChange]);

  const handleDeleteQuestion = useCallback(async (questionId: string) => {
    if (!confirm('Delete this question?')) return;
    try {
      await deleteQuestion(questionId);
      onQuestionsChange();
    } catch (err: any) {
      setError(err.message ?? 'Failed to delete question');
    }
  }, [onQuestionsChange]);

  const handleEditQuestion = useCallback((question: Question) => {
    setEditingQuestion(question);
    setShowCreateForm(true);
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingQuestion(null);
  }, []);

  const handleOpenCreateForm = useCallback(() => {
    setEditingQuestion(null);
    setShowCreateForm(true);
  }, []);

  return {
    showCreateForm, editingQuestion, isSubmitting, error,
    handleCreateQuestion, handleEditQuestion, handleDeleteQuestion,
    handleCancelForm, handleOpenCreateForm,
  };
}