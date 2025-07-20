import { Router } from 'express';
import { 
  createQuizQuestion,
  getQuizQuestions,
  getQuestionById,
  updateQuizQuestion,
  deleteQuizQuestion,
  addQuizOption,
  updateQuizOption,
  deleteQuizOption
} from '../controllers/quizQuestion.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /questions:
 *   post:
 *     summary: Create a new quiz question
 *     description: Creates a new question for a quiz
 *     tags: [Quiz Questions]
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
 *               - questionText
 *             properties:
 *               quizId:
 *                 type: string
 *                 format: uuid
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                 description: ID of the quiz this question belongs to
 *               questionText:
 *                 type: string
 *                 example: "¿Cuál es el planeta más grande del sistema solar?"
 *               questionType:
 *                 type: string
 *                 enum: [multiple_choice, text]
 *                 example: "multiple_choice"
 *               explanation:
 *                 type: string
 *                 example: "Júpiter es el planeta más grande del sistema solar"
 *               pointsValue:
 *                 type: integer
 *                 example: 10
 *               timeLimitSeconds:
 *                 type: integer
 *                 example: 30
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/jupiter.jpg"
 *               audioUrl:
 *                 type: string
 *                 example: ""
 *               sortOrder:
 *                 type: integer
 *                 example: 1
 *               difficultyWeight:
 *                 type: number
 *                 format: float
 *                 example: 1.0
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - optionText
 *                     - isCorrect
 *                   properties:
 *                     optionText:
 *                       type: string
 *                       example: "Júpiter"
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 *                     sortOrder:
 *                       type: integer
 *                       example: 1
 *                     explanation:
 *                       type: string
 *                       example: "Correcto, Júpiter es el planeta más grande"
 *                 example:
 *                   - optionText: "Júpiter"
 *                     isCorrect: true
 *                     sortOrder: 1
 *                     explanation: "Correcto, Júpiter es el planeta más grande"
 *                   - optionText: "Saturno"
 *                     isCorrect: false
 *                     sortOrder: 2
 *                     explanation: "Saturno es el segundo planeta más grande"
 *                   - optionText: "Tierra"
 *                     isCorrect: false
 *                     sortOrder: 3
 *                     explanation: "La Tierra es mucho más pequeña que Júpiter"
 *                   - optionText: "Marte"
 *                     isCorrect: false
 *                     sortOrder: 4
 *                     explanation: "Marte es más pequeño que la Tierra"
 *     responses:
 *       201:
 *         description: Question created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, createQuizQuestion);

/**
 * @swagger
 * /questions/quiz/{quizId}:
 *   get:
 *     summary: Get questions for a quiz
 *     description: Retrieves all questions for a specific quiz
 *     tags: [Quiz Questions]
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the quiz
 *         example: "00836d1c-dc92-4fb4-a21b-c04af5ef1569"
 *     responses:
 *       200:
 *         description: List of questions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   quizId:
 *                     type: string
 *                     format: uuid
 *                   questionText:
 *                     type: string
 *                   questionType:
 *                     type: string
 *                   explanation:
 *                     type: string
 *                   pointsValue:
 *                     type: integer
 *                   timeLimitSeconds:
 *                     type: integer
 *                   imageUrl:
 *                     type: string
 *                   audioUrl:
 *                     type: string
 *                   sortOrder:
 *                     type: integer
 *                   difficultyWeight:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   deletedAt:
 *                     type: string
 *                     format: date-time
 *                     nullable: true
 *                   createdBy:
 *                     type: string
 *                     format: uuid
 *                   updatedBy:
 *                     type: string
 *                     format: uuid
 *                   options:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           format: uuid
 *                         questionId:
 *                           type: string
 *                           format: uuid
 *                         optionText:
 *                           type: string
 *                         isCorrect:
 *                           type: boolean
 *                         sortOrder:
 *                           type: integer
 *                         explanation:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *             example:
 *               - id: "ef325182-70d8-4c18-abd0-bf037762c652"
 *                 quizId: "00836d1c-dc92-4fb4-a21b-c04af5ef1569"
 *                 questionText: "¿Cuál es el planeta más grande del sistema solar? (Actualizado)"
 *                 questionType: "multiple_choice"
 *                 explanation: "Júpiter es el planeta más grande del sistema solar"
 *                 pointsValue: 15
 *                 timeLimitSeconds: 45
 *                 imageUrl: "https://example.com/jupiter-updated.jpg"
 *                 audioUrl: ""
 *                 sortOrder: 2
 *                 difficultyWeight: "1.2"
 *                 createdAt: "2025-07-20T00:24:16.454Z"
 *                 updatedAt: "2025-07-20T00:28:16.059Z"
 *                 deletedAt: null
 *                 createdBy: "00000000-0000-4000-a000-000000000000"
 *                 updatedBy: "00000000-0000-4000-a000-000000000000"
 *                 options:
 *                   - id: "9243ce66-4782-49b2-9a15-16b8b7585279"
 *                     questionId: "ef325182-70d8-4c18-abd0-bf037762c652"
 *                     optionText: "Júpiter"
 *                     isCorrect: true
 *                     sortOrder: 1
 *                     explanation: "Correcto, Júpiter es el planeta más grande"
 *                     createdAt: "2025-07-20T00:24:16.615Z"
 *                     updatedAt: "2025-07-20T00:24:16.615Z"
 *                   - id: "4b5100de-8ae3-47ca-8e38-58137373913b"
 *                     questionId: "ef325182-70d8-4c18-abd0-bf037762c652"
 *                     optionText: "Saturno"
 *                     isCorrect: false
 *                     sortOrder: 2
 *                     explanation: "Saturno es el segundo planeta más grande"
 *                     createdAt: "2025-07-20T00:24:16.775Z"
 *                     updatedAt: "2025-07-20T00:24:16.775Z"
 *                   - id: "746ac04f-74ab-42bb-8281-982922d74e63"
 *                     questionId: "ef325182-70d8-4c18-abd0-bf037762c652"
 *                     optionText: "Tierra"
 *                     isCorrect: false
 *                     sortOrder: 3
 *                     explanation: "La Tierra es mucho más pequeña que Júpiter"
 *                     createdAt: "2025-07-20T00:24:16.850Z"
 *                     updatedAt: "2025-07-20T00:24:16.850Z"
 *                   - id: "570b61ca-c3f2-4426-9123-53a744bd8b7e"
 *                     questionId: "ef325182-70d8-4c18-abd0-bf037762c652"
 *                     optionText: "Marte"
 *                     isCorrect: false
 *                     sortOrder: 4
 *                     explanation: "Marte es más pequeño que la Tierra"
 *                     createdAt: "2025-07-20T00:24:16.850Z"
 *                     updatedAt: "2025-07-20T00:24:16.850Z"
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */
router.get('/quiz/:quizId', getQuizQuestions);

