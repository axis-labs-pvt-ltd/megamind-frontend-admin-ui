'use client';

import { fetchQuestions } from '@/services/api/quections';
import { completeTestSession, startTestSession } from '@/services/api/testSessions';
import { fetchTests } from '@/services/api/tests';
import { Question, Test } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import { QuizActiveScreen } from './components/QuizActiveScreen';
import { QuizPreScreen } from './components/QuizPreScreen';
import { QuizResultScreen } from './components/QuizResultScreen';

export default function TakeTestPage() {
  return (
    <Suspense>
      <TakeTestPageInner />
    </Suspense>
  );
}

function TakeTestPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');

  const [test, setTest] = useState<Test | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const startTimeRef = useRef<Date | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{ score: number; correctAnswers: number; totalQuestions: number; timeSpent: number } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [tests, questions] = await Promise.all([fetchTests(), fetchQuestions()]);
        const selected = testId ? tests.find(t => t.id === testId) : tests[0];
        if (!selected) throw new Error('Test not found');
        setTest(selected);
        setAllQuestions(questions);
      } catch (err: any) {
        setError(err.message ?? 'Failed to load test');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [testId]);

  const resolveQuestions = (t: Test): Question[] => {
    if (t.type === 'static') {
      return t.questionIds.map(id => allQuestions.find(q => q.id === id)).filter((q): q is Question => q !== undefined);
    }
    const picked: Question[] = [];
    t.rules.forEach(rule => {
      const matching = allQuestions.filter(q => q.moduleId === rule.moduleId && q.difficulty === rule.difficulty);
      const shuffled = [...matching].sort(() => Math.random() - 0.5);
      picked.push(...shuffled.slice(0, rule.questionCount));
    });
    return picked;
  };

  const startTest = async () => {
    if (!test) return;
    try {
      const questions = resolveQuestions(test);
      if (questions.length === 0) throw new Error('No questions matched. Check test configuration.');
      const sid = await startTestSession(test.id, questions);
      setSessionId(sid);
      setSessionQuestions(questions);
      startTimeRef.current = new Date();
      setTestStarted(true);
    } catch (err: any) {
      setError(err.message ?? 'Failed to start test');
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!sessionId || !startTimeRef.current || !test) return;
    setIsSubmitting(true);
    try {
      const timeSpent = Math.round((Date.now() - startTimeRef.current.getTime()) / 1000);
      let correctAnswers = 0;
      sessionQuestions.forEach(q => {
        const userAnswer = answers[q.id];
        if (userAnswer && JSON.stringify(userAnswer) === JSON.stringify(q.correctAnswer)) correctAnswers++;
      });
      const score = Math.round((correctAnswers / sessionQuestions.length) * 100);
      await completeTestSession(sessionId, score, timeSpent, answers, sessionQuestions);
      setTestResult({ score, correctAnswers, totalQuestions: sessionQuestions.length, timeSpent });
    } catch (err: any) {
      setError(err.message ?? 'Failed to submit test');
    } finally {
      setIsSubmitting(false);
    }
  };

  const retakeTest = () => {
    setSessionId(null);
    setSessionQuestions([]);
    setAnswers({});
    startTimeRef.current = null;
    setTestStarted(false);
    setTestResult(null);
    setError(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--p-bg-alt)', display: 'grid', placeItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <div style={{ fontFamily: 'var(--font-display,sans-serif)', fontSize: 20, fontWeight: 600, color: 'var(--p-ink)' }}>Loading test…</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--p-bg-alt)', display: 'grid', placeItems: 'center', padding: '40px 28px' }}>
        <div style={{ maxWidth: 480, width: '100%', padding: 32, border: '2px solid var(--p-ink)', borderRadius: 18, background: 'var(--p-bg)', boxShadow: '6px 6px 0 var(--p-ink)', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>⚠️</div>
          <p style={{ fontSize: 15, color: '#D94A3D', marginBottom: 20, fontWeight: 500 }}>{error}</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button onClick={() => { setError(null); retakeTest(); }} style={ghostBtn}>Try Again</button>
            <button onClick={() => router.push('/my-tests')} style={primaryBtn}>Back to Tests</button>
          </div>
        </div>
      </div>
    );
  }

  if (!test) return null;

  if (testResult) {
    return <QuizResultScreen test={test} result={testResult} questions={sessionQuestions} answers={answers} onRetake={retakeTest} onBack={() => router.push('/my-tests')} />;
  }

  if (testStarted && sessionId) {
    return (
      <QuizActiveScreen
        test={test}
        questions={sessionQuestions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        onExit={() => router.push('/my-tests')}
      />
    );
  }

  return <QuizPreScreen test={test} onStart={startTest} onBack={() => router.push('/my-tests')} />;
}

const primaryBtn: React.CSSProperties = {
  padding: '11px 20px', border: '2px solid var(--p-ink)', borderRadius: 999,
  background: 'var(--p-primary)', color: 'var(--p-primary-ink)', fontFamily: 'var(--font-display,sans-serif)',
  fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)',
};
const ghostBtn: React.CSSProperties = {
  padding: '11px 20px', border: '2px solid var(--p-ink)', borderRadius: 999,
  background: 'var(--p-bg)', color: 'var(--p-ink)', fontFamily: 'var(--font-display,sans-serif)',
  fontWeight: 600, fontSize: 13, cursor: 'pointer', boxShadow: '3px 3px 0 var(--p-ink)',
};
