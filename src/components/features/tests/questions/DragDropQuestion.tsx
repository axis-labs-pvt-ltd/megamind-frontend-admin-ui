'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Question } from '@/types';
import { RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DragDropQuestionProps {
  question: Question;
  userAnswer: string[] | undefined;
  onAnswerChange: (answer: string[]) => void;
  showResult?: boolean;
}

export function DragDropQuestion({
  question,
  userAnswer,
  onAnswerChange,
  showResult = false,
}: DragDropQuestionProps) {
  const [draggedItems, setDraggedItems] = useState<string[]>([]); // Array of IDs
  const [availableItems, setAvailableItems] = useState<string[]>([]); // Array of IDs
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<number | null>(null);

  // Initialize drag and drop state
  useEffect(() => {
    if (question.options) {
      if (Array.isArray(userAnswer) && userAnswer.length > 0) {
        setDraggedItems(userAnswer);
        const usedItems = new Set(userAnswer);
        setAvailableItems(question.options.filter(opt => !usedItems.has(opt.id)).map(opt => opt.id));
      } else {
        setDraggedItems([]);
        setAvailableItems(question.options.map(opt => opt.id));
      }
    }
  }, [question, userAnswer]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    if (showResult) return;
    e.dataTransfer.setData('text/plain', id);
    setDraggedItemId(id);
  };
  
  const handleDragEnd = () => {
    setDraggedItemId(null);
    setActiveDropZone(null);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  
  const handleDropZoneEnter = (index: number) => {
    if (draggedItemId) setActiveDropZone(index);
  };
  
  const handleDropToOrder = (e: React.DragEvent, targetIndex: number) => {
    if (showResult) return;
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;

    const newDragged = [...draggedItems];
    const newAvailable = [...availableItems];
    
    const availIdx = newAvailable.indexOf(id);
    if (availIdx > -1) newAvailable.splice(availIdx, 1);
    
    const dragIdx = newDragged.indexOf(id);
    if (dragIdx > -1) newDragged.splice(dragIdx, 1);
    
    newDragged.splice(targetIndex, 0, id);
    
    setDraggedItems(newDragged);
    setAvailableItems(newAvailable);
    setDraggedItemId(null);
    setActiveDropZone(null);
    onAnswerChange(newDragged);
  };

  const handleDropToAvailable = (e: React.DragEvent) => {
    if (showResult) return;
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;

    const newDragged = [...draggedItems];
    const newAvailable = [...availableItems];

    const dragIdx = newDragged.indexOf(id);
    if (dragIdx > -1) {
      newDragged.splice(dragIdx, 1);
      if (!newAvailable.includes(id)) newAvailable.push(id);
    }

    setDraggedItems(newDragged);
    setAvailableItems(newAvailable);
    setDraggedItemId(null);
    setActiveDropZone(null);
    onAnswerChange(newDragged);
  };

  const handleResetDragDrop = () => {
     if (showResult) return;
     if (question.options) {
         setDraggedItems([]);
         setAvailableItems(question.options.map(o => o.id));
         onAnswerChange([]);
     }
  };

  return (
    <div className="space-y-6">
        {!showResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Items */}
            <div>
                    <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-[var(--text-primary)]">Available Options</h4>
                    <Button variant="ghost" size="sm" onClick={handleResetDragDrop}><RotateCcw className="h-4 w-4 mr-2"/>Reset</Button>
                    </div>
                    <div 
                    className="min-h-[100px] p-4 rounded-xl border-2 border-dashed border-[var(--border-primary)] bg-[var(--bg-secondary)]/30 space-y-2"
                    onDragOver={handleDragOver} 
                    onDrop={handleDropToAvailable}
                    >
                    {availableItems.map((id) => {
                        const option = question.options!.find(o => o.id === id);
                        if (!option) return null;
                        return (
                            <div 
                            key={id} 
                            draggable 
                            onDragStart={(e) => handleDragStart(e, id)}
                            onDragEnd={handleDragEnd}
                            className="p-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg cursor-grab active:cursor-grabbing hover:border-[var(--accent-blue)]"
                            >
                                {option.text}
                            </div>
                        )
                    })}
                    </div>
            </div>

            {/* Order Zone */}
            <div>
                    <h4 className="font-semibold text-[var(--text-primary)] mb-4">Your Answer</h4>
                    <div className="space-y-2">
                    {/* Initial Drop Zone */}
                    <div 
                        className={cn("h-2 transition-all", draggedItemId && "h-12 border-2 border-dashed border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 rounded-lg")}
                        onDragEnter={() => handleDropZoneEnter(-1)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDropToOrder(e, 0)}
                    />

                    {draggedItems.map((id, index) => {
                            const option = question.options!.find(o => o.id === id);
                        if (!option) return null;
                        return (
                            <React.Fragment key={id}>
                                <div 
                                draggable
                                onDragStart={(e) => handleDragStart(e, id)}
                                onDragEnd={handleDragEnd}
                                className="p-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg flex gap-3 items-center"
                                >
                                    <span className="text-[var(--text-secondary)] font-mono text-sm">{index + 1}.</span>
                                    {option.text}
                                </div>
                                    <div 
                                    className={cn("h-2 transition-all", draggedItemId && "h-12 border-2 border-dashed border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 rounded-lg")}
                                    onDragEnter={() => handleDropZoneEnter(index)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDropToOrder(e, index + 1)}
                                    />
                            </React.Fragment>
                        )
                    })}
                    </div>
            </div>
            </div>
        )}
        
        {showResult && (
            <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="text-red-800 font-semibold mb-2">Your Answer</h4>
                        <ol className="list-decimal list-inside text-red-700">
                            {userAnswer?.map(id => {
                                const opt = question.options?.find(o => o.id === id);
                                return <li key={id}>{opt?.text || id}</li>
                            })}
                        </ol>
                    </div>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="text-green-800 font-semibold mb-2">Correct Order</h4>
                        <ol className="list-decimal list-inside text-green-700">
                            {(question.correctAnswer as string[])?.map(id => {
                                    const opt = question.options?.find(o => o.id === id);
                                    return <li key={id}>{opt?.text || id}</li>
                            })}
                        </ol>
                    </div>
            </div>
        )}
    </div>
  );
}
