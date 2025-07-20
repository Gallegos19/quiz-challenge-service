import { injectable, inject } from 'inversify';
import { UserChallengeRepository } from '../../domain/repositories/UserChallengeRepository';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';
import { UserChallenge } from '../../domain/entities/UserChallenge';

@injectable()
export class GetUserChallenges {
  constructor(
    @inject(UserChallengeRepository) private userChallengeRepository: UserChallengeRepository,
    @inject(ChallengeRepository) private challengeRepository: ChallengeRepository
  ) {}

  async execute(userId: string): Promise<any[]> {
    const userChallenges = await this.userChallengeRepository.getUserChallenges(userId);
    
    // Enrich with challenge details
    const enrichedChallenges = await Promise.all(
      userChallenges.map(async (userChallenge) => {
        const challenge = await this.challengeRepository.getChallengeById(userChallenge.challengeId);
        return {
          ...userChallenge,
          challenge: challenge || { title: 'Unknown Challenge' }
        };
      })
    );
    
    return enrichedChallenges;
  }
}