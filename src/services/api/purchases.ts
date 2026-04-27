// Purchases service — mock payment flow
// Required Supabase table:
// CREATE TABLE purchases (
//   id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//   student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
//   test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
//   price INTEGER NOT NULL DEFAULT 0,
//   purchased_at TIMESTAMPTZ DEFAULT NOW(),
//   UNIQUE(student_id, test_id)
// );
// ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
// CREATE POLICY "Students see own purchases" ON purchases FOR SELECT USING (auth.uid() = student_id);
// CREATE POLICY "Students insert own purchases" ON purchases FOR INSERT WITH CHECK (auth.uid() = student_id);

import { supabase } from '@/lib/supabase';
import { Purchase } from '@/types';

export async function purchaseTest(testId: string, price: number): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('You must be signed in to purchase a test.');

  const { error } = await supabase.from('purchases').insert({
    student_id: user.id,
    test_id: testId,
    price,
  });

  if (error) {
    if (error.code === '23505') throw new Error('You already own this test.');
    throw error;
  }
}

export async function fetchMyPurchases(): Promise<Purchase[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('purchases')
    .select(`*, tests(*)`)
    .eq('student_id', user.id)
    .order('purchased_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(row => ({
    id: row.id,
    studentId: row.student_id,
    testId: row.test_id,
    price: row.price,
    purchasedAt: new Date(row.purchased_at),
    test: row.tests ? mapTest(row.tests) : undefined,
  }));
}

export async function hasTestAccess(testId: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data } = await supabase.from('purchases').select('id').eq('student_id', user.id).eq('test_id', testId).maybeSingle();
  return !!data;
}

function mapTest(row: any) {
  const base = {
    id: row.id, title: row.title, description: row.description ?? '',
    timeLimit: row.time_limit, passingScore: row.passing_score,
    isActive: row.is_active, tags: row.tags ?? [],
    coverImage: row.cover_image ?? '', createdAt: new Date(row.created_at),
    estimatedDuration: row.estimated_duration,
  };
  if (row.type === 'static') return { ...base, type: 'static' as const, questionIds: [] };
  return { ...base, type: 'dynamic' as const, rules: [] };
}
