import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/current-user';
import { badRequest, serverError, unauthorized } from '@/lib/api-response';
import { errorLogUpsertSchema } from '@/lib/validators/error-log';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorized();
    }

    const errors = await prisma.errorLog.findMany({ where: { userId }, orderBy: { count: 'desc' } });
    return NextResponse.json(errors);
  } catch {
    return serverError();
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorized();
    }

    const payload = await request.json();
    const parsed = errorLogUpsertSchema.safeParse(payload);
    if (!parsed.success) {
      return badRequest('Invalid request payload', parsed.error.flatten());
    }

    const saved = await prisma.errorLog.upsert({
      where: {
        userId_category_pattern: {
          userId,
          category: parsed.data.category,
          pattern: parsed.data.pattern
        }
      },
      update: {
        count: { increment: 1 },
        lastSeenAt: new Date(),
        explanation: parsed.data.explanation
      },
      create: {
        userId,
        category: parsed.data.category,
        pattern: parsed.data.pattern,
        explanation: parsed.data.explanation,
        count: 1
      }
    });

    return NextResponse.json(saved, { status: 201 });
  } catch {
    return serverError();
  }
}
