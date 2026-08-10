import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(20).max(5_000),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
