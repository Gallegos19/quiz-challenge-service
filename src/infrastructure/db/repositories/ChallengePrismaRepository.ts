import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { ChallengeRepository } from '../../../domain/repositories/ChallengeRepository';
import { Challenge } from '../../../domain/entities/Challenge';

@injectable()
export class ChallengePrismaRepository implements ChallengeRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async getActiveChallenge(): Promise<Challenge[]> {
    const now = new Date();
    
    return this.prisma.challenge.findMany({
      where: {
        deletedAt: null,
        OR: [
          {
            // Challenges with specific dates that are currently active
            startDate: { lte: now },
            endDate: { gte: now }
          },
          {
            // Challenges without end date
            startDate: { lte: now },
            endDate: null
          },
          {
            // Challenges without specific dates
            startDate: null,
            endDate: null
          }
        ]
      },
      orderBy: [
        { featuredUntil: 'desc' },
        { createdAt: 'desc' }
      ]
    });
  }

  async getChallengeById(id: string): Promise<Challenge | null> {
    return this.prisma.challenge.findUnique({
      where: { id, deletedAt: null }
    });
  }

  async createChallenge(data: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge> {
    return this.prisma.challenge.create({
      data: {
        title: data.title,
        description: data.description,
        instructions: data.instructions,
        category: data.category,
        difficulty: data.difficulty,
        pointsReward: data.pointsReward,
        estimatedDurationDays: data.estimatedDurationDays,
        validationType: data.validationType,
        validationCriteria: data.validationCriteria,
        maxParticipants: data.maxParticipants,
        currentParticipants: data.currentParticipants,
        startDate: data.startDate,
        endDate: data.endDate,
        isRecurring: data.isRecurring,
        recurrencePattern: data.recurrencePattern,
        ageRestrictions: data.ageRestrictions,
        featuredUntil: data.featuredUntil,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        deletedAt: data.deletedAt
      }
    });
  }

  async updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge> {
    return this.prisma.challenge.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async deleteChallenge(id: string): Promise<void> {
    await this.prisma.challenge.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async incrementParticipants(id: string): Promise<Challenge> {
    return this.prisma.challenge.update({
      where: { id },
      data: { 
        currentParticipants: {
          increment: 1
        },
        updatedAt: new Date()
      }
    });
  }

  async decrementParticipants(id: string): Promise<Challenge> {
    return this.prisma.challenge.update({
      where: { id },
      data: { 
        currentParticipants: {
          decrement: 1
        },
        updatedAt: new Date()
      }
    });
  }

  async getChallengesByCategory(category: string): Promise<Challenge[]> {
    return this.prisma.challenge.findMany({
      where: { 
        category,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getFeaturedChallenges(): Promise<Challenge[]> {
    const now = new Date();
    
    return this.prisma.challenge.findMany({
      where: { 
        featuredUntil: { gte: now },
        deletedAt: null
      },
      orderBy: { featuredUntil: 'asc' }
    });
  }

  async getAllChallenges(): Promise<Challenge[]> {
    return this.prisma.challenge.findMany({
      where: { 
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}