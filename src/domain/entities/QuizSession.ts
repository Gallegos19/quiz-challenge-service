export interface QuizSession {
  id: string;
  userId: string;
  quizId: string;
  sessionToken: string | null;
  questionsTotal: number;
  questionsAnswered: number;
  questionsCorrect: number;
  pointsEarned: number;
  percentageScore: any; // Changed from number to any to handle Decimal type
  timeTakenSeconds: number | null;
  status: string;
  passed: boolean | null;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}