import z from 'zod';

export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general'], {
    required_error: 'Please select a feedback type.',
  }),
  subject: z
    .string()
    .min(5, 'Subject must be at least 5 characters.')
    .max(100, 'Subject must be less than 100 characters.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters.')
    .max(1000, 'Description must be less than 1000 characters.'),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;
