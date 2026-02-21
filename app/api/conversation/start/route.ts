import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/current-user';
import { badRequest, serverError, unauthorized } from '@/lib/api-response';
import { startConversationSchema } from '@/lib/validators/conversation';

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorized();
    }

    const payload = await request.json();
    const parsed = startConversationSchema.safeParse(payload);

    if (!parsed.success) {
      return badRequest('Invalid request payload', parsed.error.flatten());
    }

    const session = await prisma.conversationSession.create({
      data: {
        role: parsed.data.role,
        difficulty: parsed.data.difficulty,
        userId
      }
    });

    return NextResponse.json(session);
  } catch {
    return serverError();
  }
}
