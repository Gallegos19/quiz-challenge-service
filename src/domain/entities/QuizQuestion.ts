import { QuizOption } from './QuizOption';

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  questionType: string;
  explanation: string | null;
  pointsValue: number;
  timeLimitSeconds: number;
  imageUrl: string | null;
  audioUrl: string | null;
  sortOrder: number;
  difficultyWeight: any; // Changed from number to any to handle Decimal type
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
  options?: QuizOption[];
}