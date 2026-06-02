import * as z from 'zod';

const baseTestSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  description: z.string().optional(),
  timeLimit: z.number().min(5, { message: 'Time limit must be at least 5 minutes' }),
  passingScore: z.number().min(1).max(100),
  estimatedDuration: z.number().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()),
});

const staticTestSchema = baseTestSchema.extend({
  type: z.literal('static'),
  questions: z.array(z.string()).min(1, { message: 'Please select at least one question' }),
  dynamicRules: z.array(z.any()).optional(),
});

const dynamicTestSchema = baseTestSchema.extend({
  type: z.literal('dynamic'),
  questions: z.array(z.string()).optional(),
  dynamicRules: z.array(
    z.object({
      moduleId: z.string().min(1, { message: 'Module is required' }),
      questionCount: z.number().min(1, { message: 'At least 1 question required' }),
      difficulty: z.enum(['easy', 'medium', 'hard']),
    })
  ).min(1, { message: 'Add at least one rule' }),
});

export const createTestSchema = z.discriminatedUnion('type', [
  staticTestSchema,
  dynamicTestSchema,
]);

export type CreateTestValues = z.infer<typeof createTestSchema>;