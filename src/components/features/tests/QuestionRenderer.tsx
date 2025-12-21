// Client Component - Question Renderer
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Question } from '@/types';
import { GripVertical, RotateCcw } from 'lucide-react';
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
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<number | null>(null);

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
    setDraggedItemId(item);
  };
  
  const handleDragEnd = () => {
    setDraggedItemId(null);
    setActiveDropZone(null);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDropZoneEnter = (index: number) => {
    if (draggedItemId) {
      setActiveDropZone(index);
    }
  };
  
  const handleDropZoneLeave = () => {
    setActiveDropZone(null);
  };
  
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
    setDraggedItemId(null); // Reset drag state
    setActiveDropZone(null); // Reset active zone
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
    setDraggedItemId(null); // Reset drag state
    setActiveDropZone(null); // Reset active zone
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
                             <div 
                               className="min-h-[100px] max-h-[500px] overflow-y-auto p-4 rounded-xl border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 space-y-2 transition-colors hover:border-[var(--accent-blue)]/30" 
                               onDragOver={handleDragOver} 
                               onDrop={handleDropToAvailable}
                             >
                                {availableItems.length === 0 ? (
                                  <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)] py-8 animate-in fade-in zoom-in duration-300">
                                    <span className="text-4xl mb-2 opacity-20">✨</span>
                                    <span className="text-sm font-medium opacity-60">All items placed</span>
                                  </div>
                                ) : (
                                  availableItems.map((item, i) => (
                                    <div 
                                      key={i} 
                                      draggable 
                                      onDragStart={(e) => handleDragStart(e, item)}
                                      onDragEnd={handleDragEnd}
                                      className={cn(
                                        "group p-3 rounded-lg border flex items-center gap-3 transition-all duration-200",
                                        draggedItemId === item 
                                          ? "border-dashed border-[var(--accent-blue)] bg-[var(--accent-blue)]/5 opacity-50 grayscale" 
                                          : "bg-[var(--bg-card)] border-[var(--border-primary)] hover:border-[var(--accent-blue)] hover:shadow-sm hover:translate-x-1"
                                      )}
                                    >
                                      <GripVertical className="h-5 w-5 text-[var(--text-secondary)]/50 group-hover:text-[var(--accent-blue)] transition-colors flex-shrink-0" />
                                      <span className="text-[var(--text-primary)] font-medium">{item}</span>
                                    </div>
                                  ))
                                )}
                             </div>
                        </div>
                        <div>
                             <h4 className="font-semibold text-[var(--text-primary)] mb-4">Your Answer</h4>
                             <div className="max-h-[500px] overflow-y-auto pr-2">
                                {/* Drop zone at the beginning */}
                                <div 
                                  className={cn(
                                    "rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center text-xs font-medium",
                                    draggedItemId 
                                      ? (activeDropZone === -1 
                                          ? "h-12 border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] my-2 opacity-100" 
                                          : "h-2 border-transparent bg-transparent my-0 opacity-0 hover:h-12 hover:border-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/5 hover:opacity-100") 
                                      : "h-0 border-transparent overflow-hidden my-0"
                                  )}
                                  onDragEnter={() => handleDropZoneEnter(-1)}
                                  onDragOver={handleDragOver}
                                  onDrop={(e) => handleDropToOrder(e, 0)}
                                >
                                  {draggedItemId && (activeDropZone === -1 ? "Drop here to insert at start" : "")}
                                </div>

                                {/* Render each dragged item with drop zone after it */}
                                {draggedItems.map((item, i) => (
                                  <React.Fragment key={i}>
                                    {/* The dragged item */}
                                    <div 
                                      draggable
                                      onDragStart={(e) => handleDragStart(e, item)} 
                                      onDragEnd={handleDragEnd}
                                      className={cn(
                                        "group p-3 border rounded-lg flex items-center gap-3 transition-all duration-200",
                                        draggedItemId === item 
                                          ? "border-dashed border-[var(--accent-blue)] bg-[var(--accent-blue)]/5 opacity-50 grayscale" 
                                          : "bg-[var(--bg-card)] border-[var(--border-primary)] hover:border-[var(--accent-blue)] hover:shadow-sm"
                                      )}
                                    >
                                      <GripVertical className="h-5 w-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] flex-shrink-0" />
                                      <span className="flex-1 text-[var(--text-primary)] font-medium">{i+1}. {item}</span>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleRemoveFromOrder(item)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-lg"
                                      >
                                        ×
                                      </Button>
                                    </div>
                                    
                                    {/* Drop zone after this item */}
                                    <div 
                                      className={cn(
                                        "rounded-lg border-2 border-dashed transition-all duration-200 flex items-center justify-center text-xs font-medium",
                                        draggedItemId 
                                          ? (activeDropZone === i 
                                              ? "h-12 border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] my-2 opacity-100" 
                                              : "h-2 border-transparent bg-transparent my-0 opacity-0 hover:h-12 hover:border-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/5 hover:opacity-100") 
                                          : "h-0 border-transparent overflow-hidden my-0"
                                      )}
                                      onDragEnter={() => handleDropZoneEnter(i)}
                                      onDragOver={handleDragOver}
                                      onDrop={(e) => handleDropToOrder(e, i + 1)}
                                    >
                                      {draggedItemId && (activeDropZone === i ? `Drop here to insert at position ${i + 2}` : "")}
                                    </div>
                                  </React.Fragment>
                                ))}

                                {/* Empty state when no items */}
                                {draggedItems.length === 0 && (
                                  <div 
                                    className={cn(
                                      "min-h-[140px] rounded-lg border-2 border-dashed transition-all flex items-center justify-center p-6",
                                      draggedItemId 
                                        ? "border-[var(--accent-blue)] bg-[var(--accent-blue)]/10" 
                                        : "border-[var(--border-primary)] bg-[var(--bg-secondary)]"
                                    )}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDropToOrder(e, 0)}
                                  >
                                    <span className={cn(
                                      "text-sm text-center",
                                      draggedItemId ? "text-[var(--accent-blue)] font-semibold" : "text-[var(--text-secondary)]"
                                    )}>
                                      {draggedItemId ? "Drop here to start ordering" : "Drag items here to order them"}
                                    </span>
                                  </div>
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
