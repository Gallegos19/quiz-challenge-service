import { injectable, inject } from 'inversify';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { QuizQuestion } from '../../domain/entities/QuizQuestion';
import { CreateQuizOptionDto } from '../../domain/dto/CreateQuizOptionDto';

export interface UpdateQuizQuestionDto {
  questionText?: string;
  questionType?: string;
  explanation?: string;
  pointsValue?: number;
  timeLimitSeconds?: number;
  imageUrl?: string;
  audioUrl?: string;
  sortOrder?: number;
  difficultyWeight?: number;
  updatedBy?: string;
  options?: {
    id?: string;
    optionText: string;
    isCorrect: boolean;
    sortOrder?: number;
    explanation?: string;
  }[];
}

@injectable()
export class UpdateQuizQuestion {
  constructor(
    @inject(QuizQuestionRepository) private questionRepository: QuizQuestionRepository
  ) {}

  async execute(questionId: string, data: UpdateQuizQuestionDto): Promise<QuizQuestion> {
    // Check if question exists
    const question = await this.questionRepository.getQuestionById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    // Update question
    const updatedQuestion = await this.questionRepository.updateQuestion(questionId, {
      questionText: data.questionText,
      questionType: data.questionType,
      explanation: data.explanation,
      pointsValue: data.pointsValue,
      timeLimitSeconds: data.timeLimitSeconds,
      imageUrl: data.imageUrl,
      audioUrl: data.audioUrl,
      sortOrder: data.sortOrder,
      difficultyWeight: data.difficultyWeight,
      updatedBy: data.updatedBy
    });

    // Update options if provided
    if (data.options && data.options.length > 0) {
      // Get existing options
      const existingOptions = await this.questionRepository.getOptionsByQuestionId(questionId);
      
      // Process each option
      for (const optionData of data.options) {
        if (optionData.id) {
          // Update existing option
          const existingOption = existingOptions.find(o => o.id === optionData.id);
          if (existingOption) {
            await this.questionRepository.updateOption(optionData.id, {
              optionText: optionData.optionText,
              isCorrect: optionData.isCorrect,
              sortOrder: optionData.sortOrder,
              explanation: optionData.explanation
            });
          }
        } else {
          // Create new option
          await this.questionRepository.addOption(questionId, {
            optionText: optionData.optionText,
            isCorrect: optionData.isCorrect,
            sortOrder: optionData.sortOrder || 0,
            explanation: optionData.explanation || null
          });
        }
      }
    }

    // Return updated question with options
    return this.questionRepository.getQuestionWithOptions(questionId) as Promise<QuizQuestion>;
  }
}