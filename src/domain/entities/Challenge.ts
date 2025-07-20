export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  instructions: any;
  category: string | null;
  difficulty: string;
  pointsReward: number;
  estimatedDurationDays: number;
  validationType: string;
  validationCriteria: any;
  maxParticipants: number | null;
  currentParticipants: number;
  startDate: Date | null;
  endDate: Date | null;
  isRecurring: boolean;
  recurrencePattern: any;
  ageRestrictions: any;
  featuredUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string | null;
  updatedBy: string | null;
}