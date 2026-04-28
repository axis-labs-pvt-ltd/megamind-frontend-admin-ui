import { queryClient } from '@/lib/query-client';
import {
  createModule, createSubject,
  deleteModule, deleteSubject,
  fetchSubjects,
  updateModule, updateSubject,
} from '@/services/api/subjects';
import { Module, Subject } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const SUBJECTS_KEY = ['subjects'] as const;

export function useSubjects() {
  return useQuery({
    queryKey: SUBJECTS_KEY,
    queryFn: fetchSubjects,
  });
}

const invalidate = () => queryClient.invalidateQueries({ queryKey: SUBJECTS_KEY });

export function useCreateSubject() {
  return useMutation({ mutationFn: (data: Partial<Subject>) => createSubject(data), onSuccess: invalidate });
}

export function useUpdateSubject() {
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Subject> }) => updateSubject(id, data), onSuccess: invalidate });
}

export function useDeleteSubject() {
  return useMutation({ mutationFn: (id: string) => deleteSubject(id), onSuccess: invalidate });
}

export function useCreateModule() {
  return useMutation({ mutationFn: (data: Partial<Module>) => createModule(data), onSuccess: invalidate });
}

export function useUpdateModule() {
  return useMutation({ mutationFn: ({ id, data }: { id: string; data: Partial<Module> }) => updateModule(id, data), onSuccess: invalidate });
}

export function useDeleteModule() {
  return useMutation({ mutationFn: (id: string) => deleteModule(id), onSuccess: invalidate });
}
