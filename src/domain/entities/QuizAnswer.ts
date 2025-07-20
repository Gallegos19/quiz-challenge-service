export interface QuizAnswer {
  id: string;
  sessionId: string;
  questionId: string;
  selectedOptionId: string | null;
  userAnswerText: string | null;
  isCorrect: boolean;
  pointsEarned: number;
  timeTakenSeconds: number | null;
  answerConfidence: number | null;
  answeredAt: Date;
  createdAt: Date;
}