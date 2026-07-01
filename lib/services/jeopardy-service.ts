import axios from 'axios';
import { fuzzyMatch } from '@/lib/fuzzy-match';

export interface JeopardyQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  value: number;
}

class JeopardyService {
  // jService.io - free, open Jeopardy question database
  async getRandomQuestion(): Promise<JeopardyQuestion> {
    const response = await axios.get('https://jservice.io/api/random?count=1');
    const question = response.data[0];

    return {
      id: String(question.id),
      question: question.question,
      answer: question.answer,
      category: question.category.title,
      difficulty: this.mapValueToDifficulty(question.value),
      value: question.value ?? 200,
    };
  }

  async getQuestionsByCategory(category: string): Promise<JeopardyQuestion[]> {
    const response = await axios.get('https://jservice.io/api/clues', {
      params: { category },
    });

    return response.data.map((q: any) => ({
      id: String(q.id),
      question: q.question,
      answer: q.answer,
      category: q.category.title,
      difficulty: this.mapValueToDifficulty(q.value),
      value: q.value ?? 200,
    }));
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
