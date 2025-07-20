import { injectable, inject } from 'inversify';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';
import { Challenge } from '../../domain/entities/Challenge';

export interface CreateChallengeDto {
  title: string;
  description?: string;
  instructions?: any;
  category?: string;
  difficulty?: string;
  pointsReward?: number;
  estimatedDurationDays?: number;
  validationType?: string;
  validationCriteria?: any;
  maxParticipants?: number;
  startDate?: Date;
  endDate?: Date;
  isRecurring?: boolean;
  recurrencePattern?: any;
  ageRestrictions?: any;
  featuredUntil?: Date;
  createdBy?: string;
}

@injectable()
export class CreateChallenge {
  constructor(
    @inject(ChallengeRepository) private challengeRepository: ChallengeRepository
  ) {}
  
  private parseDate(date: any): Date | null {
    if (!date) return null;
    
    // Si ya es un objeto Date, devolverlo directamente
    if (date instanceof Date) return date;
    
    // Si es un string, intentar convertirlo a Date
    try {
      return new Date(date);
    } catch (error) {
      console.error('Error parsing date:', error);
      return null;
    }
  }

  async execute(data: CreateChallengeDto): Promise<Challenge> {
    // Transform DTO to repository format
    const challengeData = {
      title: data.title,
      description: data.description || null,
      instructions: data.instructions || {},
      category: data.category || null,
      difficulty: data.difficulty || 'easy',
      pointsReward: data.pointsReward || 50,
      estimatedDurationDays: data.estimatedDurationDays || 7,
      validationType: data.validationType || 'photo',
      validationCriteria: data.validationCriteria || {},
      maxParticipants: data.maxParticipants || null,
      currentParticipants: 0,
      startDate: this.parseDate(data.startDate),
      endDate: this.parseDate(data.endDate),
      isRecurring: data.isRecurring || false,
      recurrencePattern: data.recurrencePattern || {},
      ageRestrictions: data.ageRestrictions || {},
      featuredUntil: this.parseDate(data.featuredUntil),
      createdBy: data.createdBy || null,
      updatedBy: null,
      deletedAt: null
    };

    return this.challengeRepository.createChallenge(challengeData);
  }
}