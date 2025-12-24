'use client';

import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { Question } from '@/types';

interface TextQuestionProps {
  question: Question;
  userAnswer: string | undefined;
  onAnswerChange: (answer: string) => void;
  showResult?: boolean;
}

export function TextQuestion({
  question,
  userAnswer,
  onAnswerChange,
  showResult = false,
}: TextQuestionProps) {
  return (
    <div className="space-y-4">
        <TiptapEditor
            value={userAnswer || ''}
            onChange={(val) => onAnswerChange(val)}
            disabled={showResult}
        />
        {showResult && (
            <div className="mt-4 p-4 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Model Answer</h4>
                <div dangerouslySetInnerHTML={{__html: question.correctAnswer as string}} className="prose prose-sm text-blue-800 dark:text-blue-200" />
            </div>
        )}
    </div>
  );
}
