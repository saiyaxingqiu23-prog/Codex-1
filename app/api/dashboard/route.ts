import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUserId } from '@/lib/current-user';
import { serverError, unauthorized } from '@/lib/api-response';

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return unauthorized();
    }

    const [totalSubmissions, avgScores, topErrors] = await Promise.all([
      prisma.challengeSubmission.count({ where: { userId } }),
      prisma.challengeSubmission.aggregate({
        where: { userId },
        _avg: {
          grammarScore: true,
          naturalnessScore: true,
          nativeLikenessScore: true
        }
      }),
      prisma.errorLog.findMany({ where: { userId }, orderBy: { count: 'desc' }, take: 5 })
    ]);

    return NextResponse.json({ totalSubmissions, avgScores: avgScores._avg, topErrors });
  } catch {
    return serverError();
  }
}
