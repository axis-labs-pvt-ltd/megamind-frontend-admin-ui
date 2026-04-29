// lib/api/testSessions.ts
import { supabase } from '@/lib/supabase';
import { Question, TestSession } from '@/types';

// ---- Start a new session ----
export async function startTestSession(testId: string, questions: Question[]): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from('test_sessions')
    .insert({
      test_id: testId,
      student_id: user?.id ?? null,
      is_completed: false,
    })
    .select()
    .single();

  if (error) throw error;
  return data.id;
}

// ---- Save a single answer (upsert as user progresses) ----
export async function saveAnswer(
  sessionId: string,
  questionId: string,
  answer: string | string[],
  isCorrect: boolean
): Promise<void> {
  const { error } = await supabase
    .from('test_session_answers')
    .upsert(
      {
        session_id: sessionId,
        question_id: questionId,
        answer,
        is_correct: isCorrect,
      },
      { onConflict: 'session_id,question_id' }
    );

  if (error) throw error;
}

// ---- Complete a session ----
export async function completeTestSession(
  sessionId: string,
  score: number,
  timeSpent: number,
  answers: Record<string, string | string[]>,
  questions: Question[]
): Promise<void> {
  // 1. Update the session row
  const { error: sessionErr } = await supabase
    .from('test_sessions')
    .update({
      is_completed: true,
      completed_at: new Date().toISOString(),
      score,
      time_spent: timeSpent,
    })
    .eq('id', sessionId);

  if (sessionErr) throw sessionErr;

  // 2. Upsert all answers at once
  const answerRows = questions.map((q) => {
    const answer = answers[q.id] ?? null;
    const isCorrect = answer
      ? JSON.stringify(answer) === JSON.stringify(q.correctAnswer)
      : false;

    return {
      session_id: sessionId,
      question_id: q.id,
      answer,
      is_correct: isCorrect,
    };
  });

  const { error: answerErr } = await supabase
    .from('test_session_answers')
    .upsert(answerRows, { onConflict: 'session_id,question_id' });

  if (answerErr) throw answerErr;
}

// ---- Fetch all sessions for a test (admin view) ----
export async function fetchTestSessions(testId: string) {
  const { data, error } = await supabase
    .from('test_sessions')
    .select(`
      *,
      test_session_answers(*)
    `)
    .eq('test_id', testId)
    .order('started_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ---- Fetch full details for a single completed session ----
export async function fetchSessionDetails(sessionId: string): Promise<{
  questions: Question[];
  answers: Record<string, string | string[]>;
}> {
  const { data, error } = await supabase
    .from('test_session_answers')
    .select(`
      question_id,
      answer,
      questions!inner(
        id, type, text, image_url, difficulty, module_id,
        correct_answer, solution_video_url, created_at,
        question_options(option_key, text, sort_order),
        question_matching_pairs(left_text, right_text, sort_order),
        question_categories(category_id, categories(id, name, color)),
        question_tags(tag_id, tags(id, name, color))
      )
    `)
    .eq('session_id', sessionId);

  if (error) throw error;

  const questions: Question[] = (data ?? []).map((row: any) => {
    const q = row.questions;
    return {
      id: q.id,
      type: q.type,
      text: q.text,
      imageUrl: q.image_url ?? undefined,
      difficulty: q.difficulty,
      moduleId: q.module_id,
      correctAnswer: q.correct_answer,
      solutionVideoUrl: q.solution_video_url ?? undefined,
      createdAt: new Date(q.created_at),
      options: (q.question_options ?? [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((o: any) => ({ id: o.option_key, text: o.text })),
      matchingPairs: (q.question_matching_pairs ?? [])
        .sort((a: any, b: any) => a.sort_order - b.sort_order)
        .map((p: any) => ({ left: p.left_text, right: p.right_text })),
      categories: (q.question_categories ?? []).map((qc: any) => qc.categories ?? { id: '', name: '', color: '' }),
      tags: (q.question_tags ?? []).map((qt: any) => qt.tags ?? { id: '', name: '', color: '' }),
    } as Question;
  });

  const answers: Record<string, string | string[]> = {};
  (data ?? []).forEach((row: any) => {
    if (row.answer !== null && row.answer !== undefined) {
      answers[row.question_id] = row.answer;
    }
  });

  return { questions, answers };
}

// ---- Fetch past attempts for a student ----
export async function fetchStudentAttempts(studentId: string) {
  const { data, error } = await supabase
    .from('test_sessions')
    .select(`
      *,
      tests(title, passing_score),
      test_session_answers(*)
    `)
    .eq('student_id', studentId)
    .eq('is_completed', true)
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data;
}