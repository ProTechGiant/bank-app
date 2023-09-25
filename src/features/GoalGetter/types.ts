interface Goal {
  GoalId: number;
  GoalName: string;
  TargetDate: string;
  TargetAmount: number;
  ProductRisk: string;
  ProductRiskColor: string;
  ProductName: string;
  CurrentBalance: number;
  Image: string;
  ProductColor: string;
  GoalPercentageStatus: number;
  ShortFallStatus: string;
  ShortFallValue: number;
}
export interface CustomerGoal {
  Goals: Goal[];
  CreationGoalAvailability: string;
}
export interface PredefinedOption {
  Id: number;
  Name: string;
  Description?: string;
  Default_Image?: string;
  Icon: string;
}
export interface PredefinedOptionOptions {
  predefinedOptions: PredefinedOption[];
}
