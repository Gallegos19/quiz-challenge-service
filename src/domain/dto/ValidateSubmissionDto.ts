export interface ValidateSubmissionDto {
  submissionId: string;
  validationScore: number;
  validationNotes?: string;
}