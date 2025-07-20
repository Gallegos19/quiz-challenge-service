import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';

// Quiz Repository interfaces
import { QuizRepository } from '../../domain/repositories/QuizRepository';
import { QuizQuestionRepository } from '../../domain/repositories/QuizQuestionRepository';
import { QuizSessionRepository } from '../../domain/repositories/QuizSessionRepository';
import { QuizAnswerRepository } from '../../domain/repositories/QuizAnswerRepository';
import { QuizAnalyticsRepository } from '../../domain/repositories/QuizAnalyticsRepository';
import { QuestionPerformanceLogRepository } from '../../domain/repositories/QuestionPerformanceLogRepository';

// Challenge Repository interfaces
import { ChallengeRepository } from '../../domain/repositories/ChallengeRepository';
import { UserChallengeRepository } from '../../domain/repositories/UserChallengeRepository';
import { ChallengeSubmissionRepository } from '../../domain/repositories/ChallengeSubmissionRepository';
import { TutorSubmissionRepository } from '../../domain/repositories/TutorSubmissionRepository';

// Quiz Repository implementations
import { QuizPrismaRepository } from '../db/repositories/QuizPrismaRepository';
import { QuizQuestionPrismaRepository } from '../db/repositories/QuizQuestionPrismaRepository';
import { QuizSessionPrismaRepository } from '../db/repositories/QuizSessionPrismaRepository';
import { QuizAnswerPrismaRepository } from '../db/repositories/QuizAnswerPrismaRepository';
import { QuizAnalyticsPrismaRepository } from '../db/repositories/QuizAnalyticsPrismaRepository';
import { QuestionPerformanceLogPrismaRepository } from '../db/repositories/QuestionPerformanceLogPrismaRepository';

// Challenge Repository implementations
import { ChallengePrismaRepository } from '../db/repositories/ChallengePrismaRepository';
import { UserChallengePrismaRepository } from '../db/repositories/UserChallengePrismaRepository';
import { ChallengeSubmissionPrismaRepository } from '../db/repositories/ChallengeSubmissionPrismaRepository';
import { TutorSubmissionPrismaRepository } from '../db/repositories/TutorSubmissionPrismaRepository';

// Quiz Use cases
import { GetQuizzesByTopic } from '../../application/quiz/GetQuizzesByTopic';
import { GetQuizById } from '../../application/quiz/GetQuizById';
import { CreateQuiz } from '../../application/quiz/CreateQuiz';
import { UpdateQuiz } from '../../application/quiz/UpdateQuiz';
import { DeleteQuiz } from '../../application/quiz/DeleteQuiz';
import { PublishQuiz } from '../../application/quiz/PublishQuiz';
import { UnpublishQuiz } from '../../application/quiz/UnpublishQuiz';
import { StartQuizSession } from '../../application/quiz/StartQuizSession';
import { SubmitQuizAnswer } from '../../application/quiz/SubmitQuizAnswer';
import { GetQuizResults } from '../../application/quiz/GetQuizResults';
import { GetUserQuizProgress } from '../../application/quiz/GetUserQuizProgress';
import { TrackQuizInteraction } from '../../application/quiz/TrackQuizInteraction';
import { TrackQuestionPerformance } from '../../application/quiz/TrackQuestionPerformance';
import { CreateQuizQuestion } from '../../application/quiz/CreateQuizQuestion';
import { GetQuizQuestions } from '../../application/quiz/GetQuizQuestions';
import { GetQuestionById } from '../../application/quiz/GetQuestionById';
import { UpdateQuizQuestion } from '../../application/quiz/UpdateQuizQuestion';
import { DeleteQuizQuestion } from '../../application/quiz/DeleteQuizQuestion';
import { AddQuizOption } from '../../application/quiz/AddQuizOption';
import { UpdateQuizOption } from '../../application/quiz/UpdateQuizOption';
import { DeleteQuizOption } from '../../application/quiz/DeleteQuizOption';
import { GetProblematicQuestions } from '../../application/quiz/GetProblematicQuestions';

// Challenge Use cases
import { GetActiveChallenges } from '../../application/challenge/GetActiveChallenges';
import { GetAllChallenges } from '../../application/challenge/GetAllChallenges';
import { JoinChallenge } from '../../application/challenge/JoinChallenge';
import { SubmitChallengeEvidence } from '../../application/challenge/SubmitChallengeEvidence';
import { GetUserChallenges } from '../../application/challenge/GetUserChallenges';
import { TutorSubmit } from '../../application/challenge/TutorSubmit';
import { GetPendingValidations } from '../../application/challenge/GetPendingValidations';
import { ValidateSubmission } from '../../application/challenge/ValidateSubmission';
import { CreateChallenge } from '../../application/challenge/CreateChallenge';
import { UpdateChallenge } from '../../application/challenge/UpdateChallenge';
import { DeleteChallenge } from '../../application/challenge/DeleteChallenge';
import { GetChallengeById } from '../../application/challenge/GetChallengeById';

