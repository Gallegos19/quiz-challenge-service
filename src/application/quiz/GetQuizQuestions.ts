import { injectable, inject } from 'inversify';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { QuizRepository } from '../../domain/repositories/QuizRepository';
import { QuizQuestion } from '../../domain/entities/QuizQuestion';

@injectable()
export class GetQuizQuestions {
  constructor(
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository,
    @inject(QuizRepository) private quizRepository: QuizRepository
  ) {}

  async execute(quizId: string): Promise<QuizQuestion[]> {
    // Check if quiz exists
    const quiz = await this.quizRepository.getQuizById(quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Get questions for the quiz
    const questions = await this.questionRepository.getQuestionsByQuizId(quizId);
    
    // Get options for each question
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await this.questionRepository.getOptionsByQuestionId(question.id);
        return {
          ...question,
          options
        };
      })
    );

    return questionsWithOptions;
  }
}