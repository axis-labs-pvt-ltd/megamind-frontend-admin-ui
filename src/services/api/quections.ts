// lib/api/questions.ts
import { supabase } from '@/lib/supabase';
import { Question } from '@/types';
import { QuestionFormData } from '@/lib/validations/question';

// ---- Fetch all questions ----
export async function fetchQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      question_options(*),
      question_matching_pairs(*),
      question_categories(category_id, categories(*)),
      question_tags(tag_id, tags(*))
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(mapDbToQuestion);
}

// ---- Create question ----
export async function createQuestion(formData: QuestionFormData): Promise<Question> {
  // 1. Insert question row
  const { data: question, error } = await supabase
    .from('questions')
    .insert({
      type: formData.type,
      text: formData.text,
      difficulty: formData.difficulty,
      module_id: formData.moduleId || null,
      correct_answer: formData.correctAnswer,
      solution_video_url: formData.solutionVideoUrl || null,
    })
    .select()
    .single();

  if (error) throw error;

  // 2. Insert options (if applicable)
 if ('options' in formData && formData.options?.length) {
  const options = formData.options.map((option, i) => ({
    question_id: question.id,
    option_key: option.id || `opt${i + 1}`,
    text: option.text,
    sort_order: i,
  }));
  const { error: optErr } = await supabase.from('question_options').insert(options);
  if (optErr) throw optErr;
}

  // 3. Insert matching pairs (if applicable)
  if ('matchingPairs' in formData && formData.matchingPairs?.length) {
    const pairs = formData.matchingPairs.map((pair: any, i: number) => ({
      question_id: question.id,
      left_text: pair.left,
      right_text: pair.right,
      sort_order: i,
    }));
    const { error: pairErr } = await supabase.from('question_matching_pairs').insert(pairs);
    if (pairErr) throw pairErr;
  }

  // 4. Link categories
  if (formData.categoryIds?.length) {
    const cats = formData.categoryIds.map((category_id: string) => ({
      question_id: question.id,
      category_id,
    }));
    await supabase.from('question_categories').insert(cats);
  }

  // 5. Link tags
  if (formData.tagIds?.length) {
    const tags = formData.tagIds.map((tag_id: string) => ({
      question_id: question.id,
      tag_id,
    }));
    await supabase.from('question_tags').insert(tags);
  }

  // Re-fetch the full question with relations
  const questions = await fetchQuestions();
  return questions.find(q => q.id === question.id)!;
}

// ---- Update question ----
export async function updateQuestion(id: string, formData: QuestionFormData): Promise<Question> {
  // Update core fields
  const { error } = await supabase
    .from('questions')
    .update({
      type: formData.type,
      text: formData.text,
      difficulty: formData.difficulty,
      module_id: formData.moduleId || null,
      correct_answer: formData.correctAnswer,
      solution_video_url: formData.solutionVideoUrl || null,
    })
    .eq('id', id);

  if (error) throw error;

 await supabase.from('question_options').delete().eq('question_id', id);
if ('options' in formData && formData.options?.length) {
  const options = formData.options.map((option, i) => ({
    question_id: id,
    option_key: option.id || `opt${i + 1}`,
    text: option.text,
    sort_order: i,
  }));
  await supabase.from('question_options').insert(options);
}

  // Replace matching pairs
  await supabase.from('question_matching_pairs').delete().eq('question_id', id);
  if ('matchingPairs' in formData && formData.matchingPairs?.length) {
    const pairs = formData.matchingPairs.map((pair: any, i: number) => ({
      question_id: id,
      left_text: pair.left,
      right_text: pair.right,
      sort_order: i,
    }));
    await supabase.from('question_matching_pairs').insert(pairs);
  }

  // Replace category/tag links
  await supabase.from('question_categories').delete().eq('question_id', id);
  await supabase.from('question_tags').delete().eq('question_id', id);

  if (formData.categoryIds?.length) {
    await supabase.from('question_categories').insert(
      formData.categoryIds.map((category_id: string) => ({ question_id: id, category_id }))
    );
  }
  if (formData.tagIds?.length) {
    await supabase.from('question_tags').insert(
      formData.tagIds.map((tag_id: string) => ({ question_id: id, tag_id }))
    );
  }

  const questions = await fetchQuestions();
  return questions.find(q => q.id === id)!;
}

// ---- Delete question ----
export async function deleteQuestion(id: string): Promise<void> {
  const { error } = await supabase.from('questions').delete().eq('id', id);
  if (error) throw error;
}

// ---- Map DB row → Question type ----
function mapDbToQuestion(row: any): Question {
  return {
    id: row.id,
    type: row.type,
    text: row.text,
    difficulty: row.difficulty,
    moduleId: row.module_id,
    correctAnswer: row.correct_answer,
    solutionVideoUrl: row.solution_video_url,
    createdAt: new Date(row.created_at),
    options: row.question_options
      ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((o: any) => ({ id: o.option_key, text: o.text })) ?? [],
    matchingPairs: row.question_matching_pairs
      ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((p: any) => ({ left: p.left_text, right: p.right_text })) ?? [],
    categories: row.question_categories?.map((qc: any) => qc.categories) ?? [],
    tags: row.question_tags?.map((qt: any) => qt.tags) ?? [],
  };
}