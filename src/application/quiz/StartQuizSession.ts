import { injectable, inject } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { QuizRepository } from '../../domain/repositories/QuizRepository';
import { QuizSessionRepository } from '../../domain/repositories/QuizSessionRepository';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { StartQuizSessionDto } from '../../domain/dto/StartQuizSessionDto';
import { QuizSession } from '../../domain/entities/QuizSession';

@injectable()
export class StartQuizSession {
  constructor(
    @inject(QuizRepository) private quizRepository: QuizRepository,
    @inject(QuizSessionRepository) private sessionRepository: QuizSessionRepository,
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository
  ) {}

  async execute(data: StartQuizSessionDto): Promise<QuizSession> {
    // Verify quiz exists
    const quiz = await this.quizRepository.getQuizById(data.quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Get questions count
    const questions = await this.questionRepository.getQuestionsByQuizId(data.quizId);
    if (questions.length === 0) {
      throw new Error('Quiz has no questions');
    }

    // Create session
    const sessionData = {
      userId: data.userId,
      quizId: data.quizId,
      sessionToken: uuidv4(),
      questionsTotal: questions.length,
      status: 'started',
      startedAt: new Date(),
      timeTakenSeconds: null,
      passed: null,
      completedAt: null
    };

    return this.sessionRepository.createSession(sessionData);
  }
}