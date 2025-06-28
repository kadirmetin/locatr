import { z } from 'zod';

export const getChangeEmailSchema = (currentEmail: string) =>
  z
    .object({
      newEmail: z.string().min(1, 'Email is required').email('Invalid email address'),
    })
    .refine((data) => data.newEmail !== currentEmail, {
      message: 'New email must be different from current email',
      path: ['newEmail'],
    });

export type ChangeEmailFormValues = z.infer<ReturnType<typeof getChangeEmailSchema>>;
