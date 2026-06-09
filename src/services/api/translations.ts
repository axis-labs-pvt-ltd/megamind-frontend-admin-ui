import { supabase } from '@/lib/supabase';

export interface TranslationRow {
  id: string;
  key: string;
  section: string;
  en: string;
  si: string;
  updatedAt: Date;
}

export async function fetchTranslations(): Promise<TranslationRow[]> {
  const { data, error } = await supabase
    .from('translations')
    .select('*')
    .order('section')
    .order('key');
  if (error) throw error;
  return data.map(r => ({ id: r.id, key: r.key, section: r.section, en: r.en, si: r.si, updatedAt: new Date(r.updated_at) }));
}

export async function upsertTranslation(key: string, si: string): Promise<void> {
  const { error } = await supabase
    .from('translations')
    .update({ si, updated_at: new Date().toISOString() })
    .eq('key', key);
  if (error) throw error;
}

export async function batchUpsertTranslations(changes: { key: string; si: string }[]): Promise<void> {
  for (const { key, si } of changes) {
    const { error } = await supabase
      .from('translations')
      .update({ si, updated_at: new Date().toISOString() })
      .eq('key', key);
    if (error) throw error;
  }
}
