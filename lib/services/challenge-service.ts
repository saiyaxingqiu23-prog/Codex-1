import { z } from 'zod';
import { openai } from '@/lib/ai/openai';

const challengeScoreSchema = z.object({
  grammarScore: z.number().int().min(0).max(100),
  naturalnessScore: z.number().int().min(0).max(100),
  nativeLikenessScore: z.number().int().min(0).max(100),
  feedback: z.string()
});

export async function scoreChallenge(response: string) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      grammarScore: 75,
      naturalnessScore: 72,
      nativeLikenessScore: 70,
      feedback: 'Local mock scoring enabled. Configure OPENAI_API_KEY for real AI feedback.'
    };
  }

  const prompt = `Evaluate this learner response and return strict JSON: grammarScore, naturalnessScore, nativeLikenessScore, feedback. Scores must be integer 0-100.\nResponse: ${response}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }
  });

  const payload = JSON.parse(completion.choices[0].message.content ?? '{}');
  return challengeScoreSchema.parse(payload);
}
