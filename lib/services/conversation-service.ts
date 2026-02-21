import { openai } from '@/lib/ai/openai';

export async function generateAssistantReply(role: string, difficulty: string, message: string) {
  if (!process.env.OPENAI_API_KEY) {
    return `[Local mock ${role}/${difficulty}] I received: "${message}". Add OPENAI_API_KEY for real AI replies.`;
  }

  const prompt = `You are simulating a ${role} in American English.
Difficulty: ${difficulty}.
Respond in natural conversational English and keep it concise.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: message }
    ]
  });

  return completion.choices[0].message.content ?? '';
}
