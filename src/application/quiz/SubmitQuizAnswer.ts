import { injectable, inject } from 'inversify';
import { QuizSessionRepository } from '../../domain/repositories/QuizSessionRepository';
import { QuizAnswerRepository } from '../../domain/repositories/QuizAnswerRepository';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { SubmitQuizAnswerDto } from '../../domain/dto/SubmitQuizAnswerDto';
import { QuizAnswer } from '../../domain/entities/QuizAnswer';

@injectable()
export class SubmitQuizAnswer {
  constructor(
    @inject(QuizSessionRepository) private sessionRepository: QuizSessionRepository,
    @inject(QuizAnswerRepository) private answerRepository: QuizAnswerRepository,
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository
  ) {}

  async execute(data: SubmitQuizAnswerDto): Promise<QuizAnswer> {
    // Verify session exists and is active
    const session = await this.sessionRepository.getSessionById(data.sessionId);
    if (!session) {
      throw new Error('Quiz session not found');
    }
    
    if (session.status !== 'started') {
      throw new Error('Quiz session is not active');
    }
    
    // Verify that the user ID in the request matches the user ID associated with the session
    if (session.userId !== data.userId) {
      throw new Error('User ID does not match session user ID');
    }

    // Get question with options
    const question = await this.questionRepository.getQuestionWithOptions(data.questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Determine if answer is correct
    let isCorrect = false;
    let pointsEarned = 0;

    if (question.questionType === 'multiple_choice' && data.selectedOptionId) {
      // Find the selected option
      const selectedOption = question.options?.find(option => option.id === data.selectedOptionId);
      if (selectedOption) {
        isCorrect = selectedOption.isCorrect;
        pointsEarned = isCorrect ? question.pointsValue : 0;
      }
    } else if (question.questionType === 'text' && data.userAnswerText) {
      // For text questions, we would need some logic to determine correctness
      // This is a simplified example
      const correctOption = question.options?.find(option => option.isCorrect);
      if (correctOption) {
        isCorrect = data.userAnswerText.toLowerCase() === correctOption.optionText.toLowerCase();
        pointsEarned = isCorrect ? question.pointsValue : 0;
      }
    }

    // Create answer record
    const answerData = {
      sessionId: data.sessionId,
      questionId: data.questionId,
      selectedOptionId: data.selectedOptionId || null,
      userAnswerText: data.userAnswerText || null,
      isCorrect,
      pointsEarned,
      timeTakenSeconds: data.timeTakenSeconds || null,
      answerConfidence: data.answerConfidence || null
    };

    const answer = await this.answerRepository.createAnswer(answerData);

    // Update session progress
    const answersForSession = await this.answerRepository.getAnswersBySessionId(data.sessionId);
    const questionsAnswered = answersForSession.length;
    const questionsCorrect = answersForSession.filter(a => a.isCorrect).length;
    const totalPointsEarned = answersForSession.reduce((sum, a) => sum + a.pointsEarned, 0);
    const percentageScore = (questionsCorrect / session.questionsTotal) * 100;

    // Check if all questions have been answered
    if (questionsAnswered >= session.questionsTotal) {
      // Quiz is complete
      const passed = percentageScore >= 70; // Using default pass percentage
      await this.sessionRepository.completeSession(data.sessionId, {
        questionsAnswered,
        questionsCorrect,
        pointsEarned: totalPointsEarned,
        percentageScore,
        timeTakenSeconds: answersForSession.reduce((sum, a) => sum + (a.timeTakenSeconds || 0), 0),
        passed
      });
    } else {
      // Update session progress
      await this.sessionRepository.updateSession(data.sessionId, {
        questionsAnswered,
        questionsCorrect,
        pointsEarned: totalPointsEarned,
        percentageScore
      });
    }

    return answer;
  }
}