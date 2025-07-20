export interface QuizOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  sortOrder: number;
  explanation: string | null;
  createdAt: Date;
  updatedAt: Date;
}