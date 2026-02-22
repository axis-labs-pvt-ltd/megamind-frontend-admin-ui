// lib/api/subjects.ts
import { supabase } from '@/lib/supabase';
import { Module, Subject } from '@/types';

// ---- Subjects ----

export async function fetchSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from('subjects')
    .select(`*, modules(*)`)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    color: row.color ?? '#3b82f6',
    coverImage: row.cover_image ?? '',
    modules: (row.modules ?? []).map(mapDbToModule),
  }));
}

export async function createSubject(data: Partial<Subject>): Promise<void> {
  const { error } = await supabase.from('subjects').insert({
    name: data.name,
    description: data.description,
    color: data.color,
    cover_image: data.coverImage,
  });
  if (error) throw error;
}

export async function updateSubject(id: string, data: Partial<Subject>): Promise<void> {
  const { error } = await supabase
    .from('subjects')
    .update({
      name: data.name,
      description: data.description,
      color: data.color,
      cover_image: data.coverImage,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteSubject(id: string): Promise<void> {
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (error) throw error;
}

// ---- Modules ----

function mapDbToModule(row: any): Module {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? '',
    subjectId: row.subject_id,
    coverImage: row.cover_image ?? '',
  };
}

export async function createModule(data: Partial<Module>): Promise<void> {
  const { error } = await supabase.from('modules').insert({
    name: data.name,
    description: data.description,
    subject_id: data.subjectId,
    cover_image: data.coverImage,
  });
  if (error) throw error;
}

export async function updateModule(id: string, data: Partial<Module>): Promise<void> {
  const { error } = await supabase
    .from('modules')
    .update({
      name: data.name,
      description: data.description,
      subject_id: data.subjectId,
      cover_image: data.coverImage,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteModule(id: string): Promise<void> {
  const { error } = await supabase.from('modules').delete().eq('id', id);
  if (error) throw error;
}