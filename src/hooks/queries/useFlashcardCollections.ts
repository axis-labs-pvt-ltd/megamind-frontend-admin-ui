// React Query hooks — flashcard collections
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCollection,
  deleteCollection,
  fetchAllCollections,
  fetchCollectionById,
  fetchMyCollectionPurchases,
  fetchPublicCollections,
  hasCollectionAccess,
  purchaseCollection,
  updateCollection,
} from '@/services/api/flashcardCollections';
import { FlashCardCollection } from '@/types';

export const fcCollectionKeys = {
  all: ['flashcard-collections'] as const,
  public: () => [...fcCollectionKeys.all, 'public'] as const,
  admin: () => [...fcCollectionKeys.all, 'admin'] as const,
  detail: (id: string) => [...fcCollectionKeys.all, id] as const,
  myPurchases: () => [...fcCollectionKeys.all, 'my-purchases'] as const,
  access: (id: string) => [...fcCollectionKeys.all, 'access', id] as const,
};

export function usePublicCollections() {
  return useQuery({ queryKey: fcCollectionKeys.public(), queryFn: fetchPublicCollections });
}

export function useAllCollections() {
  return useQuery({ queryKey: fcCollectionKeys.admin(), queryFn: fetchAllCollections });
}

export function useCollectionById(id: string) {
  return useQuery({ queryKey: fcCollectionKeys.detail(id), queryFn: () => fetchCollectionById(id), enabled: !!id });
}

export function useMyCollectionPurchases() {
  return useQuery({ queryKey: fcCollectionKeys.myPurchases(), queryFn: fetchMyCollectionPurchases });
}

export function useCollectionAccess(id: string) {
  return useQuery({ queryKey: fcCollectionKeys.access(id), queryFn: () => hasCollectionAccess(id), enabled: !!id });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<FlashCardCollection, 'id' | 'cardCount' | 'rating' | 'soldCount' | 'createdAt'>) =>
      createCollection(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fcCollectionKeys.all });
    },
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<FlashCardCollection> }) =>
      updateCollection(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fcCollectionKeys.all });
    },
  });
}

export function useDeleteCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCollection(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fcCollectionKeys.all });
    },
  });
}

export function usePurchaseCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, price }: { collectionId: string; price: number }) =>
      purchaseCollection(collectionId, price),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: fcCollectionKeys.myPurchases() });
      qc.invalidateQueries({ queryKey: fcCollectionKeys.all });
    },
  });
}
