import { z } from 'zod';

export const challengeSubmissionSchema = z.object({
  promptId: z.string(),
  response: z.string().min(20)
});
