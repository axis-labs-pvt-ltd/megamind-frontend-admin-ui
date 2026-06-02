// React Query hooks — individual flashcards
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  bulkUpsertCards,
  createCard,
  deleteCard,
  fetchCardsByCollection,
  updateCard,
} from '@/services/api/flashcards';
import { FlashCard } from '@/types';

export const fcCardKeys = {
  all: ['flashcards'] as const,
  byCollection: (id: string) => ['flashcards', 'collection', id] as const,
};

export function useFlashcardsByCollection(collectionId: string) {
  return useQuery({
    queryKey: fcCardKeys.byCollection(collectionId),
    queryFn: () => fetchCardsByCollection(collectionId),
    enabled: !!collectionId,
  });
}

export function useCreateFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Pick<FlashCard, 'collectionId' | 'type' | 'front' | 'back' | 'imageUrl' | 'videoUrl' | 'order' | 'tags'>) =>
      createCard(input),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: fcCardKeys.byCollection(data.collectionId) });
    },
  });
}

export function useUpdateFlashcard() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<FlashCard> }) =>
      updateCard(id, input),
    onSuccess: (_data, variables) => {
      if (variables.input.collectionId) {
        qc.invalidateQueries({ queryKey: fcCardKeys.byCollection(variables.input.collectionId) });
      }
    },
  });
}

export function useDeleteFlashcard(collectionId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCard(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fcCardKeys.byCollection(collectionId) });
    },
  });
}

export interface BulkUpsertCard {
  id?: string;
  type: FlashCard['type'];
  front: string;
  back: string;
  imageUrl?: string;
  videoUrl?: string;
  order: number;
  tags: string[];
}

export function useBulkUpsertCards() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, cards }: { collectionId: string; cards: BulkUpsertCard[] }) =>
      bulkUpsertCards(collectionId, cards),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: fcCardKeys.byCollection(variables.collectionId) });
    },
  });
}
