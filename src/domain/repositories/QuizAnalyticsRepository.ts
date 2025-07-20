export interface ProblematicQuestion {
  questionId: string;
  questionText: string;
  successRate: number;
  avgTimeSeconds: number;
  topicId: string;
  quizId: string;
  recommendation?: string;
}

export interface UserLearningCurve {
  userId: string;
  learningProgress: {
    quizId: string;
    attempt1Score?: number;
    attempt2Score?: number;
    attempt3Score?: number;
    improvementRate?: number;
    finalPassed: boolean;
  }[];
  overallImprovement: number;
  learningVelocity: 'fast' | 'medium' | 'slow';
}

export interface UserNeedingHelp {
  userId: string;
  strugglingTopics: string[];
  avgScore: number;
  failedQuizzes: number;
  lastAttemptDate: Date;
  recommendedActions: string[];
}

export abstract class QuizAnalyticsRepository {
  abstract trackQuizInteraction(data: {
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
  }): Promise<void>;

  abstract trackQuestionPerformance(data: {
    questionId: string;
    userId: string;
    wasCorrect: boolean;
    timeTakenSeconds: number;
    selectedOptionId?: string;
    questionOrder?: number;
    userFatigueLevel?: string;
    tookLongTime?: boolean;
    changedAnswer?: boolean;
  }): Promise<void>;

  abstract getQuizEffectiveness(topicId: string): Promise<{
    topicId: string;
    quizCount: number;
    avgCompletionRate: number;
    avgSuccessRate: number;
    mostProblematicQuestions: ProblematicQuestion[];
  }>;

  abstract getProblematicQuestions(): Promise<ProblematicQuestion[]>;
  
  abstract getUserLearningCurve(userId: string): Promise<UserLearningCurve>;
  
  abstract getUsersNeedingHelp(): Promise<UserNeedingHelp[]>;
}