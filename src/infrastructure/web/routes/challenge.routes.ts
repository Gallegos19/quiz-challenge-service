import { Router } from "express";
import {
  createChallenge,
  getChallengeById,
  updateChallenge,
  deleteChallenge,
  getActiveChallenges,
  getAllChallenges,
  joinChallenge,
  submitChallengeEvidence,
  getUserChallenges,
  tutorSubmit,
  getPendingValidations,
  validateSubmission,
} from "../controllers/challenge.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /challenges:
 *   post:
 *     summary: Create a new challenge
 *     description: Creates a new challenge with the provided data
 *     tags: [Challenges]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Desafío Ecológico"
 *               description:
 *                 type: string
 *                 example: "Recicla materiales en tu hogar"
 *               instructions:
 *                 type: object
 *                 example: {
 *                   "steps": ["Recolecta materiales reciclables", "Sepáralos por tipo", "Llévalos a un centro de reciclaje"]
 *                 }
 *               category:
 *                 type: string
 *                 example: "Ecología"
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: "easy"
 *               pointsReward:
 *                 type: integer
 *                 example: 100
 *               estimatedDurationDays:
 *                 type: integer
 *                 example: 7
 *               validationType:
 *                 type: string
 *                 enum: [photo, video, text, measurement]
 *                 example: "photo"
 *               validationCriteria:
 *                 type: object
 *                 example: {
 *                   "requiredEvidence": ["Foto de materiales separados", "Foto en el centro de reciclaje"]
 *                 }
 *               maxParticipants:
 *                 type: integer
 *                 example: 100
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-19"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-26"
 *               featuredUntil:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-07-19T14:56:18.534Z"
 *               isRecurring:
 *                 type: boolean
 *                 example: false
 *               recurrencePattern:
 *                 type: object
 *                 example: {}
 *               ageRestrictions:
 *                 type: object
 *                 example: {
 *                   "minAge": 8,
 *                   "maxAge": 18
 *                 }
 *     responses:
 *       201:
 *         description: Challenge created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, createChallenge);

/**
 * @swagger
 * /challenges:
 *   get:
 *     summary: Get all challenges
 *     description: Retrieves all challenges (including inactive ones)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all challenges
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getAllChallenges);

/**
 * @swagger
 * /challenges/active:
 *   get:
 *     summary: Get active challenges
 *     description: Retrieves all currently active challenges
 *     tags: [Challenges]
 *     responses:
 *       200:
 *         description: List of active challenges
 *       500:
 *         description: Server error
 */
router.get("/active", getActiveChallenges);

/**
 * @swagger
 * /challenges/join/{challengeId}:
 *   post:
 *     summary: Join a challenge
 *     description: Allows a user to join a specific challenge. The user ID can be provided in the request body or will be obtained from the authentication token if not provided.
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the challenge to join
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user who wants to join the challenge. If not provided, the user ID from the authentication token will be used.
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *     responses:
 *       201:
 *         description: Successfully joined the challenge
 *       400:
 *         description: Invalid input or challenge has reached maximum participants
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Challenge not found
 *       409:
 *         description: User has already joined this challenge
 *       500:
 *         description: Server error
 */
router.post("/join/:challengeId", authMiddleware, joinChallenge);

/**
 * @swagger
 * /challenges/submit-evidence:
 *   post:
 *     summary: Submit evidence for a challenge
 *     description: Submits evidence for a challenge the user has joined
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userChallengeId
 *             properties:
 *               userChallengeId:
 *                 type: string
 *                 format: uuid
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *               submissionType:
 *                 type: string
 *                 enum: [photo, video, text, measurement]
 *                 example: "photo"
 *               contentText:
 *                 type: string
 *                 example: "Aquí está mi evidencia de reciclaje"
 *               mediaUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]
 *               locationData:
 *                 type: object
 *                 example: {
 *                   "latitude": 19.4326,
 *                   "longitude": -99.1332,
 *                   "locationName": "Centro de Reciclaje"
 *                 }
 *               measurementData:
 *                 type: object
 *                 example: {
 *                   "weight": "5kg",
 *                   "volume": "10L"
 *                 }
 *               metadata:
 *                 type: object
 *                 example: {
 *                   "device": "iPhone 12",
 *                   "appVersion": "1.0.0"
 *                 }
 *     responses:
 *       201:
 *         description: Evidence submitted successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User challenge not found
 *       500:
 *         description: Server error
 */
router.post("/submit-evidence", authMiddleware, submitChallengeEvidence);

