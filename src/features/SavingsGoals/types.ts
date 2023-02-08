export interface CreateGoalInput {
  GoalName: string;
  GoalAmount: number;
  TargetDate: Date;
  IsRoundupActive: boolean;
  IsNotificationActive: boolean;
}
