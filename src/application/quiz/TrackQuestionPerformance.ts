import { injectable, inject } from 'inversify';
import { QuizAnalyticsRepository } from '../../domain/repositories/QuizAnalyticsRepository';

@injectable()
export class TrackQuestionPerformance {
  constructor(
    @inject(QuizAnalyticsRepository) private analyticsRepository: QuizAnalyticsRepository
  ) {}

  async execute(data: {
    questionId: string;
    userId: string;
    wasCorrect: boolean;
    timeTakenSeconds: number;
    selectedOptionId?: string;
    questionOrder?: number;
    userFatigueLevel?: string;
    tookLongTime?: boolean;
    changedAnswer?: boolean;
  }): Promise<void> {
    await this.analyticsRepository.trackQuestionPerformance(data);
  }
}