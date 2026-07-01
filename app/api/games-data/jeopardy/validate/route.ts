import { jeopardyService } from '@/lib/services/jeopardy-service';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const validateSchema = z.object({
  questionId: z.string(),
  userAnswer: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = validateSchema.parse(await request.json());

    const question = await jeopardyService.getQuestionById(body.questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    const correct = jeopardyService.validateAnswer(body.userAnswer, question.answer);

    return NextResponse.json({ correct, answer: question.answer });
  } catch (error) {
    console.error('Failed to validate Jeopardy answer:', error);
    return NextResponse.json({ error: 'Failed to validate answer' }, { status: 500 });
  }
}
