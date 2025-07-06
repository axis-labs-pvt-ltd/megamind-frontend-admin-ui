import React, { useState, useEffect } from 'react';
import { Question, TestSession } from '../../types';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Timer } from '../atoms/Timer';
import { Badge } from '../atoms/Badge';
import { ChevronLeft, ChevronRight, Flag, CheckCircle } from 'lucide-react';

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
  const [draggedItems, setDraggedItems] = useState<string[]>([]);
  
  const currentQuestion = session.questions[currentIndex];
  const userAnswer = session.answers[currentQuestion?.id];
  const progress = ((currentIndex + 1) / session.questions.length) * 100;
  
  const handleAnswerSelect = (answer: string) => {
    if (currentQuestion) {
      onAnswerChange(currentQuestion.id, answer);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    const newItems = [...draggedItems];
    newItems[index] = item;
    setDraggedItems(newItems);
    
    if (currentQuestion) {
      onAnswerChange(currentQuestion.id, newItems.filter(Boolean));
    }
  };

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

  const isLastQuestion = currentIndex === session.questions.length - 1;
  const answeredQuestions = Object.keys(session.answers).length;

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="primary" size="md">
            Question {currentIndex + 1} of {session.questions.length}
          </Badge>
          <Timer
            initialTime={session.timeLimit * 60}
            onTimeUp={onTimeUp}
          />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {answeredQuestions}/{session.questions.length} answered
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <Card className="p-6">
        <div className="space-y-6">
          {/* Question Text */}
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.text}
            </h2>
          </div>

          {/* MCQ Options */}
          {currentQuestion.type === 'mcq' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    userAnswer === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      userAnswer === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {userAnswer === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-900">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Yes/No Options */}
          {currentQuestion.type === 'yes-no' && (
            <div className="flex space-x-4">
              {['Yes', 'No'].map((option) => (
                <div
                  key={option}
                  className={`flex-1 p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    userAnswer === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      userAnswer === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {userAnswer === option && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{option}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Drag and Drop */}
          {currentQuestion.type === 'drag-drop' && currentQuestion.options && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                {/* Available Items */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Available Options</h4>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, option)}
                        className="p-3 bg-gray-100 rounded-lg cursor-move hover:bg-gray-200 transition-colors"
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Drop Zone */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Your Order</h4>
                  <div className="space-y-2">
                    {Array.from({ length: currentQuestion.options.length }).map((_, index) => (
                      <div
                        key={index}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        className="p-3 border-2 border-dashed border-gray-300 rounded-lg min-h-[3rem] flex items-center justify-center text-gray-500 hover:border-gray-400"
                      >
                        {draggedItems[index] || `Position ${index + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          icon={ChevronLeft}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            icon={Flag}
            onClick={() => {/* Flag for review */}}
          >
            Flag for Review
          </Button>
        </div>

        {isLastQuestion ? (
          <Button
            variant="primary"
            icon={CheckCircle}
            onClick={onSubmit}
          >
            Submit Test
          </Button>
        ) : (
          <Button
            variant="outline"
            icon={ChevronRight}
            iconPosition="right"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};