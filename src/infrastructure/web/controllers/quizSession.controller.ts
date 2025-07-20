import { Request, Response } from 'express';
import { container } from '../../config/container';
import { StartQuizSession } from '../../../application/quiz/StartQuizSession';
import { SubmitQuizAnswer } from '../../../application/quiz/SubmitQuizAnswer';
import { GetQuizResults } from '../../../application/quiz/GetQuizResults';
import { GetUserQuizProgress } from '../../../application/quiz/GetUserQuizProgress';
import { StartQuizSessionDto } from '../../../domain/dto/StartQuizSessionDto';
import { SubmitQuizAnswerDto } from '../../../domain/dto/SubmitQuizAnswerDto';

/**
 * Start a new quiz session
 */
export const startQuizSession = async (req: Request, res: Response) => {
  try {
    const { quizId, userId } = req.body;
    
    if (!quizId) {
      return res.status(400).json({ message: 'Quiz ID is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const sessionData: StartQuizSessionDto = {
      userId,
      quizId
    };
    
    const startQuizSessionUseCase = container.get(StartQuizSession);
    const session = await startQuizSessionUseCase.execute(sessionData);
    
    return res.status(201).json(session);
  } catch (error: any) {
    console.error('Error starting quiz session:', error);
    
    if (error.message === 'Quiz not found') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message === 'Quiz has no questions') {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error starting quiz session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Submit an answer for a quiz question
 */
export const submitQuizAnswer = async (req: Request, res: Response) => {
  try {
    const answerData: SubmitQuizAnswerDto = req.body;
    const { userId } = req.body;
    
    if (!answerData.sessionId || !answerData.questionId) {
      return res.status(400).json({ message: 'Session ID and question ID are required' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // For multiple choice questions, selectedOptionId is required
    if (!answerData.selectedOptionId && !answerData.userAnswerText) {
      return res.status(400).json({ message: 'Either selectedOptionId or userAnswerText is required' });
    }
    
    const submitQuizAnswerUseCase = container.get(SubmitQuizAnswer);
    const answer = await submitQuizAnswerUseCase.execute({
      ...answerData,
      userId // Add userId to the answer data
    });
    
    return res.status(200).json(answer);
  } catch (error: any) {
    console.error('Error submitting quiz answer:', error);
    
    if (error.message === 'Quiz session not found' || error.message === 'Question not found') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message === 'Quiz session is not active') {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error submitting quiz answer',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get quiz session results
 */
export const getQuizResults = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required as a query parameter' });
    }
    
    const getQuizResultsUseCase = container.get(GetQuizResults);
    const results = await getQuizResultsUseCase.execute(sessionId, userId as string);
    
    return res.status(200).json(results);
  } catch (error: any) {
    console.error('Error getting quiz results:', error);
    
    if (error.message === 'Quiz session not found') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message === 'User ID does not match session user ID') {
      return res.status(403).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error retrieving quiz results',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user's quiz progress
 */
export const getUserQuizProgress = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const getUserQuizProgressUseCase = container.get(GetUserQuizProgress);
    const progress = await getUserQuizProgressUseCase.execute(userId);
    
    return res.status(200).json(progress);
  } catch (error: any) {
    console.error('Error getting user quiz progress:', error);
    
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error retrieving user quiz progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};