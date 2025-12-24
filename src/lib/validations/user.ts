import * as z from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email().optional(), // Often read-only
  role: z.string().optional(), // Read-only
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters" }).optional(),
});

export type ProfileValues = z.infer<typeof profileSchema>;

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

export type NotificationSettingsValues = z.infer<typeof notificationSettingsSchema>;
