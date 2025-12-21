'use client';

import { cn } from '@/lib/utils';
import { Question } from '@/types';

interface MCQQuestionProps {
  question: Question;
  userAnswer: string | string[] | undefined;
  onAnswerChange: (answer: string | string[]) => void;
  showResult?: boolean;
}

export function MCQQuestion({
  question,
  userAnswer,
  onAnswerChange,
  showResult = false,
}: MCQQuestionProps) {
    if (!question.options) return null;

    const handleAnswerSelect = (optionId: string) => {
        if (showResult) return;
        
        if (question.type === 'multi-select') {
            const currentAnswers = Array.isArray(userAnswer) ? [...userAnswer] : [];
            if (currentAnswers.includes(optionId)) {
                onAnswerChange(currentAnswers.filter(id => id !== optionId));
            } else {
                onAnswerChange([...currentAnswers, optionId]);
            }
        } else {
            onAnswerChange(optionId);
        }
    };

    return (
        <div className={cn("grid gap-3", question.options.some(o => o.media) ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
        {question.options.map((option) => {
            const isSelected = Array.isArray(userAnswer) 
            ? userAnswer.includes(option.id) 
            : userAnswer === option.id;

            const isCorrectTarget = Array.isArray(question.correctAnswer) 
                ? (question.correctAnswer as string[]).includes(option.id)
                : question.correctAnswer === option.id;

            // Styling logic
            let borderClass = 'border-[var(--border-primary)]';
            let bgClass = '';
            let textColor = 'text-[var(--text-primary)]';
            
            if (showResult) {
            if (isCorrectTarget) {
                borderClass = 'border-green-500 bg-green-50 dark:bg-green-900/20';
            } else if (isSelected && !isCorrectTarget) {
                borderClass = 'border-red-500 bg-red-50 dark:bg-red-900/20';
            }
            } else if (isSelected) {
                borderClass = 'border-[var(--accent-blue)]';
                bgClass = 'bg-[var(--accent-blue)]/5'; 
            } else {
                bgClass = 'hover:bg-[var(--bg-secondary)]';
            }

            return (
            <div
                key={option.id}
                className={cn(
                "relative p-4 rounded-lg border cursor-pointer transition-all duration-200 flex flex-col gap-2",
                borderClass,
                bgClass,
                showResult && "cursor-default"
                )}
                onClick={() => handleAnswerSelect(option.id)}
            >
                {/* Media Content */}
                {option.media && (
                    <div className="w-full aspect-video rounded-md overflow-hidden bg-black/5 mb-2">
                            {option.media.type === 'image' ? (
                                <img src={option.media.url} alt={option.media.altText || 'Option Image'} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">Video Placeholder</div>
                            )}
                    </div>
                )}

                <div className="flex items-start space-x-3">
                {/* Indicator Box/Circle */}
                <div className={cn(
                    "w-5 h-5 mt-0.5 rounded flex-shrink-0 border flex items-center justify-center transition-colors",
                        question.type === 'multi-select' ? "rounded-md" : "rounded-full",
                        isSelected ? "bg-[var(--accent-blue)] border-[var(--accent-blue)]" : "border-[var(--border-hover)] bg-white",
                        showResult && isCorrectTarget && "bg-green-500 border-green-500",
                        showResult && isSelected && !isCorrectTarget && "bg-red-500 border-red-500"
                    )}>
                    {isSelected && !showResult && <div className="w-2 h-2 bg-white rounded-full" />}
                    {showResult && isCorrectTarget && <span className="text-white text-xs">✓</span>}
                    {showResult && isSelected && !isCorrectTarget && <span className="text-white text-xs">✕</span>}
                </div>

                <div className="flex-1">
                        <span className={cn("text-base font-medium", textColor)}>{option.text}</span>
                </div>
                </div>
            </div>
            );
        })}
        </div>
    );
}
