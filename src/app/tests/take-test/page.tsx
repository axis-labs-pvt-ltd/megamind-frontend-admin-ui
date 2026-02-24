'use client';

import { QuestionCard } from '@/components/features/questions/QuestionCard';
import { ScoreCard } from '@/components/features/tests/ScoreCard';
import { TestInterface } from '@/components/features/tests/TestInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fetchQuestions } from '@/services/api/quections';
import { completeTestSession, startTestSession } from '@/services/api/testSessions';
import { fetchTests } from '@/services/api/tests';
import { Question, Test, TestSession } from '@/types';
import { Home, Loader2, Play, RotateCcw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function TakeTestPage() {
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
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [tests, questions] = await Promise.all([
          fetchTests(),
          fetchQuestions(),
        ]);

        const selected = testId
          ? tests.find(t => t.id === testId)
          : tests[0];

        if (!selected) throw new Error('Test not found');

        console.log('Loaded test:', selected);
        console.log('Test type:', selected.type);
        console.log('questionIds:', (selected as any).questionIds);
        console.log('rules:', (selected as any).rules);
        console.log('Total questions loaded:', questions.length);
        console.log('Question IDs from DB:', questions.map(q => q.id));

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
    return t.questionIds
      .map(id => allQuestions.find(q => q.id === id))
      .filter((q): q is Question => q !== undefined);
  }

  // t.type === 'dynamic'
  const picked: Question[] = [];
  t.rules.forEach(rule => {
    const matching = allQuestions.filter(
      q => q.moduleId === rule.moduleId && q.difficulty === rule.difficulty
    );
    const shuffled = [...matching].sort(() => Math.random() - 0.5);
    picked.push(...shuffled.slice(0, rule.questionCount));
  });
  return picked;
};

  const startTest = async () => {
    if (!test) return;
    try {
      const questions = resolveQuestions(test);

      if (questions.length === 0) {
        throw new Error(
          test.type === 'static'
            ? `No questions matched. Test has ${test.questionIds.length} IDs but none found in ${allQuestions.length} loaded questions. Check console.`
            : `No questions matched the dynamic rules. Check that questions exist with matching moduleId and difficulty.`
        );
      }

      const sid = await startTestSession(test.id, questions);
      setSessionId(sid);
      setSessionQuestions(questions);
      setStartTime(new Date());
      setTestStarted(true);
    } catch (err: any) {
      setError(err.message ?? 'Failed to start test');
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!sessionId || !startTime || !test) return;
    setIsSubmitting(true);
    try {
      const timeSpent = Math.round((Date.now() - startTime.getTime()) / 1000);
      let correctAnswers = 0;

      sessionQuestions.forEach(q => {
        const userAnswer = answers[q.id];
        if (userAnswer && JSON.stringify(userAnswer) === JSON.stringify(q.correctAnswer)) {
          correctAnswers++;
        }
      });

      const score = Math.round((correctAnswers / sessionQuestions.length) * 100);
      await completeTestSession(sessionId, score, timeSpent, answers, sessionQuestions);

      setTestResult({ score, correctAnswers, totalQuestions: sessionQuestions.length });
      setShowResults(true);
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
    setStartTime(null);
    setTestStarted(false);
    setTestResult(null);
    setShowResults(false);
    setError(null);
  };

  // ---- Loading ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-3" />
        <span className="text-[var(--text-secondary)]">Loading test...</span>
      </div>
    );
  }

  // ---- Error ----
  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center space-y-4">
          <p className="text-red-500 text-sm">{error}</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => { setError(null); retakeTest(); }}>
              Try Again
            </Button>
            <Button variant="outline" onClick={() => router.push('/tests')}>
              <Home className="h-4 w-4 mr-2" /> Back to Tests
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!test) return null;

  // ---- Pre-test screen ----
  if (!testStarted && !showResults) {
    const questionCount = test.type === 'static'
      ? test.questionIds.length
      : test.rules.reduce((sum, r) => sum + r.questionCount, 0);

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{test.title}</h2>
              <p className="text-gray-600">{test.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{questionCount}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Time Limit</p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{test.timeLimit} min</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Passing Score: {test.passingScore}%</p>
            </div>

            <div className="space-y-3">
              <Button variant="primary" size="md" onClick={startTest} className="w-full">
                <Play className="h-4 w-4 mr-2" /> Start Test
              </Button>
              <Button variant="outline" size="md" onClick={() => router.push('/tests')} className="w-full">
                <Home className="h-4 w-4 mr-2" /> Back to Tests
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // ---- Results screen ----
  if (showResults && testResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Test Results</h2>
          <p className="text-gray-600">Here's how you performed on {test.title}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ScoreCard
            title="Your Score"
            score={testResult.correctAnswers}
            totalQuestions={testResult.totalQuestions}
            percentage={testResult.score}
          />
          <ScoreCard
            title="Accuracy"
            score={testResult.correctAnswers}
            totalQuestions={testResult.totalQuestions}
            percentage={Math.round((testResult.correctAnswers / testResult.totalQuestions) * 100)}
          />
          <ScoreCard
            title="Status"
            score={testResult.score >= test.passingScore ? 1 : 0}
            totalQuestions={1}
            percentage={testResult.score >= test.passingScore ? 100 : 0}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Question Review</h3>
          {sessionQuestions.map(question => (
            <QuestionCard
              key={question.id}
              question={question}
              showAnswer={true}
              userAnswer={answers[question.id]}
            />
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={retakeTest}>
            <RotateCcw className="h-4 w-4 mr-2" /> Retake Test
          </Button>
          <Button variant="primary" onClick={() => router.push('/tests')}>
            <Home className="h-4 w-4 mr-2" /> Back to Tests
          </Button>
        </div>
      </div>
    );
  }

  // ---- Active test ----
  if (testStarted && sessionId) {
    return (
      <TestInterface
        session={{
          id: sessionId,
          testId: test.id,
          studentId: '1',
          questions: sessionQuestions,
          startTime: startTime!,
          timeLimit: test.timeLimit,
          currentQuestionIndex: 0,
          answers,
          isCompleted: false,
        }}
        onAnswerChange={handleAnswerChange}
        onSubmit={handleSubmit}
        onTimeUp={handleSubmit}
      />
    );
  }

  return null;
}