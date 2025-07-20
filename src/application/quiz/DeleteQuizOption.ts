import { injectable, inject } from 'inversify';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';

@injectable()
export class DeleteQuizOption {
  constructor(
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository
  ) {}

  async execute(optionId: string): Promise<void> {
    await this.questionRepository.deleteOption(optionId);
  }
}