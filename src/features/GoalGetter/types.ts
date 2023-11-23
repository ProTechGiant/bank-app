export interface DocumentResponse {
  TermsAndConditions: string;
}
export interface GoalBalanceAndContributionResponse {
  AvailableContribution: number;
  RecommendedMonthlyContribution: number;
  UnitOfMeasurement: "Grams" | "SAR";
}
export interface GoalBalanceAndContribution {
  productId?: string;
  targetAmount: number;
  targetDate?: string;
}

export interface GoalRoundUpStatus {
  Status: "ENABLED" | "DISABLED";
}

export interface GoalRoundUpStatusResponse {
  Status: string;
}
export interface Goal {
  GoalId: number;
  Name: string;
  TargetDate: string;
  TargetAmount: number;
  ProductRisk: string;
  ProductRiskColor: string;
  ProductName: string;
  CurrentBalance?: number;
  Image: string;
  ProductColor: string;
  GoalPercentageStatus?: number;
  ShortFallStatus: string;
  ShortFallValue?: number;
  FetchingStatus?: string;
  Status: string;
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
export interface PredefinedOptions {
  Predefined: PredefinedOption[];
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

export interface Product {
  ProductName: string;
  ProductType: "SAVING_POT" | "GOLD" | "LOW_RISK_MUTUAL_FUND" | "MEDIUM_RISK_MUTUAL_FUND" | "HIGH_RISK_MUTUAL_FUND";
  ProductRisk: string;
  ProductColor: string;
  ProductRiskColor: string;
  Duration: number;
  UnitOfMeasurement: "Grams" | "SAR";
  MonthlyContribution?: number;
  MinimumInitial?: number;
  MinimumMonthly?: number;
  MinimumContribution?: number;
  Description: string;
  Availability: "Y" | "N";
  Rating: string;
  FetchStatus: "SUCCESS" | "FAILURE";
  ProductId: number;
}

export interface ImageGalleryResponse {
  Gallery: Gallery[];
}

export interface Gallery {
  ImageId: string;
  ImageURL: string;
}
// TODO: check with BE team goal object type, maybe will be changed, for example roundUP to boolean
export interface GoalGetterContextState {
  GoalName: string;
  ProductName: string;
  TargetAmount?: number;
  MonthlyContribution?: number;
  InitialContribution?: number;
  TargetDate: string;
  RiskId?: number;
  ProductId?: number;
  GoalImage?: unknown; // TODO will need to add image type when we  integrate with api
  UploadGoalImage?: string;
  RecurringContribution?: number;
  RecurringAmount?: number;
  RecurringFrequency?: "Monthly" | "Weekly";
  RecurringDate?: string;
  ContributionMethod?: string;
  ProductType: string;
  Duration?: number;
  ValidCalculation: boolean;
  ProductAvailable: boolean;
  setGoalContextState: (newState: Partial<GoalGetterContextState>) => void;
  resetGoalContextState: () => void;
}
export interface GoalSetting {
  MinimumTargetAmount: number;
  MaximumTargetAmount: number;
  MinimumDuration: number;
  MaximumDuration: number;
  MinimumMonthlyAmount: number;
  MaximumMonthlyAmount: number;
  DatePicker: string;
}
export interface Distribution {
  Name: number;
  Amount: number;
  Percentage: number;
  Icon: number;
}
export interface MutualFund {
  Name: string;
  Ytd: number;
  UnitPrice: number;
  SubscriptionFee: number;
  MinimumSubscription: number;
  InvestmentAmount: number;
  Distribution: Distribution[];
}
export interface SavingPotCategoryId {
  DescriptionId: string;
}
export type GoalGetterStateType = Omit<GoalGetterContextState, "setGoalContextState" | "resetGoalContextState">;

export interface GoalGetterProduct {
  ProductName: string;
  ProductType: string;
  Available: string;
  Description: string;
  ProductId: number;
  ProductInfoUrl: string;
  ProfitPercentage?: number;
}

export interface GoalGetterRisk {
  Id: number;
  Name: string;
  Icon: string;
  Description: string;
  Products: GoalGetterProduct[];
}

export interface GoalGetterProductResponse {
  TargetAmount: number;
  Duration: number;
  MonthlyContribution: number;
  BestMatchRisk: number;
  Variable: string;
  ValidCalculation: boolean;
  Risks: GoalGetterRisk[];
}

export enum ProductTypeName {
  SAVING_POT = "SAVING_POT",
  GOLD = "GOLD",
  LOW_RISK_MUTUAL_FUND = "LOW_RISK_MUTUAL_FUND",
  MEDIUM_RISK_MUTUAL_FUND = "MEDIUM_RISK_MUTUAL_FUND",
  HIGH_RISK_MUTUAL_FUND = "HIGH_RISK_MUTUAL_FUND",
}

export interface GoalCardType {
  name: string;
  percentage: number;
  totalAmount: number;
  dueDate: Date;
  imageUri: string;
}

export interface PendingGoalCardType {
  name: string;
  total: number;
  completed: number;
  type: ProductTypeName;
}

export interface GetProductContributionResponse {
  MinimumInitial?: number;
  MinimumMonthly?: number;
  AvailableContribution?: number;
  MinimumContribution?: number;
}
