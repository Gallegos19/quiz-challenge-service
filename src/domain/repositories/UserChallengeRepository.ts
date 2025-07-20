import { UserChallenge } from '../entities/UserChallenge';

export abstract class UserChallengeRepository {
  abstract joinChallenge(userId: string, challengeId: string): Promise<UserChallenge>;
  abstract getUserChallenges(userId: string): Promise<UserChallenge[]>;
  abstract getUserChallengeById(id: string): Promise<UserChallenge | null>;
  abstract getUserChallengeByUserAndChallenge(userId: string, challengeId: string): Promise<UserChallenge | null>;
  abstract updateUserChallenge(id: string, data: Partial<UserChallenge>): Promise<UserChallenge>;
  abstract updateProgress(id: string, progressPercentage: number): Promise<UserChallenge>;
  abstract addPoints(id: string, points: number, isBonus?: boolean): Promise<UserChallenge>;
  abstract completeChallenge(id: string): Promise<UserChallenge>;
  abstract incrementEvidenceCount(id: string): Promise<UserChallenge>;
}