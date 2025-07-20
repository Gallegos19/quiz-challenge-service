export interface CreateQuizDto {
  title: string;
  description?: string;
  topicId: string;
  difficultyLevel?: string;
  targetAgeMin?: number;
  targetAgeMax?: number;
  timeLimitMinutes?: number;
  passPercentage?: number;
  maxAttempts?: number;
  pointsReward?: number;
  requiresContentCompletion?: boolean;
  requiredContentIds?: string[];
  isPublished?: boolean;
  createdBy?: string;
}