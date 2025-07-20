export interface ChallengeSubmission {
  id: string;
  userChallengeId: string;
  submissionType: string;
  contentText: string | null;
  mediaUrls: any;
  locationData: any;
  measurementData: any;
  metadata: any;
  validationStatus: string;
  validationScore: number | null;
  validationNotes: string | null;
  validatedBy: string | null;
  validatedAt: Date | null;
  autoValidationData: any;
  submissionNumber: number;
  createdAt: Date;
  updatedAt: Date;
}