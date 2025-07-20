export interface UserChallenge {
  id: string;
  userId: string;
  challengeId: string;
  status: string;
  progressPercentage: number;
  pointsEarned: number;
  bonusPoints: number;
  evidenceCount: number;
  notes: string | null;
  joinedAt: Date;
  startedAt: Date | null;
  submittedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}