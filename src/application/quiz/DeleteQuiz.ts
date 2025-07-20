import { injectable, inject } from 'inversify';
import { QuizRepository } from '../../domain/repositories/QuizRepository';

@injectable()
export class DeleteQuiz {
  constructor(
    @inject(QuizRepository) private quizRepository: QuizRepository
  ) {}

  async execute(id: string): Promise<void> {
    return this.quizRepository.deleteQuiz(id);
  }
}