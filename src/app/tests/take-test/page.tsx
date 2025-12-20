'use client';

import { QuestionCard } from '@/components/features/questions/QuestionCard';
import { ScoreCard } from '@/components/features/tests/ScoreCard';
import { TestInterface } from '@/components/features/tests/TestInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { mockQuestions, mockTests } from '@/lib/mock-data';
import { TestSession } from '@/types';
import { Home, Play, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TakeTestPage() {
  const router = useRouter();
  const [currentTest] = useState(mockTests[0]);
  const [testSession, setTestSession] = useState<TestSession | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const startTest = () => {
    // Create a test session with questions
    const questions = currentTest.type === 'static' 
      ? mockQuestions.filter(q => currentTest.questionIds.includes(q.id))
      : mockQuestions.slice(0, 5); // Simplified for demo

    const session: TestSession = {
      id: Date.now().toString(),
      testId: currentTest.id,
      studentId: '1',
      questions,
      startTime: new Date(),
      timeLimit: currentTest.timeLimit,
      currentQuestionIndex: 0,
      answers: {},
      isCompleted: false
    };

    setTestSession(session);
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    if (!testSession) return;

    setTestSession({
      ...testSession,
      answers: {
        ...testSession.answers,
        [questionId]: answer
      }
    });
  };

  const handleSubmit = () => {
    if (!testSession) return;

    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = testSession.questions.length;

    testSession.questions.forEach(question => {
      const userAnswer = testSession.answers[question.id];
      if (userAnswer && JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer)) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / totalQuestions) * 100);

    setTestResult({
      score,
      correctAnswers,
      totalQuestions,
      answers: testSession.answers,
      questions: testSession.questions
    });

    setShowResults(true);
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  const retakeTest = () => {
    setTestSession(null);
    setTestResult(null);
    setShowResults(false);
  };

  // Pre-test screen
  if (!testSession && !showResults) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentTest.title}</h2>
              <p className="text-gray-600">{currentTest.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentTest.type === 'static' ? currentTest.questionIds.length : 3}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Time Limit</p>
                <p className="text-2xl font-bold text-gray-900">{currentTest.timeLimit} min</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium">Passing Score: {currentTest.passingScore}%</p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                size="md"
                onClick={startTest}
                className="w-full"
              >
                 <Play className="h-4 w-4 mr-2" />
                Start Test
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                 <Home className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Results screen
  if (showResults && testResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Test Results</h2>
          <p className="text-gray-600">Here's how you performed on {currentTest.title}</p>
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
            score={testResult.score >= currentTest.passingScore ? 1 : 0}
            totalQuestions={1}
            percentage={testResult.score >= currentTest.passingScore ? 100 : 0}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Question Review</h3>
          {testResult.questions.map((question: any, index: number) => (
            <QuestionCard
              key={question.id}
              question={question}
              showAnswer={true}
              userAnswer={testResult.answers[question.id]}
            />
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={retakeTest}
          >
             <RotateCcw className="h-4 w-4 mr-2" />
            Retake Test
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push('/dashboard')}
          >
             <Home className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Test interface
  if (testSession) {
    return (
      <TestInterface
        session={testSession}
        onAnswerChange={handleAnswerChange}
        onSubmit={handleSubmit}
        onTimeUp={handleTimeUp}
      />
    );
  }

  return null;
}
