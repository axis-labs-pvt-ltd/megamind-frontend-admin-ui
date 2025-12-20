// Client Component - Question Renderer
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Question } from '@/types';
import { RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface QuestionRendererProps {
  question: Question;
  userAnswer: string | string[] | undefined;
  onAnswerChange: (answer: string | string[]) => void;
  showResult?: boolean; // New prop for Review Mode
}

export function QuestionRenderer({
  question,
  userAnswer,
  onAnswerChange,
  showResult = false,
}: QuestionRendererProps) {
  const [draggedItems, setDraggedItems] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState<string[]>([]);

  // Initialize drag and drop state
  useEffect(() => {
    if (question.type === 'drag-drop' && question.options) {
      if (Array.isArray(userAnswer) && userAnswer.length > 0) {
        setDraggedItems(userAnswer);
        const usedItems = new Set(userAnswer);
        setAvailableItems(question.options.filter(item => !usedItems.has(item)));
      } else {
        setDraggedItems([]);
        setAvailableItems([...question.options]);
      }
    }
  }, [question, userAnswer]); // Depend on userAnswer to sync

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return; // Disable interaction in review mode
    onAnswerChange(answer);
  };

  // --- Drag & Drop Handlers (Simplified for brevity, logic migrated) ---
  const handleDragStart = (e: React.DragEvent, item: string) => {
    if (showResult) return;
    e.dataTransfer.setData('text/plain', item);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDropToOrder = (e: React.DragEvent, targetIndex: number) => {
    if (showResult) return;
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (!item) return;

    const newDragged = [...draggedItems];
    const newAvailable = [...availableItems];
    
    // Logic to move item
    const availIdx = newAvailable.indexOf(item);
    if (availIdx > -1) newAvailable.splice(availIdx, 1);
    
    const dragIdx = newDragged.indexOf(item);
    if (dragIdx > -1) newDragged.splice(dragIdx, 1);
    
    newDragged.splice(targetIndex, 0, item);
    
    setDraggedItems(newDragged);
    setAvailableItems(newAvailable);
    onAnswerChange(newDragged.filter(Boolean));
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    if (showResult) return;
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    if (!item) return;

    const newDragged = [...draggedItems];
    const newAvailable = [...availableItems];

    const dragIdx = newDragged.indexOf(item);
    if (dragIdx > -1) {
      newDragged.splice(dragIdx, 1);
      if (!newAvailable.includes(item)) newAvailable.push(item);
    }

    setDraggedItems(newDragged);
    setAvailableItems(newAvailable);
    onAnswerChange(newDragged.filter(Boolean));
  };

   const handleRemoveFromOrder = (item: string) => {
    if (showResult) return;
    const newDragged = draggedItems.filter(i => i !== item);
    const newAvailable = [...availableItems, item];
    setDraggedItems(newDragged);
    setAvailableItems(newAvailable);
    onAnswerChange(newDragged);
  };

  const handleResetDragDrop = () => {
    if (showResult) return;
    if (question.options) {
      setDraggedItems([]);
      setAvailableItems([...question.options]);
      onAnswerChange([]);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Question Text */}
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
            {question.text}
          </h2>
        </div>

        {/* MCQ Options */}
        {question.type === 'mcq' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = userAnswer === option;
              const isCorrect = question.correctAnswer === option;
              
              // Styling logic for Review Mode vs Normal Mode
              let borderClass = 'border-[var(--border-primary)]';
              let bgClass = '';
              let textColor = 'text-[var(--text-primary)]';
              let badgeBorder = 'border-[var(--border-hover)]';
              let badgeBg = '';

              if (showResult) {
                if (isCorrect) {
                  borderClass = 'border-green-500';
                  bgClass = 'bg-green-50 dark:bg-green-900/20';
                  textColor = 'text-green-700 dark:text-green-300';
                  badgeBorder = 'border-green-500';
                  badgeBg = 'bg-green-500';
                } else if (isSelected && !isCorrect) {
                  borderClass = 'border-red-500';
                  bgClass = 'bg-red-50 dark:bg-red-900/20';
                  textColor = 'text-red-700 dark:text-red-300';
                  badgeBorder = 'border-red-500';
                  badgeBg = 'bg-red-500';
                }
              } else {
                 if (isSelected) {
                    borderClass = 'border-[var(--accent-blue)]';
                    bgClass = 'bg-[var(--accent-blue)] text-white shadow-md shadow-blue-500/20';
                    textColor = 'text-white';
                    badgeBorder = 'border-white';
                    badgeBg = 'bg-white';
                 } else {
                    bgClass = 'hover:bg-[var(--bg-secondary)]';
                 }
              }

              return (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                    borderClass,
                    bgClass,
                    showResult && "cursor-default"
                  )}
                  onClick={() => handleAnswerSelect(option)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                         badgeBorder,
                         isSelected ? (showResult ? 'bg-transparent' : 'bg-white') : ''
                      )}>
                       {isSelected && !showResult && (
                           <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" />
                       )}
                       {showResult && isCorrect && <div className="w-2 h-2 rounded-full bg-green-500" />}
                       {showResult && isSelected && !isCorrect && <div className="w-2 h-2 rounded-full bg-red-500" />}
                    </div>
                    <span className={cn("text-sm font-medium", showResult ? textColor : (isSelected ? "text-blue-100" : "text-[var(--text-secondary)]"))}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className={cn("font-medium", textColor)}>{option}</span>
                    {showResult && isCorrect && <span className="ml-auto text-xs font-bold text-green-600">Correct Answer</span>}
                    {showResult && isSelected && !isCorrect && <span className="ml-auto text-xs font-bold text-red-600">Your Answer</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Yes/No Options */}
        {question.type === 'yes-no' && (
            <div className="flex space-x-4">
              {['Yes', 'No'].map((option) => {
                const isSelected = userAnswer === option;
                const isCorrect = question.correctAnswer === option;

                 // Styling logic for Review Mode
                let borderClass = 'border-[var(--border-primary)]';
                let bgClass = '';
                let textColor = 'text-[var(--text-primary)]';

                if (showResult) {
                    if (isCorrect) {
                         borderClass = 'border-green-500';
                         bgClass = 'bg-green-50 dark:bg-green-900/20';
                         textColor = 'text-green-700 dark:text-green-300';
                    } else if (isSelected && !isCorrect) {
                         borderClass = 'border-red-500';
                         bgClass = 'bg-red-50 dark:bg-red-900/20';
                         textColor = 'text-red-700 dark:text-red-300';
                    }
                } else if (isSelected) {
                     borderClass = 'border-[var(--accent-blue)]';
                     bgClass = 'bg-[var(--accent-blue)] shadow-md shadow-blue-500/20';
                     textColor = 'text-white';
                } else {
                     bgClass = 'hover:bg-[var(--bg-secondary)]';
                }

                return (
                  <div
                    key={option}
                    className={cn(
                      "flex-1 p-4 rounded-lg border cursor-pointer transition-all duration-200",
                      borderClass,
                      bgClass,
                      showResult && "cursor-default"
                    )}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        showResult && isCorrect ? 'border-green-500' : (isSelected ? 'border-white bg-white' : 'border-[var(--border-hover)]')
                      )}>
                         {isSelected && !showResult && <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" />}
                         {showResult && isCorrect && <div className="w-2 h-2 rounded-full bg-green-500" />}
                      </div>
                      <span className={cn("font-medium", textColor)}>{option}</span>
                    </div>
                  </div>
                );
              })}
            </div>
        )}

        {/* Drag & Drop (Simplified View for now, full logic above) */}
        {question.type === 'drag-drop' && question.options && (
             <div className="space-y-6">
                 {/* Implementation similar to original but with read-only state if showResult is true */}
                 {!showResult && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                             <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-[var(--text-primary)]">Available Options</h4>
                                <Button variant="ghost" size="sm" onClick={handleResetDragDrop}><RotateCcw className="h-4 w-4 mr-2"/>Reset</Button>
                             </div>
                             <div className="min-h-[200px] p-4 border-2 border-dashed rounded-lg bg-[var(--bg-secondary)]" onDragOver={handleDragOver} onDrop={handleDropToAvailable}>
                                {availableItems.map((item, i) => (
                                    <div key={i} draggable onDragStart={(e) => handleDragStart(e, item)} className="p-3 bg-[var(--bg-card)] rounded-lg border mb-2 cursor-move">{item}</div>
                                ))}
                             </div>
                        </div>
                        <div>
                             <h4 className="font-semibold text-[var(--text-primary)] mb-4">Your Anwer</h4>
                             <div className="space-y-2">
                                {draggedItems.map((item, i) => (
                                    <div key={i} className="p-3 border rounded bg-[var(--bg-card)] flex justify-between">
                                        <span>{i+1}. {item}</span>
                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveFromOrder(item)}>×</Button>
                                    </div>
                                ))}
                                {draggedItems.length < question.options.length && (
                                     <div className="p-3 border-2 border-dashed rounded text-center text-gray-400">Drop here</div>
                                )}
                             </div>
                        </div>
                    </div>
                 )}
                 
                 {showResult && (
                     <div className="space-y-4">
                         <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                             <h4 className="font-semibold text-red-700 mb-2">Your Answer:</h4>
                             <ol className="list-decimal list-inside text-red-700">
                                 {(userAnswer as string[])?.map((item, i) => <li key={i}>{item}</li>)}
                             </ol>
                         </div>
                          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                             <h4 className="font-semibold text-green-700 mb-2">Correct Answer:</h4>
                             {/* Assuming drag-drop correct answer is the original order of options or specific correct answer field */}
                             <ol className="list-decimal list-inside text-green-700">
                                  {(question.correctAnswer as string[] || question.options).map((item, i) => <li key={i}>{item}</li>)}
                             </ol>
                         </div>
                     </div>
                 )}
             </div>
        )}
      </div>
    </Card>
  );
}
