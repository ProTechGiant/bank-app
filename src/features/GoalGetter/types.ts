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

export interface DonutChartProps {
  isVisible: boolean;
  onClose: () => void;
}
export interface HeaderContentProps {
  goalName: string;
  contribution: string;
  duration: string;
}
export interface CircleIconProps {
  color: string;
  text: string;
  percentage: string;
}
export interface DonutChartIconProps {
  data: number[];
}
export interface PieChartProps {
  data: { x: string; y: number }[];
}
