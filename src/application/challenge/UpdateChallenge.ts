import { injectable, inject } from 'inversify';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';
import { Challenge } from '../../domain/entities/Challenge';

export interface UpdateChallengeDto {
  title?: string;
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
  updatedBy?: string;
}

@injectable()
export class UpdateChallenge {
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

  async execute(id: string, data: UpdateChallengeDto): Promise<Challenge> {
    // Check if challenge exists
    const challenge = await this.challengeRepository.getChallengeById(id);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Procesar las fechas
    const processedData = {
      ...data,
      startDate: data.startDate ? this.parseDate(data.startDate) : undefined,
      endDate: data.endDate ? this.parseDate(data.endDate) : undefined,
      featuredUntil: data.featuredUntil ? this.parseDate(data.featuredUntil) : undefined,
      updatedAt: new Date()
    };

    // Update challenge
    return this.challengeRepository.updateChallenge(id, processedData);
  }
}