'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Timer } from '@/components/ui/timer';
import { cn } from '@/lib/utils';
import { TestSession } from '@/types';
import { CheckCircle, ChevronLeft, ChevronRight, Flag, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
  const [availableItems, setAvailableItems] = useState<string[]>([]);
  
  const currentQuestion = session.questions[currentIndex];
  // Safe check for answers object
  const userAnswer = session.answers ? session.answers[currentQuestion?.id] : undefined;
  const progress = ((currentIndex + 1) / session.questions.length) * 100;
  
  // Initialize drag and drop state when question changes
  useEffect(() => {
    if (currentQuestion?.type === 'drag-drop' && currentQuestion.options) {
      const existingAnswer = session.answers ? session.answers[currentQuestion.id] : undefined;
      
      if (Array.isArray(existingAnswer) && existingAnswer.length > 0) {
        // Restore previous answer
        setDraggedItems(existingAnswer);
        const usedItems = new Set(existingAnswer);
        setAvailableItems(currentQuestion.options.filter(item => !usedItems.has(item)));
      } else {
        // Initialize fresh state
        setDraggedItems([]);
        setAvailableItems([...currentQuestion.options]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion]);

  const handleAnswerSelect = (answer: string) => {
    if (currentQuestion) {
      onAnswerChange(currentQuestion.id, answer);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropToOrder = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    
    if (!item || !currentQuestion) return;

    const newDraggedItems = [...draggedItems];
    const newAvailableItems = [...availableItems];

    // Remove item from available items if it's coming from there
    const availableIndex = newAvailableItems.indexOf(item);
    if (availableIndex > -1) {
      newAvailableItems.splice(availableIndex, 1);
    }

    // Remove item from its current position in dragged items if it's already there
    const currentIndex = newDraggedItems.indexOf(item);
    if (currentIndex > -1) {
      newDraggedItems.splice(currentIndex, 1);
    }

    // Insert item at target position
    newDraggedItems.splice(targetIndex, 0, item);

    setDraggedItems(newDraggedItems);
    setAvailableItems(newAvailableItems);
    
    // Update answer
    onAnswerChange(currentQuestion.id, newDraggedItems.filter(Boolean));
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    
    if (!item || !currentQuestion) return;

    const newDraggedItems = [...draggedItems];
    const newAvailableItems = [...availableItems];

    // Remove item from dragged items
    const draggedIndex = newDraggedItems.indexOf(item);
    if (draggedIndex > -1) {
      newDraggedItems.splice(draggedIndex, 1);
      // Add back to available items if not already there
      if (!newAvailableItems.includes(item)) {
        newAvailableItems.push(item);
      }
    }

    setDraggedItems(newDraggedItems);
    setAvailableItems(newAvailableItems);
    
    // Update answer
    onAnswerChange(currentQuestion.id, newDraggedItems.filter(Boolean));
  };

  const handleRemoveFromOrder = (item: string) => {
    if (!currentQuestion) return;

    const newDraggedItems = draggedItems.filter(draggedItem => draggedItem !== item);
    const newAvailableItems = [...availableItems];
    
    if (!newAvailableItems.includes(item)) {
      newAvailableItems.push(item);
    }

    setDraggedItems(newDraggedItems);
    setAvailableItems(newAvailableItems);
    
    // Update answer
    onAnswerChange(currentQuestion.id, newDraggedItems);
  };

  const handleResetDragDrop = () => {
    if (currentQuestion?.options) {
      setDraggedItems([]);
      setAvailableItems([...currentQuestion.options]);
      onAnswerChange(currentQuestion.id, []);
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
  const answeredQuestions = session.answers ? Object.keys(session.answers).length : 0;

  if (!currentQuestion) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Badge variant="primary">
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
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                    userAnswer === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      userAnswer === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    )}>
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
                  className={cn(
                    "flex-1 p-4 rounded-lg border cursor-pointer transition-all duration-200",
                    userAnswer === option
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  )}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2",
                      userAnswer === option
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    )}>
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
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Available Items */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Available Options</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetDragDrop}
                      className="text-gray-500 hover:text-gray-700"
                    >
                       <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                  <div
                    className="min-h-[200px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50"
                    onDragOver={handleDragOver}
                    onDrop={handleDropToAvailable}
                  >
                    <div className="space-y-2">
                      {availableItems.map((item, index) => (
                        <div
                          key={`available-${index}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          className="p-3 bg-white rounded-lg border border-gray-200 cursor-move hover:shadow-md transition-all duration-200 hover:border-blue-300"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="text-gray-900">{item}</span>
                          </div>
                        </div>
                      ))}
                      {availableItems.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p>All items have been placed in order</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Drop Zone - Ordered List */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Your Answer (Drag to arrange)</h4>
                  <div className="space-y-2">
                    {Array.from({ length: Math.max(currentQuestion.options.length, draggedItems.length + 1) }).map((_, index) => (
                      <div
                        key={`drop-zone-${index}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropToOrder(e, index)}
                        className={cn(
                          "min-h-[3.5rem] p-3 border-2 border-dashed rounded-lg transition-all duration-200",
                          draggedItems[index]
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                        )}
                      >
                        {draggedItems[index] ? (
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, draggedItems[index])}
                            className="flex items-center justify-between p-2 bg-white rounded border border-blue-200 cursor-move hover:shadow-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                {index + 1}
                              </div>
                              <span className="text-gray-900">{draggedItems[index]}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFromOrder(draggedItems[index])}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
                            >
                              ×
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                              <div className="w-6 h-6 bg-gray-200 rounded-full mx-auto mb-1 flex items-center justify-center text-sm">
                                {index + 1}
                              </div>
                              <span className="text-xs">Drop here</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Answer Preview */}
              {draggedItems.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 mb-2">Current Answer:</h5>
                  <p className="text-blue-800">
                    {draggedItems.join(' → ')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
           <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            onClick={() => {/* Flag for review */}}
          >
             <Flag className="h-4 w-4 mr-2" />
            Flag for Review
          </Button>
        </div>

        {isLastQuestion ? (
          <Button
            variant="primary"
            onClick={onSubmit}
          >
             <CheckCircle className="h-4 w-4 mr-2" />
            Submit Test
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={handleNext}
          >
            Next
             <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};
