import { Router } from 'express';
import { 
  getQuizzesByTopic,
  createQuiz,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  publishQuiz,
  unpublishQuiz
} from '../controllers/quiz.controller';
import { startQuizSession, submitQuizAnswer } from '../controllers/quizSession.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /by-topic/{topicId}:
 *   get:
 *     summary: Get quizzes by topic
 *     description: Retrieves all quizzes associated with a specific topic
 *     tags: [Quizzes]
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
 *         description: List of quizzes
 *       404:
 *         description: Topic not found
 *       500:
 *         description: Server error
 */
router.get('/by-topic/:topicId', getQuizzesByTopic);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get quiz by ID
 *     description: Retrieves a quiz by its ID
 *     tags: [Quizzes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the quiz
 *     responses:
 *       200:
 *         description: Quiz details
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getQuizById);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new quiz
 *     description: Creates a new quiz with the provided data
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - topicId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Ciencias Naturales"
 *               description:
 *                 type: string
 *                 example: "Quiz sobre conceptos básicos de ciencias naturales"
 *               topicId:
 *                 type: string
 *                 format: uuid
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *               difficultyLevel:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: "easy"
 *               targetAgeMin:
 *                 type: integer
 *                 example: 8
 *               targetAgeMax:
 *                 type: integer
 *                 example: 12
 *               timeLimitMinutes:
 *                 type: integer
 *                 example: 15
 *               passPercentage:
 *                 type: integer
 *                 example: 70
 *               maxAttempts:
 *                 type: integer
 *                 example: 3
 *               pointsReward:
 *                 type: integer
 *                 example: 50
 *               requiresContentCompletion:
 *                 type: boolean
 *                 example: false
 *               requiredContentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: []
 *               isPublished:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, createQuiz);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a quiz
 *     description: Updates an existing quiz with the provided data
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the quiz to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Ciencias Naturales Actualizado"
 *               description:
 *                 type: string
 *                 example: "Quiz actualizado sobre ciencias naturales"
 *               difficultyLevel:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: "medium"
 *               targetAgeMin:
 *                 type: integer
 *                 example: 10
 *               targetAgeMax:
 *                 type: integer
 *                 example: 14
 *               timeLimitMinutes:
 *                 type: integer
 *                 example: 20
 *               passPercentage:
 *                 type: integer
 *                 example: 75
 *               maxAttempts:
 *                 type: integer
 *                 example: 2
 *               pointsReward:
 *                 type: integer
 *                 example: 60
 *               requiresContentCompletion:
 *                 type: boolean
 *                 example: true
 *               requiredContentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["3fa85f64-5717-4562-b3fc-2c963f66afa6"]
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, updateQuiz);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a quiz
 *     description: Deletes a quiz by its ID
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the quiz to delete
 *     responses:
 *       204:
 *         description: Quiz deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, deleteQuiz);

/**
 * @swagger
 * /{id}/publish:
 *   put:
 *     summary: Publish a quiz
 *     description: Publishes a quiz, making it available to users
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the quiz to publish
 *     responses:
 *       200:
 *         description: Quiz published successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.put('/:id/publish', authMiddleware, publishQuiz);

/**
 * @swagger
 * /{id}/unpublish:
 *   put:
 *     summary: Unpublish a quiz
 *     description: Unpublishes a quiz, making it unavailable to users
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the quiz to unpublish
 *     responses:
 *       200:
 *         description: Quiz unpublished successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.put('/:id/unpublish', authMiddleware, unpublishQuiz);

/**
 * @swagger
 * /start:
 *   post:
 *     summary: Start a new quiz session
 *     description: Initiates a new quiz session for a user
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quizId
 *               - userId
 *             properties:
 *               quizId:
 *                 type: string
 *                 format: uuid
 *                 example: "00836d1c-dc92-4fb4-a21b-c04af5ef1569"
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "ac537f35-7eda-4e6d-a72f-4ca855299b63"
 *           example:
 *             quizId: "00836d1c-dc92-4fb4-a21b-c04af5ef1569"
 *             userId: "ac537f35-7eda-4e6d-a72f-4ca855299b63"
 *     responses:
 *       201:
 *         description: Quiz session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 quizId:
 *                   type: string
 *                   format: uuid
 *                 sessionToken:
 *                   type: string
 *                   format: uuid
 *                 questionsTotal:
 *                   type: integer
 *                 questionsAnswered:
 *                   type: integer
 *                 questionsCorrect:
 *                   type: integer
 *                 pointsEarned:
 *                   type: integer
 *                 percentageScore:
 *                   type: string
 *                 timeTakenSeconds:
 *                   type: integer
 *                   nullable: true
 *                 status:
 *                   type: string
 *                 passed:
 *                   type: boolean
 *                   nullable: true
 *                 startedAt:
 *                   type: string
 *                   format: date-time
 *                 completedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *             example:
 *               id: "9a1bacd1-d0c0-4b0c-97be-529c978588a7"
 *               userId: "ac537f35-7eda-4e6d-a72f-4ca855299b63"
 *               quizId: "00836d1c-dc92-4fb4-a21b-c04af5ef1569"
 *               sessionToken: "be0fea43-7564-4a9f-8998-a466d786bff5"
 *               questionsTotal: 1
 *               questionsAnswered: 0
 *               questionsCorrect: 0
 *               pointsEarned: 0
 *               percentageScore: "0"
 *               timeTakenSeconds: null
 *               status: "started"
 *               passed: null
 *               startedAt: "2025-07-20T01:37:00.796Z"
 *               completedAt: null
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.post('/start', authMiddleware, startQuizSession);

/**
 * @swagger
 * /submit-answer:
 *   post:
 *     summary: Submit an answer for a quiz question
 *     description: Submits a user's answer for a quiz question
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *               - questionId
 *               - userId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 format: uuid
 *                 example: "9a1bacd1-d0c0-4b0c-97be-529c978588a7"
 *               questionId:
 *                 type: string
 *                 format: uuid
 *                 example: "ef325182-70d8-4c18-abd0-bf037762c652"
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: "ac537f35-7eda-4e6d-a72f-4ca855299b63"
 *               selectedOptionId:
 *                 type: string
 *                 format: uuid
 *                 example: "9243ce66-4782-49b2-9a15-16b8b7585279"
 *               userAnswerText:
 *                 type: string
 *               timeTakenSeconds:
 *                 type: integer
 *                 example: 10
 *               answerConfidence:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *           example:
 *             sessionId: "9a1bacd1-d0c0-4b0c-97be-529c978588a7"
 *             questionId: "ef325182-70d8-4c18-abd0-bf037762c652"
 *             userId: "ac537f35-7eda-4e6d-a72f-4ca855299b63"
 *             selectedOptionId: "9243ce66-4782-49b2-9a15-16b8b7585279"
 *             timeTakenSeconds: 10
 *             answerConfidence: 5
 *     responses:
 *       200:
 *         description: Answer submitted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session or question not found
 *       500:
 *         description: Server error
 */
router.post('/submit-answer', authMiddleware, submitQuizAnswer);

export default router;