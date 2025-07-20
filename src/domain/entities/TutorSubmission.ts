export interface TutorSubmission {
  id: string;
  minorUserId: string;
  tutorUserId: string;
  challengeId: string;
  submissionId: string;
  tutorConfirmation: string | null;
  pointsDistribution: any;
  createdAt: Date;
  updatedAt: Date;
}