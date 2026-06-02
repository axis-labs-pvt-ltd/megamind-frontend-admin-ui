// Supabase API — flashcard_collections
// Tables: flashcard_collections, flashcard_purchases
import { supabase } from '@/lib/supabase';
import { FlashCardCollection, FlashCardPurchase, FlashCardVisibility } from '@/types';

function mapCollection(row: any): FlashCardCollection {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    subjectId: row.subject_id ?? undefined,
    subjectName: row.subject_name ?? undefined,
    level: row.level ?? 'A/L',
    coverEmoji: row.cover_emoji ?? '📚',
    coverColor: row.cover_color ?? 'var(--p-card-a)',
    tutorId: row.tutor_id,
    tutorName: row.tutor_name ?? 'Unknown',
    price: row.price ?? 0,
    visibility: (row.visibility ?? 'public_free') as FlashCardVisibility,
    cardCount: row.card_count ?? 0,
    tags: row.tags ?? [],
    rating: row.rating ?? undefined,
    soldCount: row.sold_count ?? 0,
    isBestseller: row.is_bestseller ?? false,
    isNew: row.is_new ?? false,
    isActive: row.is_active ?? true,
    createdAt: new Date(row.created_at),
  };
}

export async function fetchPublicCollections(): Promise<FlashCardCollection[]> {
  const { data, error } = await supabase
    .from('flashcard_collections')
    .select('*')
    .eq('is_active', true)
    .neq('visibility', 'private')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapCollection);
}

export async function fetchAllCollections(): Promise<FlashCardCollection[]> {
  const { data, error } = await supabase
    .from('flashcard_collections')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(mapCollection);
}

export async function fetchCollectionById(id: string): Promise<FlashCardCollection> {
  const { data, error } = await supabase
    .from('flashcard_collections')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return mapCollection(data);
}

export async function createCollection(
  input: Omit<FlashCardCollection, 'id' | 'cardCount' | 'rating' | 'soldCount' | 'createdAt'>
): Promise<FlashCardCollection> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('flashcard_collections')
    .insert({
      title: input.title,
      description: input.description,
      subject_id: input.subjectId ?? null,
      subject_name: input.subjectName ?? null,
      level: input.level,
      cover_emoji: input.coverEmoji,
      cover_color: input.coverColor,
      tutor_id: input.tutorId || user?.id,
      tutor_name: input.tutorName,
      price: input.price,
      visibility: input.visibility,
      tags: input.tags,
      is_bestseller: input.isBestseller ?? false,
      is_new: input.isNew ?? true,
      is_active: input.isActive,
    })
    .select()
    .single();
  if (error) throw error;
  return mapCollection(data);
}

export async function updateCollection(id: string, input: Partial<FlashCardCollection>): Promise<void> {
  const { error } = await supabase
    .from('flashcard_collections')
    .update({
      title: input.title,
      description: input.description,
      subject_name: input.subjectName,
      level: input.level,
      cover_emoji: input.coverEmoji,
      cover_color: input.coverColor,
      price: input.price,
      visibility: input.visibility,
      tags: input.tags,
      is_bestseller: input.isBestseller,
      is_new: input.isNew,
      is_active: input.isActive,
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteCollection(id: string): Promise<void> {
  const { error } = await supabase.from('flashcard_collections').delete().eq('id', id);
  if (error) throw error;
}

export async function purchaseCollection(collectionId: string, price: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to purchase.');
  const { error } = await supabase.from('flashcard_purchases').insert({
    student_id: user.id,
    collection_id: collectionId,
    price,
  });
  if (error) {
    if (error.code === '23505') throw new Error('You already own this collection.');
    throw error;
  }
  await supabase.from('flashcard_collections')
    .update({ sold_count: supabase.rpc('increment', { x: 1 }) })
    .eq('id', collectionId);
}

export async function hasCollectionAccess(collectionId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase
    .from('flashcard_purchases')
    .select('id')
    .eq('student_id', user.id)
    .eq('collection_id', collectionId)
    .maybeSingle();
  return !!data;
}

export async function fetchMyCollectionPurchases(): Promise<FlashCardPurchase[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from('flashcard_purchases')
    .select('*, flashcard_collections(*)')
    .eq('student_id', user.id)
    .order('purchased_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(row => ({
    id: row.id,
    studentId: row.student_id,
    collectionId: row.collection_id,
    price: row.price,
    purchasedAt: new Date(row.purchased_at),
    collection: row.flashcard_collections ? mapCollection(row.flashcard_collections) : undefined,
  }));
}
