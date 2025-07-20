export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  topicId: string;
  difficultyLevel: string;
  targetAgeMin: number;
  targetAgeMax: number;
  timeLimitMinutes: number;
  questionsCount: number;
  passPercentage: number;
  maxAttempts: number;
  pointsReward: number;
  requiresContentCompletion: boolean;
  requiredContentIds: any;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}