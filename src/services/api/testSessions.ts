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