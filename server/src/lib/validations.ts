import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[!@#$%^&*]/, "Password must contain at least one special character (!@#$%^&*)");

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(50),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: passwordSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const addToDeckSchema = z.object({
  character: z.string().length(1, "Character must be a single kanji"),
});

export const reviewSchema = z.object({
  character: z.string().length(1, "Character must be a single kanji"),
  quality: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(5)]),
  sessionStartTime: z.string().optional(),
});

export const updatePreferencesSchema = z.object({
  dailyGoal: z.number().min(5).max(100).optional(),
  newCardsPerDay: z.number().min(1).max(50).optional(),
  studyMode: z.enum(["flashcard", "quiz", "mixed"]).optional(),
  jlptTarget: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
  timezone: z.string().optional(),
  displayName: z.string().min(2).max(50).optional(),
});
