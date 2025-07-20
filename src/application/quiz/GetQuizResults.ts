import { injectable, inject } from 'inversify';
import { QuizSessionRepository } from '../../domain/repositories/QuizSessionRepository';
import { QuizAnswerRepository } from '../../domain/repositories/QuizAnswerRepository';
import { QuizRepository } from '../../domain/repositories/QuizRepository';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';

@injectable()
export class GetQuizResults {
  constructor(
    @inject(QuizSessionRepository) private sessionRepository: QuizSessionRepository,
    @inject(QuizAnswerRepository) private answerRepository: QuizAnswerRepository,
    @inject(QuizRepository) private quizRepository: QuizRepository,
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository
  ) {}

  async execute(sessionId: string, p0: string) {
    // Get session details
    const session = await this.sessionRepository.getSessionById(sessionId);
    if (!session) {
      throw new Error('Quiz session not found');
    }

    // Get quiz details
    const quiz = await this.quizRepository.getQuizById(session.quizId);
    if (!quiz) {
      throw new Error('Quiz not found');
    }

    // Get answers for the session
    const answers = await this.answerRepository.getAnswersBySessionId(sessionId);

    // Get questions for the quiz
    const questions = await this.questionRepository.getQuestionsByQuizId(session.quizId);

    // Map questions with answers
    const questionResults = await Promise.all(
      questions.map(async (question) => {
        const answer = answers.find(a => a.questionId === question.id);
        const options = await this.questionRepository.getOptionsByQuestionId(question.id);
        
        return {
          questionId: question.id,
          questionText: question.questionText,
          questionType: question.questionType,
          explanation: question.explanation,
          pointsValue: question.pointsValue,
          options: options.map(option => ({
            id: option.id,
            text: option.optionText,
            isCorrect: option.isCorrect,
            explanation: option.explanation
          })),
          userAnswer: answer ? {
            selectedOptionId: answer.selectedOptionId,
            userAnswerText: answer.userAnswerText,
            isCorrect: answer.isCorrect,
            pointsEarned: answer.pointsEarned,
            timeTakenSeconds: answer.timeTakenSeconds
          } : null
        };
      })
    );

    // Return comprehensive results
    return {
      sessionId: session.id,
      quizId: quiz.id,
      quizTitle: quiz.title,
      userId: session.userId,
      status: session.status,
      questionsTotal: session.questionsTotal,
      questionsAnswered: session.questionsAnswered,
      questionsCorrect: session.questionsCorrect,
      pointsEarned: session.pointsEarned,
      percentageScore: session.percentageScore,
      passed: session.passed,
      timeTakenSeconds: session.timeTakenSeconds,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      questions: questionResults
    };
  }
}