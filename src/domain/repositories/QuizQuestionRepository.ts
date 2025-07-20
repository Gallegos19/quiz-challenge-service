import { QuizQuestion } from '../entities/QuizQuestion';
import { QuizOption } from '../entities/QuizOption';

export abstract class QuizQuestionRepository {
  abstract createQuestion(data: Omit<QuizQuestion, 'id' | 'createdAt' | 'updatedAt'>): Promise<QuizQuestion>;
  abstract getQuestionById(id: string): Promise<QuizQuestion | null>;
  abstract getQuestionsByQuizId(quizId: string): Promise<QuizQuestion[]>;
  abstract getAllQuestions(): Promise<QuizQuestion[]>;
  abstract updateQuestion(id: string, data: Partial<QuizQuestion>): Promise<QuizQuestion>;
  abstract deleteQuestion(id: string): Promise<void>;
  abstract getQuestionWithOptions(questionId: string): Promise<QuizQuestion | null>;
  
  // Options management
  abstract addOption(questionId: string, optionData: Omit<QuizOption, 'id' | 'questionId' | 'createdAt' | 'updatedAt'>): Promise<QuizOption>;
  abstract updateOption(optionId: string, data: Partial<QuizOption>): Promise<QuizOption>;
  abstract deleteOption(optionId: string): Promise<void>;
  abstract getOptionsByQuestionId(questionId: string): Promise<QuizOption[]>;
}