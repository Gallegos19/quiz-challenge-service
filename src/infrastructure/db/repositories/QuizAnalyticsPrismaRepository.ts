import { injectable, inject } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { QuizAnalyticsRepository, ProblematicQuestion, UserLearningCurve, UserNeedingHelp } from '../../../domain/repositories/QuizAnalyticsRepository';

@injectable()
export class QuizAnalyticsPrismaRepository implements QuizAnalyticsRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async trackQuizInteraction(data: {
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
    await this.prisma.quizInteractionLog.create({
      data: {
        userId: data.userId,
        quizId: data.quizId,
        sessionId: data.sessionId,
        attemptNumber: data.attemptNumber,
        finalScorePercentage: data.finalScorePercentage,
        questionsTotal: data.questionsTotal,
        questionsCorrect: data.questionsCorrect,
        passed: data.passed,
        totalTimeSeconds: data.totalTimeSeconds,
        avgTimePerQuestion: data.avgTimePerQuestion,
        deviceType: data.deviceType,
        timeOfDay: data.timeOfDay,
        gaveUp: data.gaveUp || false,
        helpUsed: data.helpUsed || false,
        postQuizFeeling: data.postQuizFeeling
      }
    });
  }

  async trackQuestionPerformance(data: {
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
    await this.prisma.questionPerformanceLog.create({
      data: {
        questionId: data.questionId,
        userId: data.userId,
        wasCorrect: data.wasCorrect,
        timeTakenSeconds: data.timeTakenSeconds,
        selectedOptionId: data.selectedOptionId,
        questionOrder: data.questionOrder,
        userFatigueLevel: data.userFatigueLevel,
        tookLongTime: data.tookLongTime,
        changedAnswer: data.changedAnswer || false
      }
    });
  }

  async getQuizEffectiveness(topicId: string): Promise<{
    topicId: string;
    quizCount: number;
    avgCompletionRate: number;
    avgSuccessRate: number;
    mostProblematicQuestions: ProblematicQuestion[];
  }> {
    // Get quizzes for the topic
    const quizzes = await this.prisma.quiz.findMany({
      where: {
        topicId,
        deletedAt: null
      }
    });

    const quizIds = quizzes.map(quiz => quiz.id);

    // Get sessions for these quizzes
    const sessions = await this.prisma.quizSession.findMany({
      where: {
        quizId: {
          in: quizIds
        },
        status: 'completed'
      }
    });

    // Calculate completion rate (completed sessions / total sessions)
    const totalSessions = await this.prisma.quizSession.count({
      where: {
        quizId: {
          in: quizIds
        }
      }
    });

    const completionRate = totalSessions > 0 ? (sessions.length / totalSessions) * 100 : 0;

    // Calculate success rate (passed sessions / completed sessions)
    const passedSessions = sessions.filter(session => session.passed).length;
    const successRate = sessions.length > 0 ? (passedSessions / sessions.length) * 100 : 0;

    // Find problematic questions
    const problematicQuestions = await this.getProblematicQuestionsForTopic(topicId);

    return {
      topicId,
      quizCount: quizzes.length,
      avgCompletionRate: completionRate,
      avgSuccessRate: successRate,
      mostProblematicQuestions: problematicQuestions.slice(0, 5) // Top 5 most problematic
    };
  }

  async getProblematicQuestions(): Promise<ProblematicQuestion[]> {
    // Get all questions with their performance logs
    const questions = await this.prisma.quizQuestion.findMany({
      where: {
        deletedAt: null
      },
      include: {
        quiz: true,
        performanceLogs: true
      }
    });

    // Calculate success rate and average time for each question
    const problematicQuestions: ProblematicQuestion[] = [];

    for (const question of questions) {
      if (question.performanceLogs.length === 0) continue;

      const correctAnswers = question.performanceLogs.filter(log => log.wasCorrect).length;
      const successRate = (correctAnswers / question.performanceLogs.length) * 100;
      const totalTime = question.performanceLogs.reduce((sum, log) => sum + log.timeTakenSeconds, 0);
      const avgTime = totalTime / question.performanceLogs.length;

      // Consider questions with low success rate or high average time as problematic
      if (successRate < 50 || avgTime > 45) {
        let recommendation = '';
        if (successRate < 30) {
          recommendation = 'Consider revising question wording or providing additional context';
        } else if (avgTime > 60) {
          recommendation = 'Question may be too complex or unclear';
        } else {
          recommendation = 'Review question and options for clarity';
        }

        problematicQuestions.push({
          questionId: question.id,
          questionText: question.questionText,
          successRate,
          avgTimeSeconds: avgTime,
          topicId: question.quiz.topicId,
          quizId: question.quizId,
          recommendation
        });
      }
    }

    // Sort by success rate (ascending)
    return problematicQuestions.sort((a, b) => a.successRate - b.successRate);
  }

  private async getProblematicQuestionsForTopic(topicId: string): Promise<ProblematicQuestion[]> {
    // Get quizzes for the topic
    const quizzes = await this.prisma.quiz.findMany({
      where: {
        topicId,
        deletedAt: null
      }
    });

    const quizIds = quizzes.map(quiz => quiz.id);

    // Get questions for these quizzes
    const questions = await this.prisma.quizQuestion.findMany({
      where: {
        quizId: {
          in: quizIds
        },
        deletedAt: null
      },
      include: {
        performanceLogs: true
      }
    });

    // Calculate success rate and average time for each question
    const problematicQuestions: ProblematicQuestion[] = [];

    for (const question of questions) {
      if (question.performanceLogs.length === 0) continue;

      const correctAnswers = question.performanceLogs.filter(log => log.wasCorrect).length;
      const successRate = (correctAnswers / question.performanceLogs.length) * 100;
      const totalTime = question.performanceLogs.reduce((sum, log) => sum + log.timeTakenSeconds, 0);
      const avgTime = totalTime / question.performanceLogs.length;

      // Consider questions with low success rate or high average time as problematic
      if (successRate < 50 || avgTime > 45) {
        let recommendation = '';
        if (successRate < 30) {
          recommendation = 'Consider revising question wording or providing additional context';
        } else if (avgTime > 60) {
          recommendation = 'Question may be too complex or unclear';
        } else {
          recommendation = 'Review question and options for clarity';
        }

        problematicQuestions.push({
          questionId: question.id,
          questionText: question.questionText,
          successRate,
          avgTimeSeconds: avgTime,
          topicId,
          quizId: question.quizId,
          recommendation
        });
      }
    }

    // Sort by success rate (ascending)
    return problematicQuestions.sort((a, b) => a.successRate - b.successRate);
  }

  async getUserLearningCurve(userId: string): Promise<UserLearningCurve> {
    // Get all quiz interactions for the user
    const interactions = await this.prisma.quizInteractionLog.findMany({
      where: {
        userId
      },
      orderBy: [
        { quizId: 'asc' },
        { attemptNumber: 'asc' }
      ],
      include: {
        quiz: true
      }
    });

    // Group interactions by quiz
    const quizInteractions = new Map<string, any[]>();
    
    for (const interaction of interactions) {
      if (!quizInteractions.has(interaction.quizId)) {
        quizInteractions.set(interaction.quizId, []);
      }
      quizInteractions.get(interaction.quizId)?.push(interaction);
    }

    // Calculate learning progress for each quiz
    const learningProgress = [];
    
    for (const [quizId, quizAttempts] of quizInteractions.entries()) {
      // Sort attempts by attempt number
      quizAttempts.sort((a, b) => a.attemptNumber - b.attemptNumber);
      
      const progress: any = {
        quizId,
        finalPassed: quizAttempts[quizAttempts.length - 1].passed
      };
      
      // Add scores for each attempt (up to 3)
      if (quizAttempts.length >= 1) {
        progress.attempt1Score = quizAttempts[0].finalScorePercentage;
      }
      
      if (quizAttempts.length >= 2) {
        progress.attempt2Score = quizAttempts[1].finalScorePercentage;
        progress.improvementRate = progress.attempt2Score - progress.attempt1Score;
      }
      
      if (quizAttempts.length >= 3) {
        progress.attempt3Score = quizAttempts[2].finalScorePercentage;
        progress.improvementRate = progress.attempt3Score - progress.attempt1Score;
      }
      
      learningProgress.push(progress);
    }

    // Calculate overall improvement
    let overallImprovement = 0;
    let improvementCount = 0;
    
    for (const progress of learningProgress) {
      if (progress.improvementRate) {
        overallImprovement += progress.improvementRate;
        improvementCount++;
      }
    }
    
    const avgImprovement = improvementCount > 0 ? overallImprovement / improvementCount : 0;
    
    // Determine learning velocity
    let learningVelocity: 'fast' | 'medium' | 'slow';
    
    if (avgImprovement > 20) {
      learningVelocity = 'fast';
    } else if (avgImprovement > 10) {
      learningVelocity = 'medium';
    } else {
      learningVelocity = 'slow';
    }

    return {
      userId,
      learningProgress,
      overallImprovement: avgImprovement,
      learningVelocity
    };
  }

  async getUsersNeedingHelp(): Promise<UserNeedingHelp[]> {
    // Get users with low performance
    const sessions = await this.prisma.quizSession.findMany({
      where: {
        status: 'completed'
      },
      orderBy: {
        userId: 'asc'
      }
    });

    // Group sessions by user
    const userSessions = new Map<string, any[]>();
    
    for (const session of sessions) {
      if (!userSessions.has(session.userId)) {
        userSessions.set(session.userId, []);
      }
      userSessions.get(session.userId)?.push(session);
    }

    const usersNeedingHelp: UserNeedingHelp[] = [];
    
    // Analyze each user's performance
    for (const [userId, userSessionList] of userSessions.entries()) {
      const totalSessions = userSessionList.length;
      const failedSessions = userSessionList.filter(session => !session.passed).length;
      const failRate = totalSessions > 0 ? (failedSessions / totalSessions) * 100 : 0;
      
      // If fail rate is high, user may need help
      if (failRate > 40 && failedSessions >= 2) {
        // Get quizzes for failed sessions
        const failedSessionIds = userSessionList
          .filter(session => !session.passed)
          .map(session => session.id);
        
        // Get topics for these quizzes
        const failedQuizzes = await this.prisma.quiz.findMany({
          where: {
            sessions: {
              some: {
                id: {
                  in: failedSessionIds
                }
              }
            }
          }
        });
        
        const strugglingTopics = [...new Set(failedQuizzes.map(quiz => quiz.topicId))];
        
        // Calculate average score
        const totalScore = userSessionList.reduce((sum, session) => sum + Number(session.percentageScore), 0);
        const avgScore = totalSessions > 0 ? totalScore / totalSessions : 0;
        
        // Get last attempt date
        const lastAttemptDate = new Date(Math.max(...userSessionList.map(s => s.completedAt ? s.completedAt.getTime() : 0)));
        
        // Generate recommendations
        const recommendedActions = [];
        
        if (failRate > 70) {
          recommendedActions.push('Consider providing personalized tutoring');
        }
        
        if (avgScore < 50) {
          recommendedActions.push('Review fundamental concepts in struggling topics');
        }
        
        if (failedSessions > 3) {
          recommendedActions.push('Suggest alternative learning materials');
        }
        
        usersNeedingHelp.push({
          userId,
          strugglingTopics,
          avgScore,
          failedQuizzes: failedSessions,
          lastAttemptDate,
          recommendedActions
        });
      }
    }
    
    // Sort by average score (ascending)
    return usersNeedingHelp.sort((a, b) => a.avgScore - b.avgScore);
  }
}