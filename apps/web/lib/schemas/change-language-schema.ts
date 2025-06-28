import { z } from 'zod';

export const changeLanguageSchema = z.object({
  language: z.string().min(1, 'Please select a language'),
});

export type ChangeLanguageFormValues = z.infer<typeof changeLanguageSchema>;
