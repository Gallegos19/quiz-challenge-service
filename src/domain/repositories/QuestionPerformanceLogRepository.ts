import { QuestionPerformanceLog } from '../entities/QuestionPerformanceLog';

export abstract class QuestionPerformanceLogRepository {
  abstract createPerformanceLog(data: Omit<QuestionPerformanceLog, 'id' | 'createdAt'>): Promise<QuestionPerformanceLog>;
  abstract getPerformanceLogsByQuestionId(questionId: string): Promise<QuestionPerformanceLog[]>;
  abstract getPerformanceLogsByUserId(userId: string): Promise<QuestionPerformanceLog[]>;
  abstract getPerformanceLogsByQuestionAndUser(questionId: string, userId: string): Promise<QuestionPerformanceLog[]>;
  abstract getProblematicQuestions(incorrectRateThreshold: number): Promise<{ questionId: string, incorrectRate: number, avgTimeSeconds: number, totalAttempts: number }[]>;
}