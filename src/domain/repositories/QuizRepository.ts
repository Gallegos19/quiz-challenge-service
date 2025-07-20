import { Quiz } from '../entities/Quiz';

export abstract class QuizRepository {
  abstract createQuiz(data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz>;
  abstract getQuizById(id: string): Promise<Quiz | null>;
  abstract getQuizzesByTopic(topicId: string): Promise<Quiz[]>;
  abstract updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz>;
  abstract deleteQuiz(id: string): Promise<void>;
  abstract publishQuiz(id: string): Promise<Quiz>;
  abstract unpublishQuiz(id: string): Promise<Quiz>;
  abstract getPublishedQuizzes(): Promise<Quiz[]>;
  abstract getQuizzesByDifficulty(difficultyLevel: string): Promise<Quiz[]>;
  abstract getQuizzesByAgeRange(minAge: number, maxAge: number): Promise<Quiz[]>;
}