import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { UserChallengeRepository } from '../../../domain/repositories/UserChallengeRepository';
import { UserChallenge } from '../../../domain/entities/UserChallenge';
import { validate as uuidValidate } from 'uuid';

@injectable()
export class UserChallengePrismaRepository implements UserChallengeRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  private validateUuid(id: string, fieldName: string): void {
    if (!uuidValidate(id)) {
      throw new Error(`Invalid ${fieldName} format: ${id}. Must be a valid UUID.`);
    }
  }

  async joinChallenge(userId: string, challengeId: string): Promise<UserChallenge> {
    this.validateUuid(userId, 'userId');
    this.validateUuid(challengeId, 'challengeId');
    
    return this.prisma.userChallenge.create({
      data: {
        userId,
        challengeId,
        status: 'joined'
      }
    });
  }

  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    this.validateUuid(userId, 'userId');
    return this.prisma.userChallenge.findMany({
      where: { userId },
      orderBy: { joinedAt: 'desc' }
    });
  }

  async getUserChallengeById(id: string): Promise<UserChallenge | null> {
    this.validateUuid(id, 'id');
    return this.prisma.userChallenge.findUnique({
      where: { id }
    });
  }

  async getUserChallengeByUserAndChallenge(userId: string, challengeId: string): Promise<UserChallenge | null> {
    this.validateUuid(userId, 'userId');
    this.validateUuid(challengeId, 'challengeId');
    
    return this.prisma.userChallenge.findFirst({
      where: {
        userId,
        challengeId
      }
    });
  }

  async updateUserChallenge(id: string, data: Partial<UserChallenge>): Promise<UserChallenge> {
    this.validateUuid(id, 'id');
    return this.prisma.userChallenge.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  async updateProgress(id: string, progressPercentage: number): Promise<UserChallenge> {
    return this.prisma.userChallenge.update({
      where: { id },
      data: {
        progressPercentage,
        updatedAt: new Date()
      }
    });
  }

  async addPoints(id: string, points: number, isBonus: boolean = false): Promise<UserChallenge> {
    if (isBonus) {
      return this.prisma.userChallenge.update({
        where: { id },
        data: {
          bonusPoints: {
            increment: points
          },
          updatedAt: new Date()
        }
      });
    } else {
      return this.prisma.userChallenge.update({
        where: { id },
        data: {
          pointsEarned: {
            increment: points
          },
          updatedAt: new Date()
        }
      });
    }
  }

  async completeChallenge(id: string): Promise<UserChallenge> {
    return this.prisma.userChallenge.update({
      where: { id },
      data: {
        status: 'completed',
        progressPercentage: 100,
        completedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async incrementEvidenceCount(id: string): Promise<UserChallenge> {
    return this.prisma.userChallenge.update({
      where: { id },
      data: {
        evidenceCount: {
          increment: 1
        },
        updatedAt: new Date()
      }
    });
  }
}