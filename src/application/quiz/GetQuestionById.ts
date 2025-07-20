import { injectable, inject } from 'inversify';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { QuizQuestion } from '../../domain/entities/QuizQuestion';

@injectable()
export class GetQuestionById {
  constructor(
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository
  ) {}

  async execute(questionId: string): Promise<QuizQuestion | null> {
    return this.questionRepository.getQuestionWithOptions(questionId);
  }
}