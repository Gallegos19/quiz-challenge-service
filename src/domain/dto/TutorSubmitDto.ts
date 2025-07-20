export interface TutorSubmitDto {
  minorUserId: string;
  tutorUserId: string;
  challengeId: string;
  tutorConfirmation?: string;
  pointsDistribution?: any;
  submissionData: {
    submissionType?: string;
    contentText?: string;
    mediaUrls?: string[];
    locationData?: any;
    measurementData?: any;
    metadata?: any;
  };
}