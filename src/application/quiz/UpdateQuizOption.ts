import { injectable, inject } from 'inversify';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { QuizOption } from '../../domain/entities/QuizOption';

export interface UpdateQuizOptionDto {
  optionText?: string;
  isCorrect?: boolean;
  sortOrder?: number;
  explanation?: string;
}

@injectable()
export class UpdateQuizOption {
  constructor(
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository
  ) {}

  async execute(optionId: string, data: UpdateQuizOptionDto): Promise<QuizOption> {
    // Update option
    return this.questionRepository.updateOption(optionId, data);
  }
}