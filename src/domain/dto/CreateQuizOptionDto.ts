export interface CreateQuizOptionDto {
  optionText: string;
  isCorrect: boolean;
  sortOrder?: number;
  explanation?: string;
}