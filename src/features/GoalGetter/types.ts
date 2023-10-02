export interface DocumentResponse {
  DocumentName: string;
  DocumentType: string;
  DocumentContent: string;
}
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CustomerGoal {
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
export interface TransactionItem {
  Title: string;
  Date: string;
  Amount: number;
  Status: string;
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
export interface PredefinedGoalNames {
  Predefined: { Id: number; Name: string }[];
}

// TODO: check with BE team goal object type, maybe will be changed, for example roundUP to boolean
export interface GoalGetterContextState {
  goalName: string;
  predefinedGoalName: string;
  targetAmount: number;
  initialContribution: number;
  monthlyContribution?: number;
  recurringDay?: string;
  targetDate?: string;
  riskId: number;
  productId?: string;
  roundUP: "Y" | "N";
  goalImage: string;
  predefinedGoalId: number;
  predefinedGoalDefaultImage?: string;
  startDate?: string;
  otpCode?: string;
  productUnitOfMeasurement?: "Grams" | "SAR";
  setGoalContextState: (newState: Partial<GoalGetterContextState>) => void;
  resetGoalContextState: () => void;
}

export type GoalGetterStateType = Omit<GoalGetterContextState, "setGoalContextState" | "resetGoalContextState">;
