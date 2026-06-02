import { QuestionType } from '@/types';
import { z } from 'zod';

// Flat schema — avoids discriminated union issues with react-hook-form + Zod 4
export const questionFormSchema = z.object({
  type: z.enum(['mcq', 'multi-select', 'yes-no', 'true-false', 'fill-in-blank', 'drag-drop', 'matching', 'text']),
  text: z.string().min(5, 'Question text must be at least 5 characters'),
  imageUrl: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  moduleId: z.string().min(1, 'Please select a module'),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  solutionVideoUrl: z.string().optional(),
  solutionText: z.string().optional(),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean().optional(),
  })).optional(),
  correctAnswer: z.union([z.string(), z.array(z.any())]).optional(),
  matchingPairs: z.array(z.object({
    left: z.string(),
    right: z.string(),
  })).optional(),
  acceptableAnswers: z.array(z.string()).optional(),
  caseSensitive: z.boolean().optional(),
});

export type QuestionFormData = z.infer<typeof questionFormSchema>;

// Helper to get question type config
export const questionTypeConfig: Record<QuestionType, {
  label: string;
  description: string;
  icon: string;
  hasOptions: boolean;
  hasMatchingPairs: boolean;
}> = {
  'mcq': {
    label: 'Multiple Choice',
    description: 'Single correct answer from options',
    icon: '📝',
    hasOptions: true,
    hasMatchingPairs: false,
  },
  'multi-select': {
    label: 'Multi-Select',
    description: 'Multiple correct answers',
    icon: '✅',
    hasOptions: true,
    hasMatchingPairs: false,
  },
  'yes-no': {
    label: 'Yes / No',
    description: 'Simple yes or no question',
    icon: '❓',
    hasOptions: false,
    hasMatchingPairs: false,
  },
  'true-false': {
    label: 'True / False',
    description: 'Boolean logic question',
    icon: '⚖️',
    hasOptions: false,
    hasMatchingPairs: false,
  },
  'fill-in-blank': {
    label: 'Fill in the Blank',
    description: 'Short answer question',
    icon: '✍️',
    hasOptions: false,
    hasMatchingPairs: false,
  },
  'drag-drop': {
    label: 'Drag & Drop',
    description: 'Order items correctly',
    icon: '🔄',
    hasOptions: true,
    hasMatchingPairs: false,
  },
  'matching': {
    label: 'Matching',
    description: 'Pair items from two lists',
    icon: '🔗',
    hasOptions: false,
    hasMatchingPairs: true,
  },
  'text': {
    label: 'Text / Rich Text',
    description: 'Open-ended text answer',
    icon: '📄',
    hasOptions: false,
    hasMatchingPairs: false,
  },
};
