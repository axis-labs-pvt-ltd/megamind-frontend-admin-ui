import { queryClient } from '@/lib/query-client';
import { batchUpsertTranslations, fetchTranslations } from '@/services/api/translations';
import { useMutation, useQuery } from '@tanstack/react-query';

export const TRANSLATIONS_KEY = ['translations'] as const;

export function useTranslations() {
  return useQuery({
    queryKey: TRANSLATIONS_KEY,
    queryFn: fetchTranslations,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSaveTranslations() {
  return useMutation({
    mutationFn: (changes: { key: string; si: string }[]) => batchUpsertTranslations(changes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TRANSLATIONS_KEY }),
  });
}
