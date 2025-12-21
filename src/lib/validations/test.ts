import * as z from 'zod';

export const dynamicRuleSchema = z.object({
  moduleId: z.string().min(1, { message: "Module is required" }),
  questionCount: z.number().min(1, { message: "At least 1 question required" }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export const createTestSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().optional(),
  type: z.enum(['static', 'dynamic']),
  timeLimit: z.number().min(5, { message: "Time limit must be at least 5 minutes" }),
  passingScore: z.number().min(1).max(100),
  estimatedDuration: z.number().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()),
  
  // Conditionally required based on type (handled in UI logic or refinement)
  questions: z.array(z.string()).optional(), 
  dynamicRules: z.array(dynamicRuleSchema).optional(),
}).refine((data) => {
  if (data.type === 'static') {
    return data.questions && data.questions.length > 0;
  }
  if (data.type === 'dynamic') {
    return data.dynamicRules && data.dynamicRules.length > 0;
  }
  return true;
}, {
  message: "Please add questions or rules based on test type",
  path: ["type"], // Attach error to type field or a general error
});

export type CreateTestValues = z.infer<typeof createTestSchema>;