/**
 * @swagger
 * /questions/{questionId}:
 *   get:
 *     summary: Get question by ID
 *     description: Retrieves a question by its ID
 *     tags: [Quiz Questions]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the question
 *     responses:
 *       200:
 *         description: Question details
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.get('/:questionId', getQuestionById);

/**
 * @swagger
 * /questions/{questionId}:
 *   put:
 *     summary: Update a quiz question
 *     description: Updates an existing quiz question
 *     tags: [Quiz Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the question to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               questionText:
 *                 type: string
 *                 example: "¿Cuál es el planeta más grande del sistema solar? (Actualizado)"
 *               questionType:
 *                 type: string
 *                 enum: [multiple_choice, text]
 *                 example: "multiple_choice"
 *               explanation:
 *                 type: string
 *                 example: "Júpiter es el planeta más grande del sistema solar"
 *               pointsValue:
 *                 type: integer
 *                 example: 15
 *               timeLimitSeconds:
 *                 type: integer
 *                 example: 45
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/jupiter-updated.jpg"
 *               audioUrl:
 *                 type: string
 *                 example: ""
 *               sortOrder:
 *                 type: integer
 *                 example: 2
 *               difficultyWeight:
 *                 type: number
 *                 format: float
 *                 example: 1.2
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                     optionText:
 *                       type: string
 *                       example: "Júpiter (Actualizado)"
 *                     isCorrect:
 *                       type: boolean
 *                       example: true
 *                     sortOrder:
 *                       type: integer
 *                       example: 1
 *                     explanation:
 *                       type: string
 *                       example: "Correcto, Júpiter es el planeta más grande"
 *                 example:
 *                   - id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                     optionText: "Júpiter (Actualizado)"
 *                     isCorrect: true
 *                     sortOrder: 1
 *                     explanation: "Correcto, Júpiter es el planeta más grande"
 *                   - id: "4fa85f64-5717-4562-b3fc-2c963f66afa7"
 *                     optionText: "Saturno"
 *                     isCorrect: false
 *                     sortOrder: 2
 *                     explanation: "Saturno es el segundo planeta más grande"
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.put('/:questionId', authMiddleware, updateQuizQuestion);

/**
 * @swagger
 * /questions/{questionId}:
 *   delete:
 *     summary: Delete a quiz question
 *     description: Deletes a quiz question by its ID
 *     tags: [Quiz Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the question to delete
 *     responses:
 *       204:
 *         description: Question deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.delete('/:questionId', authMiddleware, deleteQuizQuestion);

/**
 * @swagger
 * /questions/{questionId}/options:
 *   post:
 *     summary: Add an option to a question
 *     description: Adds a new option to a quiz question
 *     tags: [Quiz Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - optionText
 *               - isCorrect
 *             properties:
 *               optionText:
 *                 type: string
 *                 example: "Neptuno"
 *               isCorrect:
 *                 type: boolean
 *                 example: false
 *               sortOrder:
 *                 type: integer
 *                 example: 5
 *               explanation:
 *                 type: string
 *                 example: "Neptuno es más pequeño que Júpiter"
 *     responses:
 *       201:
 *         description: Option added successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Question not found
 *       500:
 *         description: Server error
 */
router.post('/:questionId/options', authMiddleware, addQuizOption);

/**
 * @swagger
 * /options/{optionId}:
 *   put:
 *     summary: Update a quiz option
 *     description: Updates an existing quiz option
 *     tags: [Quiz Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the option to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               optionText:
 *                 type: string
 *                 example: "Neptuno (Actualizado)"
 *               isCorrect:
 *                 type: boolean
 *                 example: false
 *               sortOrder:
 *                 type: integer
 *                 example: 6
 *               explanation:
 *                 type: string
 *                 example: "Neptuno es más pequeño que Júpiter (Actualizado)"
 *     responses:
 *       200:
 *         description: Option updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/options/:optionId', authMiddleware, updateQuizOption);

/**
 * @swagger
 * /options/{optionId}:
 *   delete:
 *     summary: Delete a quiz option
 *     description: Deletes a quiz option by its ID
 *     tags: [Quiz Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the option to delete
 *     responses:
 *       204:
 *         description: Option deleted successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/options/:optionId', authMiddleware, deleteQuizOption);

export default router;