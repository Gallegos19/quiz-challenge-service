import { ChallengeSubmission } from '../entities/ChallengeSubmission';

export abstract class ChallengeSubmissionRepository {
  abstract createSubmission(data: Omit<ChallengeSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<ChallengeSubmission>;
  abstract getSubmissionById(id: string): Promise<ChallengeSubmission | null>;
  abstract getSubmissionsByUserChallenge(userChallengeId: string): Promise<ChallengeSubmission[]>;
  abstract getPendingValidations(): Promise<ChallengeSubmission[]>;
  abstract validateSubmission(id: string, validationScore: number, validationNotes?: string): Promise<ChallengeSubmission>;
  abstract updateSubmission(id: string, data: Partial<ChallengeSubmission>): Promise<ChallengeSubmission>;
}