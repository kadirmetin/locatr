import { z } from 'zod';

export const SignInFormSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }).trim(),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export type SignInFormValues = z.infer<typeof SignInFormSchema>;
