import { injectable, inject } from 'inversify';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { QuestionPerformanceLogRepository } from '../../domain/repositories/QuestionPerformanceLogRepository';
import { QuizQuestion } from '../../domain/entities/QuizQuestion';

interface ProblematicQuestion {
  question: QuizQuestion;
  incorrectRate: number;
  avgTimeSeconds: number;
  totalAttempts: number;
}

@injectable()
export class GetProblematicQuestions {
  constructor(
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository,
    @inject(QuestionPerformanceLogRepository) private performanceRepository: QuestionPerformanceLogRepository
  ) {}

  async execute(threshold: number = 0.5): Promise<ProblematicQuestion[]> {
    // Get all questions
    const allQuestions = await this.questionRepository.getAllQuestions();
    
    // Get performance data for each question
    const problematicQuestions: ProblematicQuestion[] = [];
    
    for (const question of allQuestions) {
      const performanceLogs = await this.performanceRepository.getPerformanceLogsByQuestionId(question.id);
      
      if (performanceLogs.length === 0) {
        continue; // Skip questions with no performance data
      }
      
      // Calculate incorrect rate
      const totalAttempts = performanceLogs.length;
      const incorrectAttempts = performanceLogs.filter(log => !log.wasCorrect).length;
      const incorrectRate = incorrectAttempts / totalAttempts;
      
      // Calculate average time
      const totalTime = performanceLogs.reduce((sum, log) => sum + log.timeTakenSeconds, 0);
      const avgTimeSeconds = totalTime / totalAttempts;
      
      // If incorrect rate is above threshold, consider it problematic
      if (incorrectRate >= threshold) {
        problematicQuestions.push({
          question,
          incorrectRate,
          avgTimeSeconds,
          totalAttempts
        });
      }
    }
    
    // Sort by incorrect rate (highest first)
    return problematicQuestions.sort((a, b) => b.incorrectRate - a.incorrectRate);
  }
}