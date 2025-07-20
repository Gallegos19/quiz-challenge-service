import { injectable, inject } from 'inversify';
import { QuizRepository } from '../../domain/repositories/QuizRepository';
import { Quiz } from '../../domain/entities/Quiz';

@injectable()
export class UnpublishQuiz {
  constructor(
    @inject(QuizRepository) private quizRepository: QuizRepository
  ) {}

  async execute(id: string): Promise<Quiz> {
    return this.quizRepository.unpublishQuiz(id);
  }
}