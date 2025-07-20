import { Request, Response } from 'express';
import { container } from '../../config/container';
import { TrackQuizInteraction } from '../../../application/quiz/TrackQuizInteraction';
import { TrackQuestionPerformance } from '../../../application/quiz/TrackQuestionPerformance';
import { GetProblematicQuestions } from '../../../application/quiz/GetProblematicQuestions';

/**
 * Track quiz interaction
 */
export const trackQuizInteraction = async (req: Request, res: Response) => {
  try {
    const interactionData = req.body;
    
    // Validate required fields
    const requiredFields = [
      'userId', 'quizId', 'sessionId', 'attemptNumber', 
      'finalScorePercentage', 'questionsTotal', 'questionsCorrect', 
      'passed', 'totalTimeSeconds'
    ];
    
    for (const field of requiredFields) {
      if (interactionData[field] === undefined) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    
    const trackQuizInteractionUseCase = container.get(TrackQuizInteraction);
    await trackQuizInteractionUseCase.execute(interactionData);
    
    return res.status(201).json({ message: 'Quiz interaction tracked successfully' });
  } catch (error: any) {
    console.error('Error tracking quiz interaction:', error);
    return res.status(500).json({ 
      message: 'Error tracking quiz interaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Track question performance
 */
export const trackQuestionPerformance = async (req: Request, res: Response) => {
  try {
    const performanceData = req.body;
    
    // Validate required fields
    const requiredFields = ['questionId', 'userId', 'wasCorrect', 'timeTakenSeconds'];
    
    for (const field of requiredFields) {
      if (performanceData[field] === undefined) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }
    
    const trackQuestionPerformanceUseCase = container.get(TrackQuestionPerformance);
    await trackQuestionPerformanceUseCase.execute(performanceData);
    
    return res.status(201).json({ message: 'Question performance tracked successfully' });
  } catch (error: any) {
    console.error('Error tracking question performance:', error);
    return res.status(500).json({ 
      message: 'Error tracking question performance',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get quiz effectiveness by topic
 */
export const getQuizEffectiveness = async (req: Request, res: Response) => {
  try {
    // Implementation will be added
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error: any) {
    console.error('Error getting quiz effectiveness:', error);
    return res.status(500).json({ 
      message: 'Error retrieving quiz effectiveness',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get problematic questions
 */
export const getProblematicQuestions = async (req: Request, res: Response) => {
  try {
    const threshold = req.query.threshold ? parseFloat(req.query.threshold as string) : 0.5;
    
    const getProblematicQuestionsUseCase = container.get(GetProblematicQuestions);
    const problematicQuestions = await getProblematicQuestionsUseCase.execute(threshold);
    
    return res.status(200).json(problematicQuestions);
  } catch (error: any) {
    console.error('Error getting problematic questions:', error);
    return res.status(500).json({ 
      message: 'Error retrieving problematic questions',
      error: error.message
    });
  }
};

/**
 * Get user's learning curve
 */
export const getUserLearningCurve = async (req: Request, res: Response) => {
  try {
    // Implementation will be added
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error: any) {
    console.error('Error getting user learning curve:', error);
    return res.status(500).json({ 
      message: 'Error retrieving user learning curve',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get users needing help
 */
export const getUsersNeedingHelp = async (req: Request, res: Response) => {
  try {
    // Implementation will be added
    res.status(501).json({ message: 'Not implemented yet' });
  } catch (error: any) {
    console.error('Error getting users needing help:', error);
    return res.status(500).json({ 
      message: 'Error retrieving users needing help',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};