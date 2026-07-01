import axios from 'axios';
import { fuzzyMatch } from '@/lib/fuzzy-match';
import { MOCK_JEOPARDY_QUESTIONS, MockJeopardy } from '@/lib/mock-data';

export interface JeopardyQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  value: number;
}

function mockToQuestion(mock: MockJeopardy): JeopardyQuestion {
  return { ...mock };
}

class JeopardyService {
  // jService.io - free, open Jeopardy question database
  async getRandomQuestion(): Promise<JeopardyQuestion> {
    try {
      const response = await axios.get('https://jservice.io/api/random?count=1', { timeout: 5000 });
      const question = response.data[0];

      return {
        id: String(question.id),
        question: question.question,
        answer: question.answer,
        category: question.category.title,
        difficulty: this.mapValueToDifficulty(question.value),
        value: question.value ?? 200,
      };
    } catch (error) {
      console.warn('jService.io unavailable, using mock question:', (error as Error).message);
      return mockToQuestion(MOCK_JEOPARDY_QUESTIONS[Math.floor(Math.random() * MOCK_JEOPARDY_QUESTIONS.length)]);
    }
  }

  async getQuestionsByCategory(category: string): Promise<JeopardyQuestion[]> {
    try {
      const response = await axios.get('https://jservice.io/api/clues', {
        params: { category },
        timeout: 5000,
      });

      const questions = response.data.map((q: any) => ({
        id: String(q.id),
        question: q.question,
        answer: q.answer,
        category: q.category.title,
        difficulty: this.mapValueToDifficulty(q.value),
        value: q.value ?? 200,
      }));

      if (questions.length > 0) return questions;
      throw new Error('No questions returned');
    } catch (error) {
      console.warn('jService.io unavailable, using mock questions:', (error as Error).message);
      const matches = MOCK_JEOPARDY_QUESTIONS.filter(
        (q) => q.category.toLowerCase() === category.toLowerCase()
      );
      return (matches.length > 0 ? matches : MOCK_JEOPARDY_QUESTIONS).map(mockToQuestion);
    }
  }

  // Looks up a previously served question by id, checking mock data first.
  async getQuestionById(id: string): Promise<JeopardyQuestion | null> {
    const mock = MOCK_JEOPARDY_QUESTIONS.find((q) => q.id === id);
    if (mock) return mockToQuestion(mock);

    try {
      const response = await axios.get('https://jservice.io/api/clues', {
        params: { id },
        timeout: 5000,
      });
      const question = response.data[0];
      if (!question) return null;

      return {
        id: String(question.id),
        question: question.question,
        answer: question.answer,
        category: question.category.title,
        difficulty: this.mapValueToDifficulty(question.value),
        value: question.value ?? 200,
      };
    } catch (error) {
      console.warn('jService.io unavailable for lookup:', (error as Error).message);
      return null;
    }
  }

  private mapValueToDifficulty(value: number): 'easy' | 'medium' | 'hard' {
    if (value <= 200) return 'easy';
    if (value <= 600) return 'medium';
    return 'hard';
  }

  validateAnswer(userAnswer: string, correctAnswer: string): boolean {
    return fuzzyMatch(userAnswer, correctAnswer);
  }
}

export const jeopardyService = new JeopardyService();