/**
 * @swagger
 * /challenges/user-challenges/{userId}:
 *   get:
 *     summary: Get user challenges
 *     description: Retrieves all challenges for a specific user
 *     tags: [Challenges]
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
 *         description: List of user challenges
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/user-challenges/:userId", authMiddleware, getUserChallenges);

/**
 * @swagger
 * /challenges/tutor-submit:
 *   post:
 *     summary: Submit evidence as a tutor for a minor
 *     description: Allows a tutor to submit evidence on behalf of a minor
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - minorUserId
 *               - tutorUserId
 *               - challengeId
 *               - submissionData
 *             properties:
 *               minorUserId:
 *                 type: string
 *                 format: uuid
 *                 example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *               tutorUserId:
 *                 type: string
 *                 format: uuid
 *                 example: "00000000-0000-4000-a000-000000000007"
 *               challengeId:
 *                 type: string
 *                 format: uuid
 *                 example: "61963033-0bcb-4a54-b0c4-056798a4fe6f"
 *               tutorConfirmation:
 *                 type: string
 *                 example: "Confirmo que mi hijo ha completado este desafío"
 *               pointsDistribution:
 *                 type: object
 *                 example: {
 *                   "base": 100,
 *                   "bonus": 20
 *                 }
 *               submissionData:
 *                 type: object
 *                 required:
 *                   - mediaUrls
 *                 properties:
 *                   submissionType:
 *                     type: string
 *                     example: "photo"
 *                   contentText:
 *                     type: string
 *                     example: "Mi hijo ha completado el desafío de reciclaje"
 *                   mediaUrls:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"]
 *                   locationData:
 *                     type: object
 *                     example: {
 *                       "latitude": 19.4326,
 *                       "longitude": -99.1332,
 *                       "locationName": "Centro de Reciclaje"
 *                     }
 *                   measurementData:
 *                     type: object
 *                     example: {
 *                       "weight": "5kg",
 *                       "volume": "10L"
 *                     }
 *                   metadata:
 *                     type: object
 *                     example: {
 *                       "device": "iPhone 12",
 *                       "appVersion": "1.0.0"
 *                     }
 *     responses:
 *       201:
 *         description: Evidence submitted successfully as tutor
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Challenge not found
 *       500:
 *         description: Server error
 */
router.post("/tutor-submit", authMiddleware, tutorSubmit);

/**
 * @swagger
 * /challenges/pending-validation:
 *   get:
 *     summary: Get pending validations
 *     description: Retrieves all submissions pending validation
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending validations
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/pending-validation", authMiddleware, getPendingValidations);

/**
 * @swagger
 * /challenges/validate/{submissionId}:
 *   post:
 *     summary: Validate a submission
 *     description: Validates a challenge submission
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the submission to validate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - validationScore
 *             properties:
 *               validationScore:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 85
 *               validationNotes:
 *                 type: string
 *                 example: "Buena evidencia, pero falta una foto del centro de reciclaje"
 *     responses:
 *       200:
 *         description: Submission validated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Submission, user challenge, or challenge not found
 *       500:
 *         description: Server error
 */
router.post("/validate/:submissionId", authMiddleware, validateSubmission);

/**
 * @swagger
 * /challenges/{id}:
 *   get:
 *     summary: Get challenge by ID
 *     description: Retrieves a challenge by its ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the challenge
 *     responses:
 *       200:
 *         description: Challenge details
 *       404:
 *         description: Challenge not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getChallengeById);

/**
 * @swagger
 * /challenges/{id}:
 *   put:
 *     summary: Update a challenge
 *     description: Updates an existing challenge with the provided data
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the challenge to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Desafío Ecológico Actualizado"
 *               description:
 *                 type: string
 *                 example: "Recicla materiales en tu hogar y escuela"
 *               instructions:
 *                 type: object
 *                 example: {
 *                   "steps": ["Recolecta materiales reciclables", "Sepáralos por tipo", "Llévalos a un centro de reciclaje", "Toma fotos del proceso"]
 *                 }
 *               category:
 *                 type: string
 *                 example: "Ecología"
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: "medium"
 *               pointsReward:
 *                 type: integer
 *                 example: 150
 *               estimatedDurationDays:
 *                 type: integer
 *                 example: 10
 *               validationType:
 *                 type: string
 *                 enum: [photo, video, text, measurement]
 *                 example: "photo"
 *               validationCriteria:
 *                 type: object
 *                 example: {
 *                   "requiredEvidence": ["Foto de materiales separados", "Foto en el centro de reciclaje", "Foto del certificado de reciclaje"]
 *                 }
 *               maxParticipants:
 *                 type: integer
 *                 example: 150
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-20"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-30"
 *               isRecurring:
 *                 type: boolean
 *                 example: true
 *               recurrencePattern:
 *                 type: object
 *                 example: {
 *                   "frequency": "monthly",
 *                   "dayOfMonth": 15
 *                 }
 *               ageRestrictions:
 *                 type: object
 *                 example: {
 *                   "minAge": 10,
 *                   "maxAge": 16
 *                 }
 *               featuredUntil:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-19T14:56:18.534Z"
 *     responses:
 *       200:
 *         description: Challenge updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Challenge not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, updateChallenge);

/**
 * @swagger
 * /challenges/{id}:
 *   delete:
 *     summary: Delete a challenge
 *     description: Deletes a challenge by its ID (soft delete)
 *     tags: [Challenges]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the challenge to delete
 *     responses:
 *       204:
 *         description: Challenge deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Challenge not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deleteChallenge);

export default router;
