import { injectable, inject } from 'inversify';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { QuizRepository } from '../../domain/repositories/QuizRepository';

@injectable()
export class DeleteQuizQuestion {
  constructor(
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository,
    @inject(QuizRepository) private quizRepository: QuizRepository
  ) {}

  async execute(questionId: string): Promise<void> {
    // Check if question exists
    const question = await this.questionRepository.getQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Delete question
    await this.questionRepository.deleteQuestion(questionId);

    // Update quiz questions count
    const quiz = await this.quizRepository.getQuizById(question.quizId);
    if (quiz && quiz.questionsCount > 0) {
      await this.quizRepository.updateQuiz(question.quizId, {
        questionsCount: quiz.questionsCount - 1
      });
    }
  }
}