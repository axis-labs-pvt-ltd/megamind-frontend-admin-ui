// lib/api/testSessions.ts
import { supabase } from '@/lib/supabase';
import { fetchQuestionsByIds } from './quections';
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
  // Step 1: get the stored answers (question_id + student's answer)
  const { data: answerRows, error: answerErr } = await supabase
    .from('test_session_answers')
    .select('question_id, answer')
    .eq('session_id', sessionId);

  if (answerErr) throw answerErr;
  if (!answerRows?.length) return { questions: [], answers: {} };

  // Step 2: fetch full question data using the IDs
  const questionIds = answerRows.map((r: any) => r.question_id as string);
  const questions = await fetchQuestionsByIds(questionIds);

  // Preserve the original question order from the session
  const orderMap: Record<string, number> = {};
  questionIds.forEach((id, i) => { orderMap[id] = i; });
  questions.sort((a, b) => (orderMap[a.id] ?? 0) - (orderMap[b.id] ?? 0));

  // Build answers map
  const answers: Record<string, string | string[]> = {};
  answerRows.forEach((row: any) => {
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