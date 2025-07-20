export interface QuestionPerformanceLog {
  id: string;
  questionId: string;
  userId: string;
  wasCorrect: boolean;
  timeTakenSeconds: number;
  selectedOptionId: string | null;
  questionOrder: number | null;
  userFatigueLevel: string | null;
  tookLongTime: boolean | null;
  changedAnswer: boolean;
  createdAt: Date;
}