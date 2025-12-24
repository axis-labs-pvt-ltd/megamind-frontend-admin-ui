import * as z from 'zod';

export const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  remember: z.boolean().optional(),
});

export type SignInValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  role: z.enum(['student', 'instructor']),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  accessCode: z.string().optional(),
}).refine((data) => {
  if (data.role === 'instructor' && !data.accessCode) {
    return false;
  }
  return true;
}, {
  message: "Access code is required for instructors",
  path: ["accessCode"],
});

export type SignUpValues = z.infer<typeof signUpSchema>;
