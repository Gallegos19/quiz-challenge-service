export interface SubmitChallengeEvidenceDto {
  userChallengeId: string;
  submissionType?: string;
  contentText?: string;
  mediaUrls?: string[];
  locationData?: any;
  measurementData?: any;
  metadata?: any;
}