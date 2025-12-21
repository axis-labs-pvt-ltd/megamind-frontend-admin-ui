// Client Component - Main Test Interface
'use client';

import { TestSession } from '@/types';
import React, { useState } from 'react';
import { QuestionRenderer } from './QuestionRenderer';
import { TestHeader } from './TestHeader';
import { TestNavigation } from './TestNavigation';
import { TestQuestionNavigator } from './TestQuestionNavigator';

interface TestInterfaceProps {
  session: TestSession;
  onAnswerChange: (questionId: string, answer: string | string[]) => void;
  onSubmit: () => void;
  onTimeUp: () => void;
}

export const TestInterface: React.FC<TestInterfaceProps> = ({
  session,
  onAnswerChange,
  onSubmit,
  onTimeUp,
}) => {
  const [currentIndex, setCurrentIndex] = useState(session.currentQuestionIndex);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [isSubmitted, setIsSubmitted] = useState(false); // Local submission state for Review Mode

  const currentQuestion = session.questions[currentIndex];
  // Safe check for answers object
  const userAnswer = session.answers ? session.answers[currentQuestion?.id] : undefined;
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFlag = () => {
    if (!currentQuestion) return;
    const newFlags = new Set(flaggedQuestions);
    if (newFlags.has(currentQuestion.id)) {
      newFlags.delete(currentQuestion.id);
    } else {
      newFlags.add(currentQuestion.id);
    }
    setFlaggedQuestions(newFlags);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // onSubmit(); // In a real app, this might wait for user to review "score" first, or this view IS the score view.
    // For now, if we want to show answers, we keep them here.
    // If the external onSubmit redirects, we might need to delay it or show a "Finish Review" button.
    // Assuming for this requirement, we show the review state locally first.
  };
  
  const handleFinishReview = () => {
      onSubmit();
  };

  const answeredQuestions = session.answers ? Object.keys(session.answers).length : 0;

  // Auto-submit when time is up
  const handleTimeUp = () => {
    if (!isSubmitted) {
      handleSubmit();
    }
    // Propagate the event
    onTimeUp();
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
          <TestHeader
            currentQuestionIndex={currentIndex}
            totalQuestions={session.questions.length}
            answeredCount={answeredQuestions}
            timeLimit={session.timeLimit}
            onTimeUp={handleTimeUp}
            isSubmitted={isSubmitted}
          />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Main Content - Left Column */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Flagged Status Banner */}
          {flaggedQuestions.has(currentQuestion.id) && !isSubmitted && (
             <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium border border-yellow-200 animate-in fade-in slide-in-from-top-2">
                 ⚠️ You have flagged this question for review.
             </div>
          )}
          
          {/* Submission Banner */}
          {isSubmitted && (
              <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-md text-sm font-medium border border-blue-200 flex justify-between items-center shadow-sm">
                  <span>Review Mode: Correct answers are highlighted.</span>
                  <button onClick={handleFinishReview} className="underline hover:text-blue-900 font-bold">Exit Review</button>
              </div>
          )}

          {/* Question Renderer */}
          <QuestionRenderer
            question={currentQuestion}
            userAnswer={userAnswer}
            onAnswerChange={(answer) => onAnswerChange(currentQuestion.id, answer)}
            showResult={isSubmitted}
          />

          {/* Navigation */}
          <TestNavigation
            currentIndex={currentIndex}
            totalQuestions={session.questions.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={isSubmitted ? handleFinishReview : handleSubmit}
            onFlag={handleFlag}
            isFlagged={flaggedQuestions.has(currentQuestion.id)}
            isSubmitted={isSubmitted}
          />
        </div>

        {/* Sticky Sidebar - Right Column */}
        <div className="hidden lg:block w-80 flex-shrink-0">
           <div className="sticky top-6">
              <TestQuestionNavigator 
                questions={session.questions}
                currentIndex={currentIndex}
                answers={session.answers || {}}
                flaggedQuestions={flaggedQuestions}
                isSubmitted={isSubmitted}
                onNavigate={setCurrentIndex}
              />
           </div>
        </div>
      </div>
    </div>
  );
};
