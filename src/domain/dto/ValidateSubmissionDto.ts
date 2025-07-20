export interface ValidateSubmissionDto {
  submissionId: string;
  validatedBy: string;
  validationScore: number;
  validationNotes?: string;
}