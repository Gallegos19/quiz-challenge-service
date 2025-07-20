import { injectable, inject } from 'inversify';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';
import { UserChallengeRepository } from '../../domain/repositories/UserChallengeRepository';
import { JoinChallengeDto } from '../../domain/dto/JoinChallengeDto';
import { UserChallenge } from '../../domain/entities/UserChallenge';

@injectable()
export class JoinChallenge {
  constructor(
    @inject(ChallengeRepository) private challengeRepository: ChallengeRepository,
    @inject(UserChallengeRepository) private userChallengeRepository: UserChallengeRepository
  ) {}

  async execute(data: JoinChallengeDto): Promise<UserChallenge> {
    // Check if challenge exists
    const challenge = await this.challengeRepository.getChallengeById(data.challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Check if user has already joined this challenge
    const existingUserChallenge = await this.userChallengeRepository.getUserChallengeByUserAndChallenge(
      data.userId,
      data.challengeId
    );

    if (existingUserChallenge) {
      throw new Error('User has already joined this challenge');
    }

    // Check if challenge has reached max participants
    if (challenge.maxParticipants && challenge.currentParticipants >= challenge.maxParticipants) {
      throw new Error('Challenge has reached maximum number of participants');
    }

    // Join challenge
    const userChallenge = await this.userChallengeRepository.joinChallenge(
      data.userId,
      data.challengeId
    );

    // Increment participants count
    await this.challengeRepository.incrementParticipants(data.challengeId);

    return userChallenge;
  }
}