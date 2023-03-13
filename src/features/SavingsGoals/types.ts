export interface CreateGoalInput {
  GoalName: string;
  GoalAmount: number;
  TargetDate: Date;
  IsRoundupActive: boolean;
  IsNotificationActive: boolean;
}
export interface SavingsPot {
  PotId: string;
  GoalName: string;
  TargetAmount: string;
  SavingsPots: number;
  TargetDate: string;
  CreatedDate: string;
  AvailableBalanceAmount: string;
  AvailableBalanceCurrency: string;
  TargetCurrency: string;
  RoundupFlag: boolean;
  NotificationFlag: boolean;
  CustomerId: string;
  AccountId: string;
  PotStatus: string;
  ClosingDate: string;
}
