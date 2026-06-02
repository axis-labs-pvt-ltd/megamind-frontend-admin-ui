// Supabase API — flashcards (individual cards within a collection)
import { supabase } from '@/lib/supabase';
import { FlashCard, FlashCardType } from '@/types';

function mapCard(row: any): FlashCard {
  return {
    id: row.id,
    collectionId: row.collection_id,
    type: (row.type ?? 'text') as FlashCardType,
    front: row.front ?? '',
    back: row.back ?? '',
    imageUrl: row.image_url ?? undefined,
    videoUrl: row.video_url ?? undefined,
    order: row.order ?? 0,
    tags: row.tags ?? [],
    createdAt: new Date(row.created_at),
  };
}

export async function fetchCardsByCollection(collectionId: string): Promise<FlashCard[]> {
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('collection_id', collectionId)
    .order('order', { ascending: true });
  if (error) throw error;
  return (data ?? []).map(mapCard);
}

export async function createCard(
  input: Pick<FlashCard, 'collectionId' | 'type' | 'front' | 'back' | 'imageUrl' | 'videoUrl' | 'order' | 'tags'>
): Promise<FlashCard> {
  const { data, error } = await supabase
    .from('flashcards')
    .insert({
      collection_id: input.collectionId,
      type: input.type,
      front: input.front,
      back: input.back,
      image_url: input.imageUrl ?? null,
      video_url: input.videoUrl ?? null,
      order: input.order,
      tags: input.tags,
    })
    .select()
    .single();
  if (error) throw error;
  return mapCard(data);
}

export async function updateCard(id: string, input: Partial<FlashCard>): Promise<void> {
  const { error } = await supabase
    .from('flashcards')
    .update({
      type: input.type,
      front: input.front,
      back: input.back,
      image_url: input.imageUrl ?? null,
      video_url: input.videoUrl ?? null,
      order: input.order,
      tags: input.tags,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCard(id: string): Promise<void> {
  const { error } = await supabase.from('flashcards').delete().eq('id', id);
  if (error) throw error;
}

export interface BulkCardInput {
  id?: string;
  type: FlashCardType;
  front: string;
  back: string;
  imageUrl?: string;
  videoUrl?: string;
  order: number;
  tags: string[];
}

export async function bulkUpsertCards(
  collectionId: string,
  cards: BulkCardInput[]
): Promise<FlashCard[]> {
  const rows = cards.map((c, i) => ({
    ...(c.id ? { id: c.id } : {}),
    collection_id: collectionId,
    type: c.type,
    front: c.front,
    back: c.back,
    image_url: c.imageUrl ?? null,
    video_url: c.videoUrl ?? null,
    order: i,
    tags: c.tags,
  }));
  const { data, error } = await supabase
    .from('flashcards')
    .upsert(rows, { onConflict: 'id' })
    .select();
  if (error) throw error;

  // Update card_count on collection
  await supabase
    .from('flashcard_collections')
    .update({ card_count: rows.length })
    .eq('id', collectionId);

  return (data ?? []).map(mapCard);
}

export async function deleteAllCardsForCollection(collectionId: string): Promise<void> {
  const { error } = await supabase
    .from('flashcards')
    .delete()
    .eq('collection_id', collectionId);
  if (error) throw error;
}
