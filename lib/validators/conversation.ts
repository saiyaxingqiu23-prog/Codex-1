import { z } from 'zod';

export const startConversationSchema = z.object({
  role: z.enum(['interviewer', 'professor', 'friend', 'boss']),
  difficulty: z.enum(['easy', 'medium', 'hard'])
});

export const conversationMessageSchema = z.object({
  sessionId: z.string().min(1),
  message: z.string().min(1)
});
