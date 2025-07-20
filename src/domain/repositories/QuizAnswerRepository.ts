import { QuizAnswer } from '../entities/QuizAnswer';

export abstract class QuizAnswerRepository {
  abstract createAnswer(data: Omit<QuizAnswer, 'id' | 'createdAt' | 'answeredAt'>): Promise<QuizAnswer>;
  abstract getAnswerById(id: string): Promise<QuizAnswer | null>;
  abstract getAnswersBySessionId(sessionId: string): Promise<QuizAnswer[]>;
  abstract getAnswersByQuestionId(questionId: string): Promise<QuizAnswer[]>;
  abstract getUserAnswersForQuestion(userId: string, questionId: string): Promise<QuizAnswer[]>;
  abstract getCorrectAnswersCountBySessionId(sessionId: string): Promise<number>;
  abstract getTotalPointsEarnedBySessionId(sessionId: string): Promise<number>;
}