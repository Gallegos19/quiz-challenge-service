import { injectable, inject } from 'inversify';
import { QuizRepository } from '../../domain/repositories/QuizRepository';
import { Quiz } from '../../domain/entities/Quiz';

@injectable()
export class UpdateQuiz {
  constructor(
    @inject(QuizRepository) private quizRepository: QuizRepository
  ) {}

  async execute(id: string, data: Partial<Quiz>, userId?: string): Promise<Quiz> {
    // Add the updatedBy field
    const updateData = {
      ...data,
      updatedBy: userId
    };
    
    return this.quizRepository.updateQuiz(id, updateData);
  }
}