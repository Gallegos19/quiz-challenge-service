import { QuizSession } from '../entities/QuizSession';

export abstract class QuizSessionRepository {
  abstract createSession(data: Omit<QuizSession, 'id' | 'createdAt' | 'updatedAt' | 'questionsAnswered' | 'questionsCorrect' | 'pointsEarned' | 'percentageScore'>): Promise<QuizSession>;
  abstract getSessionById(id: string): Promise<QuizSession | null>;
  abstract getSessionByToken(token: string): Promise<QuizSession | null>;
  abstract getUserSessions(userId: string): Promise<QuizSession[]>;
  abstract updateSession(id: string, data: Partial<QuizSession>): Promise<QuizSession>;
  abstract completeSession(id: string, data: { 
    questionsAnswered: number, 
    questionsCorrect: number, 
    pointsEarned: number, 
    percentageScore: number,
    timeTakenSeconds?: number,
    passed?: boolean
  }): Promise<QuizSession>;
  abstract getSessionsByQuizId(quizId: string): Promise<QuizSession[]>;
  abstract getActiveSessionsByUserId(userId: string): Promise<QuizSession[]>;
  abstract getCompletedSessionsByUserId(userId: string): Promise<QuizSession[]>;
}