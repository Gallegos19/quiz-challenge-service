import { injectable, inject } from 'inversify';
import { QuizAnalyticsRepository } from '../../domain/repositories/QuizAnalyticsRepository';

@injectable()
export class TrackQuizInteraction {
  constructor(
    @inject(QuizAnalyticsRepository) private analyticsRepository: QuizAnalyticsRepository
  ) {}

  async execute(data: {
    userId: string;
    quizId: string;
    sessionId: string;
    attemptNumber: number;
    finalScorePercentage: number;
    questionsTotal: number;
    questionsCorrect: number;
    passed: boolean;
    totalTimeSeconds: number;
    avgTimePerQuestion?: number;
    deviceType?: string;
    timeOfDay?: string;
    gaveUp?: boolean;
    helpUsed?: boolean;
    postQuizFeeling?: string;
  }): Promise<void> {
    await this.analyticsRepository.trackQuizInteraction(data);
  }
}