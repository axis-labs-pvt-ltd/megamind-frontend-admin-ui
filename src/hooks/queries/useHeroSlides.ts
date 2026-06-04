import { queryClient } from '@/lib/query-client';
import { createHeroSlide, deleteHeroSlide, fetchActiveHeroSlides, fetchHeroSlides, SlideInput, toggleHeroSlideActive, updateHeroSlide } from '@/services/api/heroSlides';
import { useMutation, useQuery } from '@tanstack/react-query';

export const SLIDES_KEY = ['hero_slides'] as const;

export function useHeroSlides() {
  return useQuery({ queryKey: SLIDES_KEY, queryFn: fetchHeroSlides });
}

export function useActiveHeroSlides() {
  return useQuery({ queryKey: [...SLIDES_KEY, 'active'], queryFn: fetchActiveHeroSlides });
}

export function useCreateHeroSlide() {
  return useMutation({
    mutationFn: (data: SlideInput) => createHeroSlide(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SLIDES_KEY }),
  });
}

export function useUpdateHeroSlide() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SlideInput }) => updateHeroSlide(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SLIDES_KEY }),
  });
}

export function useDeleteHeroSlide() {
  return useMutation({
    mutationFn: (id: string) => deleteHeroSlide(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SLIDES_KEY }),
  });
}

export function useToggleHeroSlideActive() {
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => toggleHeroSlideActive(id, isActive),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SLIDES_KEY }),
  });
}
