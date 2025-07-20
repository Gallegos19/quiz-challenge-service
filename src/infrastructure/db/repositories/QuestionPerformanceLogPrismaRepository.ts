import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { QuestionPerformanceLogRepository } from '../../../domain/repositories/QuestionPerformanceLogRepository';
import { QuestionPerformanceLog } from '../../../domain/entities/QuestionPerformanceLog';

@injectable()
export class QuestionPerformanceLogPrismaRepository implements QuestionPerformanceLogRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async createPerformanceLog(data: Omit<QuestionPerformanceLog, 'id' | 'createdAt'>): Promise<QuestionPerformanceLog> {
    return this.prisma.questionPerformanceLog.create({
      data: {
        questionId: data.questionId,
        userId: data.userId,
        wasCorrect: data.wasCorrect,
        timeTakenSeconds: data.timeTakenSeconds,
        selectedOptionId: data.selectedOptionId,
        questionOrder: data.questionOrder,
        userFatigueLevel: data.userFatigueLevel,
        tookLongTime: data.tookLongTime,
        changedAnswer: data.changedAnswer
      }
    });
  }

  async getPerformanceLogsByQuestionId(questionId: string): Promise<QuestionPerformanceLog[]> {
    return this.prisma.questionPerformanceLog.findMany({
      where: { questionId }
    });
  }

  async getPerformanceLogsByUserId(userId: string): Promise<QuestionPerformanceLog[]> {
    return this.prisma.questionPerformanceLog.findMany({
      where: { userId }
    });
  }

  async getPerformanceLogsByQuestionAndUser(questionId: string, userId: string): Promise<QuestionPerformanceLog[]> {
    return this.prisma.questionPerformanceLog.findMany({
      where: { 
        questionId,
        userId
      }
    });
  }

  async getProblematicQuestions(incorrectRateThreshold: number): Promise<{ questionId: string, incorrectRate: number, avgTimeSeconds: number, totalAttempts: number }[]> {
    // This is a complex query that would be better handled with raw SQL or a stored procedure
    // For now, we'll implement a simpler version that gets all performance logs and processes them in memory
    
    // Get all question IDs with performance logs
    const questionIds = await this.prisma.questionPerformanceLog.findMany({
      select: {
        questionId: true
      },
      distinct: ['questionId']
    });
    
    const result: { questionId: string, incorrectRate: number, avgTimeSeconds: number, totalAttempts: number }[] = [];
    
    // For each question, calculate metrics
    for (const { questionId } of questionIds) {
      const logs = await this.getPerformanceLogsByQuestionId(questionId);
      
      if (logs.length === 0) continue;
      
      const totalAttempts = logs.length;
      const incorrectAttempts = logs.filter(log => !log.wasCorrect).length;
      const incorrectRate = incorrectAttempts / totalAttempts;
      
      const totalTime = logs.reduce((sum, log) => sum + log.timeTakenSeconds, 0);
      const avgTimeSeconds = totalTime / totalAttempts;
      
      if (incorrectRate >= incorrectRateThreshold) {
        result.push({
          questionId,
          incorrectRate,
          avgTimeSeconds,
          totalAttempts
        });
      }
    }
    
    // Sort by incorrect rate (highest first)
    return result.sort((a, b) => b.incorrectRate - a.incorrectRate);
  }
}