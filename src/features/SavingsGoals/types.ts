export interface CreateGoalInput {
  GoalName: string;
  GoalAmount: number;
  TargetDate: Date;
  IsRoundupActive: boolean;
  IsNotificationActive: boolean;
}
export interface SavingsGoals {
  SavingsPots:
    | [
        {
          SavingsPotId: string;
          GoalName: string;
          SavedAmount: number;
          SavingsPots: number;
          TargetDate: string;
        }
      ];
}
