import { z } from 'zod';

export const errorLogUpsertSchema = z.object({
  category: z.enum(['tense', 'article', 'preposition', 'word_choice']),
  pattern: z.string().min(1),
  explanation: z.string().min(1)
});
