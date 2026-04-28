import { queryClient } from '@/lib/query-client';
import { fetchMyPurchases, purchaseTest } from '@/services/api/purchases';
import { fetchStudentAttempts } from '@/services/api/testSessions';
import { TestHistory } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';

export const PURCHASES_KEY = ['purchases'] as const;
export const ATTEMPTS_KEY  = ['attempts']  as const;

export function useMyPurchases() {
  return useQuery({
    queryKey: PURCHASES_KEY,
    queryFn: fetchMyPurchases,
  });
}

export function useStudentAttempts(userId: string | undefined) {
  return useQuery({
    queryKey: [...ATTEMPTS_KEY, userId],
    queryFn: async (): Promise<TestHistory[]> => {
      if (!userId) return [];
      const data = await fetchStudentAttempts(userId);
      return data.map((s: any) => ({
        id: s.id,
        testId: s.test_id,
        testTitle: s.tests?.title ?? 'Unknown test',
        passingScore: s.tests?.passing_score ?? 0,
        score: s.score ?? 0,
        passed: (s.score ?? 0) >= (s.tests?.passing_score ?? 100),
        timeSpent: s.time_spent ?? 0,
        completedAt: new Date(s.completed_at),
        correctAnswers: (s.test_session_answers ?? []).filter((a: any) => a.is_correct).length,
        totalQuestions: (s.test_session_answers ?? []).length,
      }));
    },
    enabled: !!userId,
  });
}

export function usePurchaseTest() {
  return useMutation({
    mutationFn: ({ testId, price }: { testId: string; price: number }) => purchaseTest(testId, price),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PURCHASES_KEY }),
  });
}
