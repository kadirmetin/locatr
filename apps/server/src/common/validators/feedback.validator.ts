import { z } from "zod";

export const createFeedbackSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email().min(1),
  feedback: z.object({
    type: z.enum(["bug", "feature", "general"]),
    subject: z.string().min(1),
    description: z.string().min(1),
  }),
});
