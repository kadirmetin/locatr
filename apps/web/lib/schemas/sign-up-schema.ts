import { z } from 'zod';

export const SignUpFormSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name required' })
    .min(2, { message: 'First name is too short' })
    .trim(),
  lastName: z
    .string()
    .min(1, { message: 'Last name is required' })
    .min(2, { message: 'Last name is too short' })
    .trim(),
  email: z.string().email({ message: 'Please enter a valid email address' }).trim(),
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
});

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;
