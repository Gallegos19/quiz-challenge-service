import { injectable, inject } from 'inversify';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { CreateQuizOptionDto } from '../../domain/dto/CreateQuizOptionDto';
import { QuizOption } from '../../domain/entities/QuizOption';

@injectable()
export class AddQuizOption {
  constructor(
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository
  ) {}

  async execute(questionId: string, data: CreateQuizOptionDto): Promise<QuizOption> {
    // Check if question exists
    const question = await this.questionRepository.getQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Add option
    return this.questionRepository.addOption(questionId, {
      optionText: data.optionText,
      isCorrect: data.isCorrect,
      sortOrder: data.sortOrder || 0,
      explanation: data.explanation || null
    });
  }
}