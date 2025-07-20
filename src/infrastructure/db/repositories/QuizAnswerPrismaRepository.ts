import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { QuizAnswerRepository } from '../../../domain/repositories/QuizAnswerRepository';
import { QuizAnswer } from '../../../domain/entities/QuizAnswer';

@injectable()
export class QuizAnswerPrismaRepository implements QuizAnswerRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async createAnswer(data: Omit<QuizAnswer, 'id' | 'createdAt' | 'answeredAt'>): Promise<QuizAnswer> {
    const now = new Date();
    return this.prisma.quizAnswer.create({
      data: {
        sessionId: data.sessionId,
        questionId: data.questionId,
        selectedOptionId: data.selectedOptionId,
        userAnswerText: data.userAnswerText,
        isCorrect: data.isCorrect,
        pointsEarned: data.pointsEarned,
        timeTakenSeconds: data.timeTakenSeconds,
        answerConfidence: data.answerConfidence,
        answeredAt: now
      }
    });
  }

  async getAnswerById(id: string): Promise<QuizAnswer | null> {
    return this.prisma.quizAnswer.findUnique({
      where: { id }
    });
  }

  async getAnswersBySessionId(sessionId: string): Promise<QuizAnswer[]> {
    return this.prisma.quizAnswer.findMany({
      where: { sessionId },
      orderBy: { answeredAt: 'asc' }
    });
  }
 
  async getAnswersByQuestionId(questionId: string): Promise<QuizAnswer[]> {
    return this.prisma.quizAnswer.findMany({
      where: { questionId },
      orderBy: { answeredAt: 'desc' }
    });
  }

  async getUserAnswersForQuestion(userId: string, questionId: string): Promise<QuizAnswer[]> {
    return this.prisma.quizAnswer.findMany({
      where: {
        questionId,
        session: {
          userId
        }
      },
      orderBy: { answeredAt: 'desc' },
      include: {
        session: true
      }
    });
  }

  async getCorrectAnswersCountBySessionId(sessionId: string): Promise<number> {
    const result = await this.prisma.quizAnswer.count({
      where: {
        sessionId,
        isCorrect: true
      }
    });
    return result;
  }

  async getTotalPointsEarnedBySessionId(sessionId: string): Promise<number> {
    const result = await this.prisma.quizAnswer.aggregate({
      where: {
        sessionId
      },
      _sum: {
        pointsEarned: true
      }
    });
    return result._sum.pointsEarned || 0;
  }
}