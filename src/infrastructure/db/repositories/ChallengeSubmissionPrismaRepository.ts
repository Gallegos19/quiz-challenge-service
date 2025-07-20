import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { ChallengeSubmissionRepository } from '../../../domain/repositories/ChallengeSubmissionRepository';
import { ChallengeSubmission } from '../../../domain/entities/ChallengeSubmission';

@injectable()
export class ChallengeSubmissionPrismaRepository implements ChallengeSubmissionRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async createSubmission(data: Omit<ChallengeSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChallengeSubmission> {
    return this.prisma.challengeSubmission.create({
      data: {
        userChallengeId: data.userChallengeId,
        submissionType: data.submissionType,
        contentText: data.contentText,
        mediaUrls: data.mediaUrls,
        locationData: data.locationData,
        measurementData: data.measurementData,
        metadata: data.metadata,
        validationStatus: data.validationStatus,
        validationScore: data.validationScore,
        validationNotes: data.validationNotes,
        validatedBy: data.validatedBy,
        validatedAt: data.validatedAt,
        autoValidationData: data.autoValidationData,
        submissionNumber: data.submissionNumber
      }
    });
  }

  async getSubmissionById(id: string): Promise<ChallengeSubmission | null> {
    return this.prisma.challengeSubmission.findUnique({
      where: { id }
    });
  }

  async getSubmissionsByUserChallenge(userChallengeId: string): Promise<ChallengeSubmission[]> {
    return this.prisma.challengeSubmission.findMany({
      where: { userChallengeId },
      orderBy: { submissionNumber: 'asc' }
    });
  }

  async getPendingValidations(): Promise<ChallengeSubmission[]> {
    return this.prisma.challengeSubmission.findMany({
      where: { validationStatus: 'pending' },
      orderBy: { createdAt: 'asc' }
    });
  }

  async validateSubmission(id: string, validatedBy: string, validationScore: number, validationNotes?: string): Promise<ChallengeSubmission> {
    return this.prisma.challengeSubmission.update({
      where: { id },
      data: {
        validationStatus: 'validated',
        validationScore,
        validationNotes,
        validatedBy,
        validatedAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  async updateSubmission(id: string, data: Partial<ChallengeSubmission>): Promise<ChallengeSubmission> {
    return this.prisma.challengeSubmission.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }
}