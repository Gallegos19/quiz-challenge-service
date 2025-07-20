import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { QuizQuestionRepository } from '../../../domain/repositories/QuizQuestionRepository';
import { QuizQuestion } from '../../../domain/entities/QuizQuestion';
import { QuizOption } from '../../../domain/entities/QuizOption';

@injectable()
export class QuizQuestionPrismaRepository implements QuizQuestionRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async createQuestion(data: Omit<QuizQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<QuizQuestion> {
    return this.prisma.quizQuestion.create({
      data: {
        quizId: data.quizId,
        questionText: data.questionText,
        questionType: data.questionType,
        explanation: data.explanation,
        pointsValue: data.pointsValue,
        timeLimitSeconds: data.timeLimitSeconds,
        imageUrl: data.imageUrl,
        audioUrl: data.audioUrl,
        sortOrder: data.sortOrder,
        difficultyWeight: data.difficultyWeight,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        deletedAt: data.deletedAt
      }
    });
  }

  async getQuestionById(id: string): Promise<QuizQuestion | null> {
    return this.prisma.quizQuestion.findUnique({
      where: { id, deletedAt: null }
    });
  }

  async getQuestionsByQuizId(quizId: string): Promise<QuizQuestion[]> {
    return this.prisma.quizQuestion.findMany({
      where: { 
        quizId,
        deletedAt: null
      },
      orderBy: { sortOrder: 'asc' }
    });
  }

  async updateQuestion(id: string, data: Partial<QuizQuestion>): Promise<QuizQuestion> {
    // Create a new object with only the fields that are allowed in the Prisma schema
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (data.questionText !== undefined) updateData.questionText = data.questionText;
    if (data.questionType !== undefined) updateData.questionType = data.questionType;
    if (data.explanation !== undefined) updateData.explanation = data.explanation;
    if (data.pointsValue !== undefined) updateData.pointsValue = data.pointsValue;
    if (data.timeLimitSeconds !== undefined) updateData.timeLimitSeconds = data.timeLimitSeconds;
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.audioUrl !== undefined) updateData.audioUrl = data.audioUrl;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.difficultyWeight !== undefined) updateData.difficultyWeight = data.difficultyWeight;
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy;
    if (data.deletedAt !== undefined) updateData.deletedAt = data.deletedAt;
    
    return this.prisma.quizQuestion.update({
      where: { id },
      data: updateData
    });
  }

  async deleteQuestion(id: string): Promise<void> {
    await this.prisma.quizQuestion.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async getQuestionWithOptions(questionId: string): Promise<QuizQuestion | null> {
    const question = await this.prisma.quizQuestion.findUnique({
      where: { id: questionId, deletedAt: null }
    });

    if (!question) {
      return null;
    }

    const options = await this.prisma.quizOption.findMany({
      where: { questionId },
      orderBy: { sortOrder: 'asc' }
    });

    return {
      ...question,
      options
    };
  }

  async addOption(questionId: string, optionData: Omit<QuizOption, 'id' | 'questionId' | 'createdAt' | 'updatedAt'>): Promise<QuizOption> {
    return this.prisma.quizOption.create({
      data: {
        questionId,
        optionText: optionData.optionText,
        isCorrect: optionData.isCorrect,
        sortOrder: optionData.sortOrder,
        explanation: optionData.explanation
      }
    });
  }

  async updateOption(optionId: string, data: Partial<QuizOption>): Promise<QuizOption> {
    return this.prisma.quizOption.update({
      where: { id: optionId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async deleteOption(optionId: string): Promise<void> {
    await this.prisma.quizOption.delete({
      where: { id: optionId }
    });
  }

  async getOptionsByQuestionId(questionId: string): Promise<QuizOption[]> {
    return this.prisma.quizOption.findMany({
      where: { questionId },
      orderBy: { sortOrder: 'asc' }
    });
  }

  async getAllQuestions(): Promise<QuizQuestion[]> {
    return this.prisma.quizQuestion.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' }
    });
  }
}