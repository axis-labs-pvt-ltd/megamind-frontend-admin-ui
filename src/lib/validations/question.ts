import { QuestionType } from '@/types';
import { z } from 'zod';

// Base question schema
const baseQuestionSchema = z.object({
  text: z.string().min(5, 'Question text must be at least 5 characters'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  moduleId: z.string().min(1, 'Please select a module'),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
  solutionVideoUrl: z.string().url().optional().or(z.literal('')),
});

// Option Schema
const questionOptionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Option text cannot be empty'),
  isCorrect: z.boolean().optional(),
  media: z.object({
    type: z.enum(['image', 'video']),
    url: z.string().url(),
    altText: z.string().optional(),
  }).optional(),
});

// MCQ Schema
const mcqSchema = baseQuestionSchema.extend({
  type: z.literal('mcq'),
  options: z.array(questionOptionSchema).min(2, 'At least 2 options required'),
  correctAnswer: z.string().min(1, 'Please select a correct answer'),
});

// Multi-Select Schema
const multiSelectSchema = baseQuestionSchema.extend({
  type: z.literal('multi-select'),
  options: z.array(questionOptionSchema).min(2, 'At least 2 options required'),
  correctAnswer: z.array(z.string()).min(1, 'At least one correct answer required'),
});

// Yes-No Schema
const yesNoSchema = baseQuestionSchema.extend({
  type: z.literal('yes-no'),
  correctAnswer: z.enum(['Yes', 'No'], { message: 'Please select Yes or No' }),
});

// True-False Schema
const trueFalseSchema = baseQuestionSchema.extend({
  type: z.literal('true-false'),
  correctAnswer: z.enum(['True', 'False'], { message: 'Please select True or False' }),
});

// Fill in Blank Schema
const fillInBlankSchema = baseQuestionSchema.extend({
  type: z.literal('fill-in-blank'),
  correctAnswer: z.string().min(1, 'Please provide the correct answer'),
  acceptableAnswers: z.array(z.string()).optional(),
  caseSensitive: z.boolean().default(false),
});

// Drag-Drop Schema
const dragDropSchema = baseQuestionSchema.extend({
  type: z.literal('drag-drop'),
  options: z.array(questionOptionSchema).min(2, 'At least 2 options required'),
  correctAnswer: z.array(z.string()).min(2, 'Please set the correct order'),
});

// Text Schema
const textSchema = baseQuestionSchema.extend({
  type: z.literal('text'),
  correctAnswer: z.string().min(1, 'Please provide a model answer'),
});

// Matching Schema
const matchingPairSchema = z.object({
  left: z.string().min(1, 'Left item cannot be empty'),
  right: z.string().min(1, 'Right item cannot be empty'),
});

const matchingSchema = baseQuestionSchema.extend({
  type: z.literal('matching'),
  matchingPairs: z.array(matchingPairSchema).min(2, 'At least 2 pairs required'),
  correctAnswer: z.array(matchingPairSchema),
});

// Discriminated union for all question types
export const questionFormSchema = z.discriminatedUnion('type', [
  mcqSchema,
  multiSelectSchema,
  yesNoSchema,
  trueFalseSchema,
  fillInBlankSchema,
  dragDropSchema,
  matchingSchema,
  textSchema,
]);

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
