import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { QuizSessionRepository } from '../../../domain/repositories/QuizSessionRepository';
import { QuizSession } from '../../../domain/entities/QuizSession';

@injectable()
export class QuizSessionPrismaRepository implements QuizSessionRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async createSession(data: Omit<QuizSession, 'id' | 'createdAt' | 'updatedAt' | 'questionsAnswered' | 'questionsCorrect' | 'pointsEarned' | 'percentageScore'>): Promise<QuizSession> {
    return this.prisma.quizSession.create({
      data: {
        userId: data.userId,
        quizId: data.quizId,
        sessionToken: data.sessionToken,
        questionsTotal: data.questionsTotal,
        status: data.status,
        startedAt: data.startedAt
      }
    });
  }

  async getSessionById(id: string): Promise<QuizSession | null> {
    return this.prisma.quizSession.findUnique({
      where: { id }
    });
  }

  async getSessionByToken(token: string): Promise<QuizSession | null> {
    return this.prisma.quizSession.findUnique({
      where: { sessionToken: token }
    });
  }

  async getUserSessions(userId: string): Promise<QuizSession[]> {
    return this.prisma.quizSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateSession(id: string, data: Partial<QuizSession>): Promise<QuizSession> {
    return this.prisma.quizSession.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async completeSession(id: string, data: { 
    questionsAnswered: number, 
    questionsCorrect: number, 
    pointsEarned: number, 
    percentageScore: number,
    timeTakenSeconds?: number,
    passed?: boolean
  }): Promise<QuizSession> {
    return this.prisma.quizSession.update({
      where: { id },
      data: {
        questionsAnswered: data.questionsAnswered,
        questionsCorrect: data.questionsCorrect,
        pointsEarned: data.pointsEarned,
        percentageScore: data.percentageScore,
        timeTakenSeconds: data.timeTakenSeconds,
        passed: data.passed,
        status: 'completed',
        completedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async getSessionsByQuizId(quizId: string): Promise<QuizSession[]> {
    return this.prisma.quizSession.findMany({
      where: { quizId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getActiveSessionsByUserId(userId: string): Promise<QuizSession[]> {
    return this.prisma.quizSession.findMany({
      where: { 
        userId,
        status: 'started'
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCompletedSessionsByUserId(userId: string): Promise<QuizSession[]> {
    return this.prisma.quizSession.findMany({
      where: { 
        userId,
        status: 'completed'
      },
      orderBy: { completedAt: 'desc' }
    });
  }
}