import { Router } from 'express';
import { 
  trackQuizInteraction,
  trackQuestionPerformance,
  getQuizEffectiveness,
  getProblematicQuestions,
  getUserLearningCurve,
  getUsersNeedingHelp
} from '../controllers/analytics.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /track-interaction:
 *   post:
 *     summary: Track quiz interaction
 *     description: Records detailed analytics about a quiz session
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - quizId
 *               - sessionId
 *               - attemptNumber
 *               - finalScorePercentage
 *               - questionsTotal
 *               - questionsCorrect
 *               - passed
 *               - totalTimeSeconds
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               quizId:
 *                 type: string
 *                 format: uuid
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *               attemptNumber:
 *                 type: integer
 *               finalScorePercentage:
 *                 type: number
 *                 format: float
 *               questionsTotal:
 *                 type: integer
 *               questionsCorrect:
 *                 type: integer
 *               passed:
 *                 type: boolean
 *               totalTimeSeconds:
 *                 type: integer
 *               avgTimePerQuestion:
 *                 type: number
 *                 format: float
 *               deviceType:
 *                 type: string
 *               timeOfDay:
 *                 type: string
 *               gaveUp:
 *                 type: boolean
 *               helpUsed:
 *                 type: boolean
 *               postQuizFeeling:
 *                 type: string
 *                 enum: [confident, unsure, frustrated, proud]
 *     responses:
 *       201:
 *         description: Interaction tracked successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/track-interaction', authMiddleware, trackQuizInteraction);

/**
 * @swagger
 * /track-question-performance:
 *   post:
 *     summary: Track question performance
 *     description: Records detailed analytics about a specific question
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionId
 *               - userId
 *               - wasCorrect
 *               - timeTakenSeconds
 *             properties:
 *               questionId:
 *                 type: string
 *                 format: uuid
 *               userId:
 *                 type: string
 *                 format: uuid
 *               wasCorrect:
 *                 type: boolean
 *               timeTakenSeconds:
 *                 type: integer
 *               selectedOptionId:
 *                 type: string
 *                 format: uuid
 *               questionOrder:
 *                 type: integer
 *               userFatigueLevel:
 *                 type: string
 *                 enum: [low, medium, high]
 *               tookLongTime:
 *                 type: boolean
 *               changedAnswer:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Performance tracked successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/track-question-performance', authMiddleware, trackQuestionPerformance);

/**
 * @swagger
 * /effectiveness/{topicId}:
 *   get:
 *     summary: Get quiz effectiveness by topic
 *     description: Retrieves analytics about quiz effectiveness for a specific topic
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: topicId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the topic
 *     responses:
 *       200:
 *         description: Quiz effectiveness data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Server error
 */
router.get('/effectiveness/:topicId', authMiddleware, getQuizEffectiveness);

/**
 * @swagger
 * /problematic-questions:
 *   get:
 *     summary: Get problematic questions
 *     description: Retrieves a list of questions that users find difficult
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of problematic questions
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/problematic-questions', authMiddleware, getProblematicQuestions);

/**
 * @swagger
 * /user-learning-curve/{userId}:
 *   get:
 *     summary: Get user's learning curve
 *     description: Retrieves analytics about a user's learning progress
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User's learning curve data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user-learning-curve/:userId', authMiddleware, getUserLearningCurve);

/**
 * @swagger
 * /needs-help:
 *   get:
 *     summary: Get users needing help
 *     description: Retrieves a list of users who may need additional support
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users needing help
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/needs-help', authMiddleware, getUsersNeedingHelp);

export default router;