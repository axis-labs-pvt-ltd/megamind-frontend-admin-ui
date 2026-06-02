// lib/api/tests.ts
import { supabase } from '@/lib/supabase';
import { Test } from '@/types';
import { CreateTestValues } from '@/lib/validations/test';

export async function fetchTests(): Promise<Test[]> {
  const { data, error } = await supabase
    .from('tests')
    .select(`
      *,
      test_questions(question_id, sort_order),
      test_dynamic_rules(*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(mapDbToTest);
}

export async function createTest(formData: CreateTestValues): Promise<void> {
  // 1. Insert test row
  const { data: test, error } = await supabase
    .from('tests')
    .insert({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      time_limit: formData.timeLimit,
      passing_score: formData.passingScore,
      estimated_duration: formData.estimatedDuration,
      cover_image: formData.coverImage,
      tags: formData.tags ?? [],
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;

  // 2. Insert static question links
  if (formData.type === 'static' && formData.questions?.length) {
    const questionRows = formData.questions.map((qId: string, i: number) => ({
      test_id: test.id,
      question_id: qId,
      sort_order: i,
    }));
    const { error: qErr } = await supabase.from('test_questions').insert(questionRows);
    if (qErr) throw qErr;
  }

  // 3. Insert dynamic rules
  if (formData.type === 'dynamic' && formData.dynamicRules?.length) {
    const ruleRows = formData.dynamicRules.map((rule: any) => ({
      test_id: test.id,
      module_id: rule.moduleId,
      question_count: rule.questionCount,
      difficulty: rule.difficulty,
    }));
    const { error: rErr } = await supabase.from('test_dynamic_rules').insert(ruleRows);
    if (rErr) throw rErr;
  }
}

export async function updateTest(id: string, formData: CreateTestValues): Promise<void> {
  const { error } = await supabase
    .from('tests')
    .update({
      title: formData.title,
      description: formData.description,
      type: formData.type,
      time_limit: formData.timeLimit,
      passing_score: formData.passingScore,
      estimated_duration: formData.estimatedDuration,
      cover_image: formData.coverImage,
      tags: formData.tags ?? [],
    })
    .eq('id', id);

  if (error) throw error;

  // Replace questions
  await supabase.from('test_questions').delete().eq('test_id', id);
  if (formData.type === 'static' && formData.questions?.length) {
    await supabase.from('test_questions').insert(
      formData.questions.map((qId: string, i: number) => ({
        test_id: id,
        question_id: qId,
        sort_order: i,
      }))
    );
  }

  // Replace dynamic rules
  await supabase.from('test_dynamic_rules').delete().eq('test_id', id);
  if (formData.type === 'dynamic' && formData.dynamicRules?.length) {
    await supabase.from('test_dynamic_rules').insert(
      formData.dynamicRules.map((rule: any) => ({
        test_id: id,
        module_id: rule.moduleId,
        question_count: rule.questionCount,
        difficulty: rule.difficulty,
      }))
    );
  }
}

export async function deleteTest(id: string): Promise<void> {
  const { error } = await supabase.from('tests').delete().eq('id', id);
  if (error) throw error;
}

export async function toggleTestActive(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase.from('tests').update({ is_active: isActive }).eq('id', id);
  if (error) throw error;
}

function mapDbToTest(row: any): Test {
  const base = {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    timeLimit: row.time_limit,
    passingScore: row.passing_score,
    estimatedDuration: row.estimated_duration,
    coverImage: row.cover_image ?? '',
    isActive: row.is_active,
    tags: row.tags ?? [],
    createdAt: new Date(row.created_at),
  };

  if (row.type === 'static') {
    return {
      ...base,
      type: 'static' as const,
      questionIds: (row.test_questions ?? [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((q: any) => q.question_id),
    };
  }

  return {
    ...base,
    type: 'dynamic' as const,
    rules: (row.test_dynamic_rules ?? []).map((r: any) => ({
      moduleId: r.module_id,
      questionCount: r.question_count,
      difficulty: r.difficulty,
    })),
  };
}