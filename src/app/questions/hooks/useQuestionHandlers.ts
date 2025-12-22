import { Question } from '@/types';
import { useCallback, useState } from 'react';

export function useQuestionHandlers() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const handleCreateQuestion = useCallback((formData: any) => {
    console.log('Creating question:', formData);
    setShowCreateForm(false);
    setEditingQuestion(null);
  }, []);

  const handleEditQuestion = useCallback((question: Question) => {
    setEditingQuestion(question);
    setShowCreateForm(true);
  }, []);

  const handleDeleteQuestion = useCallback((questionId: string) => {
    console.log('Delete question:', questionId);
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowCreateForm(false);
    setEditingQuestion(null);
  }, []);

  const handleOpenCreateForm = useCallback(() => {
    setShowCreateForm(true);
  }, []);

  return {
    showCreateForm,
    editingQuestion,
    handleCreateQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    handleCancelForm,
    handleOpenCreateForm,
  };
}
