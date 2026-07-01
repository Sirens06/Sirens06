import { jeopardyService } from '@/lib/services/jeopardy-service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const question = category
      ? (await jeopardyService.getQuestionsByCategory(category))[0]
      : await jeopardyService.getRandomQuestion();

    if (!question) {
      return NextResponse.json({ error: 'No question found' }, { status: 404 });
    }

    // Withhold the answer from the client until validation
    const { answer: _answer, ...publicQuestion } = question;
    return NextResponse.json(publicQuestion);
  } catch (error) {
    console.error('Failed to fetch Jeopardy question:', error);
    return NextResponse.json({ error: 'Failed to fetch question' }, { status: 500 });
  }
}
