import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/current-user';
import { generateAssistantReply } from '@/lib/services/conversation-service';
import { badRequest, notFound, serverError, unauthorized } from '@/lib/api-response';
import { conversationMessageSchema } from '@/lib/validators/conversation';

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorized();
    }

    const payload = await request.json();
    const parsed = conversationMessageSchema.safeParse(payload);

    if (!parsed.success) {
      return badRequest('Invalid request payload', parsed.error.flatten());
    }

    const session = await prisma.conversationSession.findUnique({ where: { id: parsed.data.sessionId } });
    if (!session || session.userId !== userId) {
      return notFound('Session not found');
    }

    await prisma.conversationMessage.create({
      data: {
        sessionId: parsed.data.sessionId,
        role: 'user',
        content: parsed.data.message
      }
    });

    const reply = await generateAssistantReply(session.role, session.difficulty, parsed.data.message);

    const assistantMessage = await prisma.conversationMessage.create({
      data: {
        sessionId: parsed.data.sessionId,
        role: 'assistant',
        content: reply
      }
    });

    return NextResponse.json(assistantMessage);
  } catch {
    return serverError();
  }
}
