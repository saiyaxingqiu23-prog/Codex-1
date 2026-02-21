import { z } from 'zod';
import { openai } from '@/lib/ai/openai';

const correctionResultSchema = z.object({
  corrections: z.array(z.string()).default([]),
  explanations: z.array(z.string()).default([]),
  naturalVersion: z.string().default(''),
  advancedVersion: z.string().default('')
});

export async function correctWriting(text: string) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      corrections: ['This is a local mock correction because OPENAI_API_KEY is not configured.'],
      explanations: ['Set OPENAI_API_KEY in .env to use real AI correction output.'],
      naturalVersion: text,
      advancedVersion: text
    };
  }

  const prompt = `You are an American English coach for intermediate Chinese learners.
Return strict JSON with keys: corrections (string[]), explanations (string[]), naturalVersion (string), advancedVersion (string).
Text: ${text}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const payload = JSON.parse(completion.choices[0].message.content ?? '{}');
  return correctionResultSchema.parse(payload);
}
