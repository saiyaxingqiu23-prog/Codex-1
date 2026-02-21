import { z } from 'zod';

export const writingCorrectionSchema = z.object({
  text: z.string().min(20, 'Please provide at least 20 characters.')
});
