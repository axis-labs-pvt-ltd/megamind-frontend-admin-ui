import { supabase } from '@/lib/supabase';

export interface ModuleVideo {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  s3Key: string;
  thumbnailS3Key: string | null;
  durationSeconds: number | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
}

function mapRow(row: any): ModuleVideo {
  return {
    id:              row.id,
    moduleId:        row.module_id,
    title:           row.title,
    description:     row.description ?? '',
    s3Key:           row.s3_key,
    thumbnailS3Key:  row.thumbnail_s3_key ?? null,
    durationSeconds: row.duration_seconds ?? null,
    sortOrder:       row.sort_order ?? 0,
    isActive:        row.is_active,
    createdAt:       new Date(row.created_at),
  };
}

export async function fetchModuleVideos(moduleId: string): Promise<ModuleVideo[]> {
  const { data, error } = await supabase
    .from('module_videos')
    .select('*')
    .eq('module_id', moduleId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function fetchAllModuleVideos(moduleId: string): Promise<ModuleVideo[]> {
  const { data, error } = await supabase
    .from('module_videos')
    .select('*')
    .eq('module_id', moduleId)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapRow);
}

export async function createModuleVideo(v: Omit<ModuleVideo, 'id' | 'createdAt'>): Promise<void> {
  const { error } = await supabase.from('module_videos').insert({
    module_id:        v.moduleId,
    title:            v.title,
    description:      v.description,
    s3_key:           v.s3Key,
    thumbnail_s3_key: v.thumbnailS3Key,
    duration_seconds: v.durationSeconds,
    sort_order:       v.sortOrder,
    is_active:        v.isActive,
  });
  if (error) throw error;
}

export async function updateModuleVideo(id: string, v: Partial<Omit<ModuleVideo, 'id' | 'createdAt'>>): Promise<void> {
  const { error } = await supabase.from('module_videos').update({
    ...(v.title            !== undefined && { title:            v.title }),
    ...(v.description      !== undefined && { description:      v.description }),
    ...(v.thumbnailS3Key   !== undefined && { thumbnail_s3_key: v.thumbnailS3Key }),
    ...(v.durationSeconds  !== undefined && { duration_seconds: v.durationSeconds }),
    ...(v.sortOrder        !== undefined && { sort_order:        v.sortOrder }),
    ...(v.isActive         !== undefined && { is_active:         v.isActive }),
  }).eq('id', id);
  if (error) throw error;
}

export async function deleteModuleVideo(id: string): Promise<void> {
  const { error } = await supabase.from('module_videos').delete().eq('id', id);
  if (error) throw error;
}

// Get a short-lived stream URL via the Next.js API route
export async function getStreamUrl(s3Key: string): Promise<string> {
  const res = await fetch(`/api/videos/stream?key=${encodeURIComponent(s3Key)}`);
  if (!res.ok) throw new Error('Could not get stream URL');
  const { url } = await res.json();
  return url as string;
}

// Get a pre-signed PUT URL for uploading
export async function getPresignUrl(moduleId: string, fileName: string, contentType: string, kind: 'video' | 'thumbnail' = 'video') {
  const res = await fetch('/api/videos/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ moduleId, fileName, contentType, kind }),
  });
  if (!res.ok) { const e = await res.json(); throw new Error(e.error ?? 'Presign failed'); }
  return res.json() as Promise<{ uploadUrl: string; key: string; maxBytes: number }>;
}
