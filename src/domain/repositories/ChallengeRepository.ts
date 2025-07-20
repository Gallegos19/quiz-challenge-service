import { Challenge } from '../entities/Challenge';

export abstract class ChallengeRepository {
  abstract getActiveChallenge(): Promise<Challenge[]>;
  abstract getAllChallenges(): Promise<Challenge[]>;
  abstract getChallengeById(id: string): Promise<Challenge | null>;
  abstract createChallenge(data: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge>;
  abstract updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge>;
  abstract deleteChallenge(id: string): Promise<void>;
  abstract incrementParticipants(id: string): Promise<Challenge>;
  abstract decrementParticipants(id: string): Promise<Challenge>;
  abstract getChallengesByCategory(category: string): Promise<Challenge[]>;
  abstract getFeaturedChallenges(): Promise<Challenge[]>;
}