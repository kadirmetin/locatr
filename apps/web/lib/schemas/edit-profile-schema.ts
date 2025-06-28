import { z } from 'zod';

export const editProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  bio: z.string().optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
