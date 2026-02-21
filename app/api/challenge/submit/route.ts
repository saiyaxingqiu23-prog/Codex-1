import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/current-user';
import { scoreChallenge } from '@/lib/services/challenge-service';
import { badRequest, notFound, serverError, unauthorized } from '@/lib/api-response';
import { challengeSubmissionSchema } from '@/lib/validators/challenge';

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorized();
    }

    const payload = await request.json();
    const parsed = challengeSubmissionSchema.safeParse(payload);

    if (!parsed.success) {
      return badRequest('Invalid request payload', parsed.error.flatten());
    }

    const prompt = await prisma.dailyPrompt.findUnique({ where: { id: parsed.data.promptId } });
    if (!prompt) {
      return notFound('Daily prompt not found');
    }

    const scores = await scoreChallenge(parsed.data.response);
    const record = await prisma.challengeSubmission.create({
      data: {
        userId,
        promptId: parsed.data.promptId,
        response: parsed.data.response,
        grammarScore: scores.grammarScore,
        naturalnessScore: scores.naturalnessScore,
        nativeLikenessScore: scores.nativeLikenessScore,
        feedback: scores.feedback
      }
    });

    return NextResponse.json(record, { status: 201 });
  } catch {
    return serverError();
  }
}
