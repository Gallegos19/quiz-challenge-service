export interface SubmitQuizAnswerDto {
  sessionId: string;
  questionId: string;
  userId: string;
  selectedOptionId?: string;
  userAnswerText?: string;
  timeTakenSeconds?: number;
  answerConfidence?: number;
}