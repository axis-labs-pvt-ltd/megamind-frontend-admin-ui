import { queryClient } from '@/lib/query-client';
import { createQuestion, deleteQuestion, fetchQuestions, updateQuestion } from '@/services/api/quections';
import { QuestionFormData } from '@/lib/validations/question';
import { useMutation, useQuery } from '@tanstack/react-query';

export const QUESTIONS_KEY = ['questions'] as const;

export function useQuestions() {
  return useQuery({
    queryKey: QUESTIONS_KEY,
    queryFn: fetchQuestions,
  });
}

export function useCreateQuestion() {
  return useMutation({
    mutationFn: (data: QuestionFormData) => createQuestion(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUESTIONS_KEY }),
  });
}

export function useUpdateQuestion() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: QuestionFormData }) => updateQuestion(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUESTIONS_KEY }),
  });
}

export function useDeleteQuestion() {
  return useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUESTIONS_KEY }),
  });
}
