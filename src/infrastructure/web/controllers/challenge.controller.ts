import { Request, Response } from 'express';
import { container } from '../../config/container';
import { GetActiveChallenges } from '../../../application/challenge/GetActiveChallenges';
import { GetAllChallenges } from '../../../application/challenge/GetAllChallenges';
import { JoinChallenge } from '../../../application/challenge/JoinChallenge';
import { SubmitChallengeEvidence } from '../../../application/challenge/SubmitChallengeEvidence';
import { GetUserChallenges } from '../../../application/challenge/GetUserChallenges';
import { TutorSubmit } from '../../../application/challenge/TutorSubmit';
import { GetPendingValidations } from '../../../application/challenge/GetPendingValidations';
import { ValidateSubmission } from '../../../application/challenge/ValidateSubmission';
import { CreateChallenge } from '../../../application/challenge/CreateChallenge';
import { UpdateChallenge } from '../../../application/challenge/UpdateChallenge';
import { DeleteChallenge } from '../../../application/challenge/DeleteChallenge';
import { GetChallengeById } from '../../../application/challenge/GetChallengeById';

/**
 * Create a new challenge
 */
export const createChallenge = async (req: Request, res: Response) => {
  try {
    const challengeData = {
      ...req.body,
      createdBy: req.user?.userId
    };
    
    // Validate required fields
    if (!challengeData.title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const createChallengeUseCase = container.get(CreateChallenge);
    const challenge = await createChallengeUseCase.execute(challengeData);
    
    return res.status(201).json(challenge);
  } catch (error: any) {
    console.error('Error creating challenge:', error);
    return res.status(500).json({ 
      message: 'Error creating challenge',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get challenge by ID
 */
export const getChallengeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    const getChallengeByIdUseCase = container.get(GetChallengeById);
    const challenge = await getChallengeByIdUseCase.execute(id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    return res.status(200).json(challenge);
  } catch (error: any) {
    console.error('Error getting challenge by ID:', error);
    return res.status(500).json({ 
      message: 'Error retrieving challenge',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a challenge
 */
export const updateChallenge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user?.userId
    };
    
    if (!id) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    const updateChallengeUseCase = container.get(UpdateChallenge);
    const challenge = await updateChallengeUseCase.execute(id, updateData);
    
    return res.status(200).json(challenge);
  } catch (error: any) {
    console.error('Error updating challenge:', error);
    
    if (error.message === 'Challenge not found') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error updating challenge',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Delete a challenge
 */
export const deleteChallenge = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    const deleteChallengeUseCase = container.get(DeleteChallenge);
    await deleteChallengeUseCase.execute(id);
    
    return res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting challenge:', error);
    
    if (error.message === 'Challenge not found') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error deleting challenge',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all challenges
 */
export const getAllChallenges = async (req: Request, res: Response) => {
  try {
    const getAllChallengesUseCase = container.get(GetAllChallenges);
    const challenges = await getAllChallengesUseCase.execute();
    
    return res.status(200).json(challenges);
  } catch (error: any) {
    console.error('Error getting all challenges:', error);
    return res.status(500).json({ 
      message: 'Error retrieving challenges',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get active challenges
 */
export const getActiveChallenges = async (req: Request, res: Response) => {
  try {
    const getActiveChallengesUseCase = container.get(GetActiveChallenges);
    const challenges = await getActiveChallengesUseCase.execute();
    
    return res.status(200).json(challenges);
  } catch (error: any) {
    console.error('Error getting active challenges:', error);
    return res.status(500).json({ 
      message: 'Error retrieving active challenges',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Join a challenge
 */
export const joinChallenge = async (req: Request, res: Response) => {
  try {
    const { challengeId } = req.params;
    const { userId } = req.body;
    
    // Si no se proporciona userId en el cuerpo, usar el del token como respaldo
    const effectiveUserId = userId || req.user?.userId;
    
    if (!effectiveUserId) {
      return res.status(400).json({ message: 'User ID is required either in request body or via authentication token' });
    }
    
    if (!challengeId) {
      return res.status(400).json({ message: 'Challenge ID is required' });
    }
    
    const joinChallengeUseCase = container.get(JoinChallenge);
    const userChallenge = await joinChallengeUseCase.execute({
      userId: effectiveUserId,
      challengeId
    });
    
    return res.status(201).json(userChallenge);
  } catch (error: any) {
    console.error('Error joining challenge:', error);
    
    if (error.message === 'Challenge not found') {
      return res.status(404).json({ message: error.message });
    }
    
    if (error.message === 'User has already joined this challenge') {
      return res.status(409).json({ message: error.message });
    }
    
    if (error.message === 'Challenge has reached maximum number of participants') {
      return res.status(400).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error joining challenge',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Submit evidence for a challenge
 */
export const submitChallengeEvidence = async (req: Request, res: Response) => {
  try {
    const { userChallengeId, submissionType, contentText, mediaUrls, locationData, measurementData, metadata } = req.body;
    
    if (!userChallengeId) {
      return res.status(400).json({ message: 'User challenge ID is required' });
    }
    
    const submitChallengeEvidenceUseCase = container.get(SubmitChallengeEvidence);
    const submission = await submitChallengeEvidenceUseCase.execute({
      userChallengeId,
      submissionType,
      contentText,
      mediaUrls,
      locationData,
      measurementData,
      metadata
    });
    
    return res.status(201).json(submission);
  } catch (error: any) {
    console.error('Error submitting challenge evidence:', error);
    
    if (error.message === 'User challenge not found') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error submitting challenge evidence',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get user challenges
 */
export const getUserChallenges = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const getUserChallengesUseCase = container.get(GetUserChallenges);
    const userChallenges = await getUserChallengesUseCase.execute(userId);
    
    return res.status(200).json(userChallenges);
  } catch (error: any) {
    console.error('Error getting user challenges:', error);
    return res.status(500).json({ 
      message: 'Error retrieving user challenges',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Submit evidence as a tutor for a minor
 */
export const tutorSubmit = async (req: Request, res: Response) => {
  try {
    const { minorUserId, tutorUserId, challengeId, tutorConfirmation, pointsDistribution, submissionData } = req.body;
    
    if (!minorUserId || !tutorUserId || !challengeId || !submissionData) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const tutorSubmitUseCase = container.get(TutorSubmit);
    const result = await tutorSubmitUseCase.execute({
      minorUserId,
      tutorUserId,
      challengeId,
      tutorConfirmation,
      pointsDistribution,
      submissionData
    });
    
    return res.status(201).json(result);
  } catch (error: any) {
    console.error('Error submitting as tutor:', error);
    
    if (error.message === 'Challenge not found') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error submitting as tutor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get pending validations
 */
export const getPendingValidations = async (req: Request, res: Response) => {
  try {
    const getPendingValidationsUseCase = container.get(GetPendingValidations);
    const pendingValidations = await getPendingValidationsUseCase.execute();
    
    return res.status(200).json(pendingValidations);
  } catch (error: any) {
    console.error('Error getting pending validations:', error);
    return res.status(500).json({ 
      message: 'Error retrieving pending validations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Validate a submission
 */
export const validateSubmission = async (req: Request, res: Response) => {
  try {
    const { submissionId } = req.params;
    const { validationScore, validationNotes } = req.body;
    const validatedBy = req.user?.userId;
    
    if (!submissionId) {
      return res.status(400).json({ message: 'Submission ID is required' });
    }
    
    
    if (typeof validationScore !== 'number' || validationScore < 0 || validationScore > 100) {
      return res.status(400).json({ message: 'Validation score must be a number between 0 and 100' });
    }
    
    const validateSubmissionUseCase = container.get(ValidateSubmission);
    const result = await validateSubmissionUseCase.execute({
      submissionId,
      validationScore,
      validationNotes
    });
    
    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Error validating submission:', error);
    
    if (error.message === 'Submission not found' || error.message === 'User challenge not found' || error.message === 'Challenge not found') {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Error validating submission',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};