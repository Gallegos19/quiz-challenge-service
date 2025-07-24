import { injectable, inject } from 'inversify';
import { ChallengeSubmissionRepository } from '../../domain/repositories/ChallengeSubmissionRepository';
import { UserChallengeRepository } from '../../domain/repositories/UserChallengeRepository';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';
import { ValidateSubmissionDto } from '../../domain/dto/ValidateSubmissionDto';

@injectable()
export class ValidateSubmission {
  constructor(
    @inject(ChallengeSubmissionRepository) private submissionRepository: ChallengeSubmissionRepository,
    @inject(UserChallengeRepository) private userChallengeRepository: UserChallengeRepository,
    @inject(ChallengeRepository) private challengeRepository: ChallengeRepository
  ) {}

  async execute(data: ValidateSubmissionDto): Promise<any> {
    // Get submission
    const submission = await this.submissionRepository.getSubmissionById(data.submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }

    // Validate submission
    const validatedSubmission = await this.submissionRepository.validateSubmission(
      data.submissionId,
      data.validationScore,
      data.validationNotes
    );

    // Get user challenge
    const userChallenge = await this.userChallengeRepository.getUserChallengeById(submission.userChallengeId);
    if (!userChallenge) {
      throw new Error('User challenge not found');
    }

    // Get challenge
    const challenge = await this.challengeRepository.getChallengeById(userChallenge.challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Calculate points based on validation score
    const pointsEarned = Math.round((data.validationScore / 100) * challenge.pointsReward);

    // Update user challenge with points
    await this.userChallengeRepository.addPoints(userChallenge.id, pointsEarned);

    // Check if challenge should be completed
    // This is a simplified logic - you might want to add more complex completion criteria
    if (data.validationScore >= 70) {
      await this.userChallengeRepository.updateUserChallenge(userChallenge.id, {
        status: 'completed',
        completedAt: new Date(),
        progressPercentage: 100
      });
    } else {
      // Update progress based on validation score
      await this.userChallengeRepository.updateProgress(userChallenge.id, data.validationScore);
    }

    return {
      submission: validatedSubmission,
      pointsEarned,
      userChallenge: await this.userChallengeRepository.getUserChallengeById(userChallenge.id)
    };
  }
}