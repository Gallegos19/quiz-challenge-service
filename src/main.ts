import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { container } from './infrastructure/config/container';
import { setupSwagger } from './infrastructure/config/swagger';

// Import routes
import quizRoutes from './infrastructure/web/routes/quiz.routes';
import quizSessionRoutes from './infrastructure/web/routes/quizSession.routes';
import analyticsRoutes from './infrastructure/web/routes/analytics.routes';
import challengeRoutes from './infrastructure/web/routes/challenge.routes';
import quizQuestionRoutes from './infrastructure/web/routes/quizQuestion.routes';

// Load environment variables
dotenv.config();

// Create Express server
const app = express();
const port = process.env.PORT || 3004;
const apiPrefix = process.env.API_PREFIX || '/api/quiz';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Swagger
setupSwagger(app);

// Routes
app.use(`${apiPrefix}/challenges`, challengeRoutes);
app.use(`${apiPrefix}/session`, quizSessionRoutes);
app.use(`${apiPrefix}/questions`, quizQuestionRoutes);
app.use(`${apiPrefix}/analytics`, analyticsRoutes); // Must be before the wildcard route
app.use(`${apiPrefix}`, quizRoutes); // Esta ruta debe ir al final porque tiene un comodín /:id

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok', service: 'quiz-service' });
});

// Start server
app.listen(port, () => {
  console.log(`Quiz service running on port ${port}`);
  console.log(`API documentation available at http://localhost:${port}/api-docs`);
});

export default app;