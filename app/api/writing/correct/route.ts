import { NextResponse } from 'next/server';
import { correctWriting } from '@/lib/services/writing-service';
import { badRequest, serverError } from '@/lib/api-response';
import { writingCorrectionSchema } from '@/lib/validators/writing';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = writingCorrectionSchema.safeParse(payload);

    if (!parsed.success) {
      return badRequest('Invalid request payload', parsed.error.flatten());
    }

    const result = await correctWriting(parsed.data.text);
    return NextResponse.json(result);
  } catch {
    return serverError('Unable to process writing correction request');
  }
}
