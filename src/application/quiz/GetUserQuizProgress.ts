import { injectable, inject } from 'inversify';
import { QuizSessionRepository } from '../../domain/repositories/QuizSessionRepository';
import { QuizRepository } from '../../domain/repositories/QuizRepository';

@injectable()
export class GetUserQuizProgress {
  constructor(
    @inject(QuizSessionRepository) private sessionRepository: QuizSessionRepository,
    @inject(QuizRepository) private quizRepository: QuizRepository
  ) {}

  async execute(userId: string) {
    // Get all completed sessions for the user
    const completedSessions = await this.sessionRepository.getCompletedSessionsByUserId(userId);
    
    // Get active sessions for the user
    const activeSessions = await this.sessionRepository.getActiveSessionsByUserId(userId);
    
    // Group sessions by quiz
    const quizProgress = new Map();
    
    // Process completed sessions
    for (const session of completedSessions) {
      if (!quizProgress.has(session.quizId)) {
        const quiz = await this.quizRepository.getQuizById(session.quizId);
        quizProgress.set(session.quizId, {
          quizId: session.quizId,
          quizTitle: quiz?.title || 'Unknown Quiz',
          attempts: [],
          bestScore: 0,
          lastAttemptDate: null,
          completed: false,
          passed: false
        });
      }
      
      const progress = quizProgress.get(session.quizId);
      progress.attempts.push({
        sessionId: session.id,
        score: session.percentageScore,
        pointsEarned: session.pointsEarned,
        passed: session.passed,
        completedAt: session.completedAt
      });
      
      // Update best score
      if (session.percentageScore > progress.bestScore) {
        progress.bestScore = session.percentageScore;
      }
      
      // Update last attempt date
      if (!progress.lastAttemptDate || (session.completedAt && session.completedAt > progress.lastAttemptDate)) {
        progress.lastAttemptDate = session.completedAt;
      }
      
      // Update passed status
      if (session.passed) {
        progress.passed = true;
      }
      
      // Mark as completed
      progress.completed = true;
    }
    
    // Process active sessions
    for (const session of activeSessions) {
      if (!quizProgress.has(session.quizId)) {
        const quiz = await this.quizRepository.getQuizById(session.quizId);
        quizProgress.set(session.quizId, {
          quizId: session.quizId,
          quizTitle: quiz?.title || 'Unknown Quiz',
          attempts: [],
          bestScore: 0,
          lastAttemptDate: null,
          completed: false,
          passed: false,
          inProgress: true,
          currentSessionId: session.id,
          currentProgress: {
            questionsAnswered: session.questionsAnswered,
            questionsTotal: session.questionsTotal,
            currentScore: session.percentageScore
          }
        });
      } else {
        const progress = quizProgress.get(session.quizId);
        progress.inProgress = true;
        progress.currentSessionId = session.id;
        progress.currentProgress = {
          questionsAnswered: session.questionsAnswered,
          questionsTotal: session.questionsTotal,
          currentScore: session.percentageScore
        };
      }
    }
    
    // Calculate overall statistics
    const totalQuizzes = quizProgress.size;
    const completedQuizzes = Array.from(quizProgress.values()).filter(p => p.completed).length;
    const passedQuizzes = Array.from(quizProgress.values()).filter(p => p.passed).length;
    const averageScore = Array.from(quizProgress.values())
      .filter(p => p.completed)
      .reduce((sum, p) => sum + p.bestScore, 0) / (completedQuizzes || 1);
    
    return {
      userId,
      summary: {
        totalQuizzes,
        completedQuizzes,
        passedQuizzes,
        averageScore,
        completionRate: totalQuizzes > 0 ? (completedQuizzes / totalQuizzes) * 100 : 0,
        passRate: completedQuizzes > 0 ? (passedQuizzes / completedQuizzes) * 100 : 0
      },
      quizzes: Array.from(quizProgress.values())
    };
  }
}