// Create and configure container
const container = new Container();

// Register Prisma client
const prismaClient = new PrismaClient();
container.bind<PrismaClient>(PrismaClient).toConstantValue(prismaClient);

// Register Quiz repositories
container.bind<QuizRepository>(QuizRepository).to(QuizPrismaRepository);
container.bind<QuizQuestionRepository>(QuizQuestionRepository).to(QuizQuestionPrismaRepository);
container.bind<QuizSessionRepository>(QuizSessionRepository).to(QuizSessionPrismaRepository);
container.bind<QuizAnswerRepository>(QuizAnswerRepository).to(QuizAnswerPrismaRepository);
container.bind<QuizAnalyticsRepository>(QuizAnalyticsRepository).to(QuizAnalyticsPrismaRepository);
container.bind<QuestionPerformanceLogRepository>(QuestionPerformanceLogRepository).to(QuestionPerformanceLogPrismaRepository);

// Register Challenge repositories
container.bind<ChallengeRepository>(ChallengeRepository).to(ChallengePrismaRepository);
container.bind<UserChallengeRepository>(UserChallengeRepository).to(UserChallengePrismaRepository);
container.bind<ChallengeSubmissionRepository>(ChallengeSubmissionRepository).to(ChallengeSubmissionPrismaRepository);
container.bind<TutorSubmissionRepository>(TutorSubmissionRepository).to(TutorSubmissionPrismaRepository);

// Register Quiz use cases
container.bind<GetQuizzesByTopic>(GetQuizzesByTopic).toSelf();
container.bind<GetQuizById>(GetQuizById).toSelf();
container.bind<CreateQuiz>(CreateQuiz).toSelf();
container.bind<UpdateQuiz>(UpdateQuiz).toSelf();
container.bind<DeleteQuiz>(DeleteQuiz).toSelf();
container.bind<PublishQuiz>(PublishQuiz).toSelf();
container.bind<UnpublishQuiz>(UnpublishQuiz).toSelf();
container.bind<StartQuizSession>(StartQuizSession).toSelf();
container.bind<SubmitQuizAnswer>(SubmitQuizAnswer).toSelf();
container.bind<GetQuizResults>(GetQuizResults).toSelf();
container.bind<GetUserQuizProgress>(GetUserQuizProgress).toSelf();
container.bind<TrackQuizInteraction>(TrackQuizInteraction).toSelf();
container.bind<TrackQuestionPerformance>(TrackQuestionPerformance).toSelf();
container.bind<CreateQuizQuestion>(CreateQuizQuestion).toSelf();
container.bind<GetQuizQuestions>(GetQuizQuestions).toSelf();
container.bind<GetQuestionById>(GetQuestionById).toSelf();
container.bind<UpdateQuizQuestion>(UpdateQuizQuestion).toSelf();
container.bind<DeleteQuizQuestion>(DeleteQuizQuestion).toSelf();
container.bind<AddQuizOption>(AddQuizOption).toSelf();
container.bind<UpdateQuizOption>(UpdateQuizOption).toSelf();
container.bind<DeleteQuizOption>(DeleteQuizOption).toSelf();
container.bind<GetProblematicQuestions>(GetProblematicQuestions).toSelf();

// Register Challenge use cases
container.bind<GetActiveChallenges>(GetActiveChallenges).toSelf();
container.bind<GetAllChallenges>(GetAllChallenges).toSelf();
container.bind<JoinChallenge>(JoinChallenge).toSelf();
container.bind<SubmitChallengeEvidence>(SubmitChallengeEvidence).toSelf();
container.bind<GetUserChallenges>(GetUserChallenges).toSelf();
container.bind<TutorSubmit>(TutorSubmit).toSelf();
container.bind<GetPendingValidations>(GetPendingValidations).toSelf();
container.bind<ValidateSubmission>(ValidateSubmission).toSelf();
container.bind<CreateChallenge>(CreateChallenge).toSelf();
container.bind<UpdateChallenge>(UpdateChallenge).toSelf();
container.bind<DeleteChallenge>(DeleteChallenge).toSelf();
container.bind<GetChallengeById>(GetChallengeById).toSelf();

export { container };