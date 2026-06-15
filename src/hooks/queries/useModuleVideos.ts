import { queryClient } from '@/lib/query-client';
import {
  createModuleVideo, deleteModuleVideo,
  fetchAllModuleVideos, fetchModuleVideos,
  ModuleVideo, updateModuleVideo,
} from '@/services/api/moduleVideos';
import { useMutation, useQuery } from '@tanstack/react-query';

const key = (moduleId: string) => ['module-videos', moduleId];

export function useModuleVideos(moduleId: string) {
  return useQuery({
    queryKey: key(moduleId),
    queryFn: () => fetchModuleVideos(moduleId),
    enabled: !!moduleId,
  });
}

export function useAllModuleVideos(moduleId: string) {
  return useQuery({
    queryKey: [...key(moduleId), 'all'],
    queryFn: () => fetchAllModuleVideos(moduleId),
    enabled: !!moduleId,
  });
}

const inv = (moduleId: string) => queryClient.invalidateQueries({ queryKey: key(moduleId) });

export function useCreateModuleVideo(moduleId: string) {
  return useMutation({
    mutationFn: (v: Omit<ModuleVideo, 'id' | 'createdAt'>) => createModuleVideo(v),
    onSuccess: () => inv(moduleId),
  });
}

export function useUpdateModuleVideo(moduleId: string) {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<ModuleVideo, 'id' | 'createdAt'>> }) =>
      updateModuleVideo(id, data),
    onSuccess: () => inv(moduleId),
  });
}

export function useDeleteModuleVideo(moduleId: string) {
  return useMutation({
    mutationFn: (id: string) => deleteModuleVideo(id),
    onSuccess: () => inv(moduleId),
  });
}
