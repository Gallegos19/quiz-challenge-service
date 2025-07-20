import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { QuizRepository } from '../../../domain/repositories/QuizRepository';
import { Quiz } from '../../../domain/entities/Quiz';

@injectable()
export class QuizPrismaRepository implements QuizRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async createQuiz(data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
    return this.prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        topicId: data.topicId,
        difficultyLevel: data.difficultyLevel,
        targetAgeMin: data.targetAgeMin,
        targetAgeMax: data.targetAgeMax,
        timeLimitMinutes: data.timeLimitMinutes,
        questionsCount: data.questionsCount,
        passPercentage: data.passPercentage,
        maxAttempts: data.maxAttempts,
        pointsReward: data.pointsReward,
        requiresContentCompletion: data.requiresContentCompletion,
        requiredContentIds: data.requiredContentIds,
        isPublished: data.isPublished,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        deletedAt: data.deletedAt
      }
    });
  }

  async getQuizById(id: string): Promise<Quiz | null> {
    return this.prisma.quiz.findUnique({
      where: { id, deletedAt: null }
    });
  }

  async getQuizzesByTopic(topicId: string): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: { 
        topicId,
        deletedAt: null
        // Eliminamos el filtro isPublished: true para devolver todos los quizzes
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateQuiz(id: string, data: Partial<Quiz>): Promise<Quiz> {
    return this.prisma.quiz.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async deleteQuiz(id: string): Promise<void> {
    await this.prisma.quiz.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async publishQuiz(id: string): Promise<Quiz> {
    return this.prisma.quiz.update({
      where: { id },
      data: { 
        isPublished: true,
        updatedAt: new Date()
      }
    });
  }

  async unpublishQuiz(id: string): Promise<Quiz> {
    return this.prisma.quiz.update({
      where: { id },
      data: { 
        isPublished: false,
        updatedAt: new Date()
      }
    });
  }

  async getPublishedQuizzes(): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: { 
        isPublished: true,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getQuizzesByDifficulty(difficultyLevel: string): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: { 
        difficultyLevel,
        isPublished: true,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getQuizzesByAgeRange(minAge: number, maxAge: number): Promise<Quiz[]> {
    return this.prisma.quiz.findMany({
      where: { 
        targetAgeMin: { lte: minAge },
        targetAgeMax: { gte: maxAge },
        isPublished: true,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}