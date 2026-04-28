import { queryClient } from '@/lib/query-client';
import { createTest, deleteTest, fetchTests, toggleTestActive, updateTest } from '@/services/api/tests';
import { CreateTestValues } from '@/lib/validations/test';
import { useMutation, useQuery } from '@tanstack/react-query';

export const TESTS_KEY = ['tests'] as const;

export function useTests() {
  return useQuery({
    queryKey: TESTS_KEY,
    queryFn: fetchTests,
  });
}

export function useActiveTests() {
  return useQuery({
    queryKey: [...TESTS_KEY, 'active'],
    queryFn: async () => {
      const tests = await fetchTests();
      return tests.filter(t => t.isActive);
    },
  });
}

export function useCreateTest() {
  return useMutation({
    mutationFn: (data: CreateTestValues) => createTest(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TESTS_KEY }),
  });
}

export function useUpdateTest() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateTestValues }) => updateTest(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TESTS_KEY }),
  });
}

export function useDeleteTest() {
  return useMutation({
    mutationFn: (id: string) => deleteTest(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TESTS_KEY }),
  });
}

export function useToggleTestActive() {
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => toggleTestActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TESTS_KEY }),
  });
}
