export type FundingType = "recurring-payments" | "one-off-payment" | "recommended-payment";

export interface CreateGoalInput {
  GoalName: string;
  TargetAmount: number;
  TargetDate: Date;
  RoundupFlag: boolean;
  NotificationFlag: boolean;
}

export interface EditGoalInput {
  GoalName: string;
  TargetAmount: number;
  TargetDate: Date;
  NotificationFlag: boolean;
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

export interface SavingsPotDetailsResponse {
  PotId: string;
  GoalName: string;
  TargetAmount: string;
  TargetCurrency: string;
  TargetDate: string;
  CreatedDate: string;
  RoundupFlag: boolean;
  NotificationFlag: boolean;
  CustomerId: string;
  AccountId: string;
  AvailableBalanceAmount: string;
  AvailableBalanceCurrency: string;
  PotStatus: string;
}
