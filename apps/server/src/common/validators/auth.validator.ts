import { z } from "zod";

export const emailSchema = z.string().trim().email().min(1).max(255);
export const passwordSchema = z.string().trim().min(8).max(100);
export const verificationCodeSchema = z.string().trim().min(1).max(25);

export const registerSchema = z.object({
  firstName: z.string().trim().min(2).max(50),
  lastName: z.string().trim().min(2).max(50),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.string().email().min(1),
  password: z.string().min(1),
  userAgent: z.string().optional(),
  ip: z.string().optional(),
  clientApp: z.string(),
  deviceId: z.string().optional(),
});

export const resendVerificationCodeSchema = z.object({
  email: emailSchema,
});

export const verificationEmailSchema = z.object({
  code: verificationCodeSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});
