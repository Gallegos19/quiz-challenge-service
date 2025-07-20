import { injectable, inject } from 'inversify';
import { QuizRepository } from '../../domain/repositories/QuizRepository';
import { Quiz } from '../../domain/entities/Quiz';

@injectable()
export class GetQuizzesByTopic {
  constructor(
    @inject(QuizRepository) private quizRepository: QuizRepository
  ) {}

  async execute(topicId: string): Promise<Quiz[]> {
    return this.quizRepository.getQuizzesByTopic(topicId);
  }
}