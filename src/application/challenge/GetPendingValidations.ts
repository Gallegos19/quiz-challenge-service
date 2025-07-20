import { injectable, inject } from 'inversify';
import { ChallengeSubmissionRepository } from '../../domain/repositories/ChallengeSubmissionRepository';
import { UserChallengeRepository } from '../../domain/repositories/UserChallengeRepository';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';

@injectable()
export class GetPendingValidations {
  constructor(
    @inject(ChallengeSubmissionRepository) private submissionRepository: ChallengeSubmissionRepository,
    @inject(UserChallengeRepository) private userChallengeRepository: UserChallengeRepository,
    @inject(ChallengeRepository) private challengeRepository: ChallengeRepository
  ) {}

  async execute(): Promise<any[]> {
    const pendingSubmissions = await this.submissionRepository.getPendingValidations();
    
    // Enrich with user challenge and challenge details
    const enrichedSubmissions = await Promise.all(
      pendingSubmissions.map(async (submission) => {
        const userChallenge = await this.userChallengeRepository.getUserChallengeById(submission.userChallengeId);
        
        if (!userChallenge) {
          return {
            ...submission,
            userChallenge: { userId: 'Unknown' },
            challenge: { title: 'Unknown Challenge' }
          };
        }
        
        const challenge = await this.challengeRepository.getChallengeById(userChallenge.challengeId);
        
        return {
          ...submission,
          userChallenge,
          challenge: challenge || { title: 'Unknown Challenge' }
        };
      })
    );
    
    return enrichedSubmissions;
  }
}