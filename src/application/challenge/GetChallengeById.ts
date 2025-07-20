import { injectable, inject } from 'inversify';
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';
import { Challenge } from '../../domain/entities/Challenge';

@injectable()
export class GetChallengeById {
  constructor(
    @inject(ChallengeRepository) private challengeRepository: ChallengeRepository
  ) {}

  async execute(id: string): Promise<Challenge | null> {
    return this.challengeRepository.getChallengeById(id);
  }
}