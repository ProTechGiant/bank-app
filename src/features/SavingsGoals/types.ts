export interface CreateGoalInput {
  GoalName: string;
  GoalAmount: number;
  TargetDate: Date;
  IsRoundupActive: boolean;
  IsNotificationActive: boolean;
}
export interface SavingsPot {
  SavingsPotId: string;
  GoalName: string;
  SavedAmount: number;
  SavingsPots: number;
  TargetDate: string;
  CreatedDate: string;
}
