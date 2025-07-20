import { Router } from "express";
import {
  startQuizSession,
  submitQuizAnswer,
  getQuizResults,
  getUserQuizProgress,
} from "../controllers/quizSession.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// El endpoint /start se ha movido a las rutas de quiz para una URL más intuitiva
// Ahora está disponible en /api/quiz/start

/**
 * @swagger
 * /submit-answer:
 *   post:
 *     summary: Submit an answer for a quiz question
 *     description: Submits a user's answer for a quiz question
 *     tags: [Quiz Sessions]
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
router.post("/submit-answer", authMiddleware, submitQuizAnswer);

/**
 * @swagger
 * /results/{sessionId}:
 *   get:
 *     summary: Get quiz session results
 *     description: Retrieves the results of a completed quiz session
 *     tags: [Quiz Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the quiz session
 *         example: "9a1bacd1-d0c0-4b0c-97be-529c978588a7"
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the user who owns the session
 *         example: "ac537f35-7eda-4e6d-a72f-4ca855299b63"
 *     responses:
 *       200:
 *         description: Quiz session results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sessionId:
 *                   type: string
 *                   format: uuid
 *                 quizId:
 *                   type: string
 *                   format: uuid
 *                 quizTitle:
 *                   type: string
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 status:
 *                   type: string
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
 *                 passed:
 *                   type: boolean
 *                 timeTakenSeconds:
 *                   type: integer
 *                 startedAt:
 *                   type: string
 *                   format: date-time
 *                 completedAt:
 *                   type: string
 *                   format: date-time
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       questionId:
 *                         type: string
 *                         format: uuid
 *                       questionText:
 *                         type: string
 *                       questionType:
 *                         type: string
 *                       explanation:
 *                         type: string
 *                       pointsValue:
 *                         type: integer
 *                       options:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             text:
 *                               type: string
 *                             isCorrect:
 *                               type: boolean
 *                             explanation:
 *                               type: string
 *                       userAnswer:
 *                         type: object
 *                         properties:
 *                           selectedOptionId:
 *                             type: string
 *                             format: uuid
 *                           userAnswerText:
 *                             type: string
 *                             nullable: true
 *                           isCorrect:
 *                             type: boolean
 *                           pointsEarned:
 *                             type: integer
 *             example:
 *               sessionId: "9a1bacd1-d0c0-4b0c-97be-529c978588a7"
 *               quizId: "00836d1c-dc92-4fb4-a21b-c04af5ef1569"
 *               quizTitle: "Ciencias Naturales"
 *               userId: "ac537f35-7eda-4e6d-a72f-4ca855299b63"
 *               status: "completed"
 *               questionsTotal: 1
 *               questionsAnswered: 1
 *               questionsCorrect: 1
 *               pointsEarned: 15
 *               percentageScore: "100"
 *               passed: true
 *               timeTakenSeconds: 10
 *               startedAt: "2025-07-20T01:37:00.796Z"
 *               completedAt: "2025-07-20T01:43:47.327Z"
 *               questions: [
 *                 {
 *                   questionId: "ef325182-70d8-4c18-abd0-bf037762c652",
 *                   questionText: "¿Cuál es el planeta más grande del sistema solar? (Actualizado)",
 *                   questionType: "multiple_choice",
 *                   explanation: "Júpiter es el planeta más grande del sistema solar",
 *                   pointsValue: 15,
 *                   options: [
 *                     {
 *                       id: "9243ce66-4782-49b2-9a15-16b8b7585279",
 *                       text: "Júpiter",
 *                       isCorrect: true,
 *                       explanation: "Correcto, Júpiter es el planeta más grande"
 *                     },
 *                     {
 *                       id: "4b5100de-8ae3-47ca-8e38-58137373913b",
 *                       text: "Saturno",
 *                       isCorrect: false,
 *                       explanation: "Saturno es el segundo planeta más grande"
 *                     },
 *                     {
 *                       id: "746ac04f-74ab-42bb-8281-982922d74e63",
 *                       text: "Tierra",
 *                       isCorrect: false,
 *                       explanation: "La Tierra es mucho más pequeña que Júpiter"
 *                     },
 *                     {
 *                       id: "570b61ca-c3f2-4426-9123-53a744bd8b7e",
 *                       text: "Marte",
 *                       isCorrect: false,
 *                       explanation: "Marte es más pequeño que la Tierra"
 *                     }
 *                   ],
 *                   userAnswer: {
 *                     selectedOptionId: "9243ce66-4782-49b2-9a15-16b8b7585279",
 *                     userAnswerText: null,
 *                     isCorrect: true,
 *                     pointsEarned: 15
 *                   }
 *                 }
 *               ]
 *       400:
 *         description: Missing required parameters
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User ID does not match session user ID
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.get("/results/:sessionId", authMiddleware, getQuizResults);

/**
 * @swagger
 * /user-progress/{userId}:
 *   get:
 *     summary: Get user's quiz progress
 *     description: Retrieves a user's progress across all quizzes
 *     tags: [Quiz Sessions]
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
 *         description: User's quiz progress
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get("/user-progress/:userId", authMiddleware, getUserQuizProgress);

export default router;
