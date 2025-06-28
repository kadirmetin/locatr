import { z } from 'zod';

export const ResetPasswordFormSchema = z.object({
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(100)
    .regex(/[A-Z]/, {
      message: 'Password must contain at least one uppercase letter',
    })
    .regex(/[a-z]/, {
      message: 'Password must contain at least one lowercase letter',
    })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  verificationCode: z.string().min(6),
});

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordFormSchema>;
