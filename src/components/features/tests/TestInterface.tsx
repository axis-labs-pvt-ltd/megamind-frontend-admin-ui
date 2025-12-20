// Client Component - Main Test Interface
'use client';

import { TestSession } from '@/types';
import React, { useState } from 'react';
import { QuestionRenderer } from './QuestionRenderer';
import { TestHeader } from './TestHeader';
import { TestNavigation } from './TestNavigation';

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

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <TestHeader
        currentQuestionIndex={currentIndex}
        totalQuestions={session.questions.length}
        answeredCount={answeredQuestions}
        timeLimit={session.timeLimit}
        onTimeUp={onTimeUp}
      />

      {/* Flagged Status Banner (if current question is flagged) */}
      {flaggedQuestions.has(currentQuestion.id) && !isSubmitted && (
         <div className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-md text-sm font-medium border border-yellow-200">
             ⚠️ You have flagged this question for review.
         </div>
      )}
      
      {/* Submission Banner */}
      {isSubmitted && (
          <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-md text-sm font-medium border border-blue-200 flex justify-between items-center">
              <span>Review Mode: Correct answers are highlighted.</span>
              <button onClick={handleFinishReview} className="underline hover:text-blue-900">Exit Review</button>
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
      />
      
      {/* Question Map (Optional: Quick Nav to flagged items) */}
       <div className="mt-8 pt-6 border-t border-[var(--border-primary)]">
         <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Question Map</h4>
         <div className="flex flex-wrap gap-2">
           {session.questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isFlagged = flaggedQuestions.has(q.id);
              const isAnswered = session.answers && session.answers[q.id];
              const isCorrect = isSubmitted && (session.answers?.[q.id] === q.correctAnswer);
              const isWrong = isSubmitted && session.answers?.[q.id] && (session.answers?.[q.id] !== q.correctAnswer);

              let bgClass = 'bg-[var(--bg-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)]';
              if (isCurrent) bgClass = 'ring-2 ring-[var(--accent-blue)] border-[var(--accent-blue)] text-[var(--accent-blue)] bg-blue-50';
              else if (isFlagged) bgClass = 'bg-yellow-100 border-yellow-300 text-yellow-700';
              else if (isSubmitted) {
                   if (isCorrect) bgClass = 'bg-green-100 border-green-300 text-green-700';
                   else if (isWrong) bgClass = 'bg-red-100 border-red-300 text-red-700';
                   else bgClass = 'bg-gray-100 text-gray-400';
              }
              else if (isAnswered) bgClass = 'bg-blue-50 border-blue-200 text-blue-700';

              return (
                 <button
                   key={idx}
                   onClick={() => setCurrentIndex(idx)}
                   className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-medium border transition-all ${bgClass}`}
                 >
                    {idx + 1}
                 </button>
              )
           })}
         </div>
         <div className="mt-2 flex gap-4 text-xs text-[var(--text-secondary)]">
              <span className="flex items-center"><span className="w-2 h-2 bg-yellow-100 border border-yellow-300 rounded-full mr-1"></span> Flagged</span>
              <span className="flex items-center"><span className="w-2 h-2 bg-blue-50 border border-blue-200 rounded-full mr-1"></span> Answered</span>
              {isSubmitted && (
                 <>
                   <span className="flex items-center"><span className="w-2 h-2 bg-green-100 border border-green-300 rounded-full mr-1"></span> Correct</span>
                   <span className="flex items-center"><span className="w-2 h-2 bg-red-100 border border-red-300 rounded-full mr-1"></span> Wrong</span>
                 </>
              )}
         </div>
       </div>
    </div>
  );
};
