import { CreateQuizOptionDto } from './CreateQuizOptionDto';

export interface CreateQuizQuestionDto {
  quizId: string;
  questionText: string;
  questionType?: string;
  explanation?: string;
  pointsValue?: number;
  timeLimitSeconds?: number;
  imageUrl?: string;
  audioUrl?: string;
  sortOrder?: number;
  difficultyWeight?: number;
  createdBy?: string;
  options?: CreateQuizOptionDto[];
}