import { injectable, inject } from 'inversify';
import { UserChallengeRepository } from '../../domain/repositories/UserChallengeRepository';
import { ChallengeSubmissionRepository } from '../../domain/repositories/ChallengeSubmissionRepository';
import { SubmitChallengeEvidenceDto } from '../../domain/dto/SubmitChallengeEvidenceDto';
import { ChallengeSubmission } from '../../domain/entities/ChallengeSubmission';

@injectable()
export class SubmitChallengeEvidence {
  constructor(
    @inject(UserChallengeRepository) private userChallengeRepository: UserChallengeRepository,
    @inject(ChallengeSubmissionRepository) private submissionRepository: ChallengeSubmissionRepository
  ) {}

  async execute(data: SubmitChallengeEvidenceDto): Promise<ChallengeSubmission> {
    // Check if user challenge exists
    const userChallenge = await this.userChallengeRepository.getUserChallengeById(data.userChallengeId);
    if (!userChallenge) {
      throw new Error('User challenge not found');
    }

    // Get existing submissions to determine submission number
    const existingSubmissions = await this.submissionRepository.getSubmissionsByUserChallenge(data.userChallengeId);
    const submissionNumber = existingSubmissions.length + 1;

    // Create submission
    const submission = await this.submissionRepository.createSubmission({
      userChallengeId: data.userChallengeId,
      submissionType: data.submissionType || 'photo',
      contentText: data.contentText || null,
      mediaUrls: data.mediaUrls || [],
      locationData: data.locationData || {},
      measurementData: data.measurementData || {},
      metadata: data.metadata || {},
      validationStatus: 'pending',
      validationScore: null,
      validationNotes: null,
      validatedBy: null,
      validatedAt: null,
      autoValidationData: {},
      submissionNumber
    });

    // Update user challenge
    await this.userChallengeRepository.incrementEvidenceCount(data.userChallengeId);
    
    // If this is the first submission, update status to 'in_progress'
    if (submissionNumber === 1 && userChallenge.status === 'joined') {
      await this.userChallengeRepository.updateUserChallenge(data.userChallengeId, {
        status: 'in_progress',
        startedAt: new Date()
      });
    }

    return submission;
  }
}