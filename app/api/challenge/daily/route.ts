import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { serverError } from '@/lib/api-response';

export async function GET() {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const prompt = await prisma.dailyPrompt.findFirst({
      where: {
        date: {
          gte: start,
          lt: end
        }
      },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(prompt);
  } catch {
    return serverError();
  }
}
