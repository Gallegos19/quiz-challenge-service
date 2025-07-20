import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { TutorSubmissionRepository } from '../../../domain/repositories/TutorSubmissionRepository';
import { TutorSubmission } from '../../../domain/entities/TutorSubmission';

@injectable()
export class TutorSubmissionPrismaRepository implements TutorSubmissionRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async createTutorSubmission(data: Omit<TutorSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<TutorSubmission> {
    return this.prisma.tutorSubmission.create({
      data: {
        minorUserId: data.minorUserId,
        tutorUserId: data.tutorUserId,
        challengeId: data.challengeId,
        submissionId: data.submissionId,
        tutorConfirmation: data.tutorConfirmation,
        pointsDistribution: data.pointsDistribution
      }
    });
  }

  async getTutorSubmissionById(id: string): Promise<TutorSubmission | null> {
    return this.prisma.tutorSubmission.findUnique({
      where: { id }
    });
  }

  async getTutorSubmissionsByMinorUser(minorUserId: string): Promise<TutorSubmission[]> {
    return this.prisma.tutorSubmission.findMany({
      where: { minorUserId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getTutorSubmissionsByTutor(tutorUserId: string): Promise<TutorSubmission[]> {
    return this.prisma.tutorSubmission.findMany({
      where: { tutorUserId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateTutorSubmission(id: string, data: Partial<TutorSubmission>): Promise<TutorSubmission> {
    return this.prisma.tutorSubmission.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }
}