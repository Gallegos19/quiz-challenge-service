import { injectable, inject } from 'inversify';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';
import { Challenge } from '../../domain/entities/Challenge';

@injectable()
export class GetActiveChallenges {
  constructor(
    @inject(ChallengeRepository) private challengeRepository: ChallengeRepository
  ) {}

  async execute(): Promise<Challenge[]> {
    return this.challengeRepository.getActiveChallenge();
  }
}