// Supabase CRUD for hero_slides table
// SQL to create table:
// CREATE TABLE hero_slides (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   sort_order INT NOT NULL DEFAULT 0,
//   chip TEXT NOT NULL,
//   title TEXT NOT NULL,
//   body TEXT NOT NULL,
//   primary_label TEXT NOT NULL,
//   primary_href TEXT NOT NULL,
//   ghost_label TEXT NOT NULL,
//   ghost_href TEXT NOT NULL,
//   photo_url TEXT NOT NULL,
//   stats JSONB,
//   subject_chips JSONB,
//   is_active BOOLEAN NOT NULL DEFAULT true,
//   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
// );

import { supabase } from '@/lib/supabase';

export interface HeroSlide {
  id: string;
  sortOrder: number;
  chip: string;
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  ghostLabel: string;
  ghostHref: string;
  photoUrl: string;
  stats?: { n: string; l: string; star?: boolean }[] | null;
  subjectChips?: { n: string; e: string }[] | null;
  isActive: boolean;
  createdAt: Date;
}

export type SlideInput = Omit<HeroSlide, 'id' | 'createdAt'>;

function mapRow(row: any): HeroSlide {
  return {
    id: row.id,
    sortOrder: row.sort_order,
    chip: row.chip,
    title: row.title,
    body: row.body,
    primaryLabel: row.primary_label,
    primaryHref: row.primary_href,
    ghostLabel: row.ghost_label,
    ghostHref: row.ghost_href,
    photoUrl: row.photo_url,
    stats: row.stats ?? null,
    subjectChips: row.subject_chips ?? null,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
  };
}

function toRow(input: SlideInput) {
  return {
    sort_order: input.sortOrder,
    chip: input.chip,
    title: input.title,
    body: input.body,
    primary_label: input.primaryLabel,
    primary_href: input.primaryHref,
    ghost_label: input.ghostLabel,
    ghost_href: input.ghostHref,
    photo_url: input.photoUrl,
    stats: input.stats ?? null,
    subject_chips: input.subjectChips ?? null,
    is_active: input.isActive,
  };
}

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase.from('hero_slides').select('*').order('sort_order');
  if (error) throw error;
  return data.map(mapRow);
}

export async function fetchActiveHeroSlides(): Promise<HeroSlide[]> {
  const { data, error } = await supabase.from('hero_slides').select('*').eq('is_active', true).order('sort_order');
  if (error) throw error;
  return data.map(mapRow);
}

export async function createHeroSlide(input: SlideInput): Promise<void> {
  const { error } = await supabase.from('hero_slides').insert(toRow(input));
  if (error) throw error;
}

export async function updateHeroSlide(id: string, input: SlideInput): Promise<void> {
  const { error } = await supabase.from('hero_slides').update(toRow(input)).eq('id', id);
  if (error) throw error;
}

export async function deleteHeroSlide(id: string): Promise<void> {
  const { error } = await supabase.from('hero_slides').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleHeroSlideActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from('hero_slides').update({ is_active: isActive }).eq('id', id);
  if (error) throw error;
}
