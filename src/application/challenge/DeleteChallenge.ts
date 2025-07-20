import { injectable, inject } from 'inversify';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';

@injectable()
export class DeleteChallenge {
  constructor(
    @inject(ChallengeRepository) private challengeRepository: ChallengeRepository
  ) {}

  async execute(id: string): Promise<void> {
    // Check if challenge exists
    const challenge = await this.challengeRepository.getChallengeById(id);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Delete challenge (soft delete)
    await this.challengeRepository.deleteChallenge(id);
  }
}