import { injectable, inject } from 'inversify';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { QuizRepository } from '../../domain/repositories/QuizRepository';
import { CreateQuizQuestionDto } from '../../domain/dto/CreateQuizQuestionDto';
import { QuizQuestion } from '../../domain/entities/QuizQuestion';

@injectable()
export class CreateQuizQuestion {
  constructor(
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository,
    @inject(QuizRepository) private quizRepository: QuizRepository
  ) {}

  async execute(data: CreateQuizQuestionDto): Promise<QuizQuestion> {
    // Check if quiz exists
    const quiz = await this.quizRepository.getQuizById(data.quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Create question
    const questionData = {
      quizId: data.quizId,
      questionText: data.questionText,
      questionType: data.questionType || 'multiple_choice',
      explanation: data.explanation || null,
      pointsValue: data.pointsValue || 10,
      timeLimitSeconds: data.timeLimitSeconds || 30,
      imageUrl: data.imageUrl || null,
      audioUrl: data.audioUrl || null,
      sortOrder: data.sortOrder || 0,
      difficultyWeight: data.difficultyWeight || 1.0,
      createdBy: data.createdBy || null,
      updatedBy: null,
      deletedAt: null
    };

    const question = await this.questionRepository.createQuestion(questionData);

    // Create options if provided
    if (data.options && data.options.length > 0) {
      for (const optionData of data.options) {
        await this.questionRepository.addOption(question.id, {
          optionText: optionData.optionText,
          isCorrect: optionData.isCorrect,
          sortOrder: optionData.sortOrder || 0,
          explanation: optionData.explanation || null
        });
      }
    }

    // Update quiz questions count
    await this.quizRepository.updateQuiz(data.quizId, {
      questionsCount: quiz.questionsCount + 1
    });

    // Return question with options
    return this.questionRepository.getQuestionWithOptions(question.id) as Promise<QuizQuestion>;
  }
}