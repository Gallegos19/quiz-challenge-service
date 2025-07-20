import { TutorSubmission } from '../entities/TutorSubmission';

export abstract class TutorSubmissionRepository {
  abstract createTutorSubmission(data: Omit<TutorSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<TutorSubmission>;
  abstract getTutorSubmissionById(id: string): Promise<TutorSubmission | null>;
  abstract getTutorSubmissionsByMinorUser(minorUserId: string): Promise<TutorSubmission[]>;
  abstract getTutorSubmissionsByTutor(tutorUserId: string): Promise<TutorSubmission[]>;
  abstract updateTutorSubmission(id: string, data: Partial<TutorSubmission>): Promise<TutorSubmission>;
}