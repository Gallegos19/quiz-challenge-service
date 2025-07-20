import { injectable, inject } from 'inversify';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';
import { UserChallengeRepository } from '../../domain/repositories/UserChallengeRepository';
import { ChallengeSubmissionRepository } from '../../domain/repositories/ChallengeSubmissionRepository';
import { TutorSubmissionRepository } from '../../domain/repositories/TutorSubmissionRepository';
import { TutorSubmitDto } from '../../domain/dto/TutorSubmitDto';

@injectable()
export class TutorSubmit {
  constructor(
    @inject(ChallengeRepository) private challengeRepository: ChallengeRepository,
    @inject(UserChallengeRepository) private userChallengeRepository: UserChallengeRepository,
    @inject(ChallengeSubmissionRepository) private submissionRepository: ChallengeSubmissionRepository,
    @inject(TutorSubmissionRepository) private tutorSubmissionRepository: TutorSubmissionRepository
  ) {}

  async execute(data: TutorSubmitDto): Promise<any> {
    // Check if challenge exists
    const challenge = await this.challengeRepository.getChallengeById(data.challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Check if user has already joined this challenge
    let userChallenge = await this.userChallengeRepository.getUserChallengeByUserAndChallenge(
      data.minorUserId,
      data.challengeId
    );

    // If not, join the challenge
    if (!userChallenge) {
      userChallenge = await this.userChallengeRepository.joinChallenge(
        data.minorUserId,
        data.challengeId
      );
      
      // Increment participants count
      await this.challengeRepository.incrementParticipants(data.challengeId);
    }

    // Create submission
    const submission = await this.submissionRepository.createSubmission({
      userChallengeId: userChallenge.id,
      submissionType: data.submissionData.submissionType || 'photo',
      contentText: data.submissionData.contentText || null,
      mediaUrls: data.submissionData.mediaUrls || [],
      locationData: data.submissionData.locationData || {},
      measurementData: data.submissionData.measurementData || {},
      metadata: data.submissionData.metadata || {},
      validationStatus: 'pending',
      validationScore: null,
      validationNotes: null,
      validatedBy: null,
      validatedAt: null,
      autoValidationData: {},
      submissionNumber: 1
    });

    // Update user challenge
    await this.userChallengeRepository.incrementEvidenceCount(userChallenge.id);
    
    // If this is the first submission, update status to 'in_progress'
    if (userChallenge.status === 'joined') {
      await this.userChallengeRepository.updateUserChallenge(userChallenge.id, {
        status: 'in_progress',
        startedAt: new Date()
      });
    }

    // Create tutor submission
    const tutorSubmission = await this.tutorSubmissionRepository.createTutorSubmission({
      minorUserId: data.minorUserId,
      tutorUserId: data.tutorUserId,
      challengeId: data.challengeId,
      submissionId: submission.id,
      tutorConfirmation: data.tutorConfirmation || null,
      pointsDistribution: data.pointsDistribution || {}
    });

    return {
      userChallenge,
      submission,
      tutorSubmission
    };
  }
}