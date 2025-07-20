import { injectable, inject } from "inversify";
import { QuizRepository } from "../../domain/repositories/QuizRepository";
import { CreateQuizDto } from "../../domain/dto/CreateQuizDto";
import { Quiz } from "../../domain/entities/Quiz";

@injectable()
export class CreateQuiz {
  constructor(@inject(QuizRepository) private quizRepository: QuizRepository) {}

  async execute(data: CreateQuizDto): Promise<Quiz> {
    // Transform DTO to repository format
    const quizData = {
      title: data.title,
      description: data.description || null,
      topicId: data.topicId,
      difficultyLevel: data.difficultyLevel || "easy",
      targetAgeMin: data.targetAgeMin || 8,
      targetAgeMax: data.targetAgeMax || 18,
      timeLimitMinutes: data.timeLimitMinutes || 10,
      questionsCount: 0, // Will be updated when questions are added
      passPercentage: data.passPercentage || 70,
      maxAttempts: data.maxAttempts || 3,
      pointsReward: data.pointsReward || 50,
      requiresContentCompletion: data.requiresContentCompletion || false,
      requiredContentIds: data.requiredContentIds || [],
      isPublished: data.isPublished || false,
      createdBy: data.createdBy || null,
      updatedBy: null,
      deletedAt: null,
    };

    return this.quizRepository.createQuiz(quizData);
  }
}
