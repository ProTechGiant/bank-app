import { MeasureUnitEnum } from "@/types/GoldTransactions";

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
  ProductType: ProductTypeName;
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
  Status: GoalStatusEnum;
  TimeLeft: string;
  AmountLeft: number;
  InvestedAmount: number;
  AvailableBalanceAmount?: number;
  TotalBalance: number;
  WalletId: string;
  TotalFixedWeight: number;
  PendingTask?: number;
  PendingContribution?: {
    Initial: number;
    RecurringContribution: number;
    RecurringFrequency: string;
  };
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
  MUTUAL_FUND = "MUTUAL_FUND",
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

export type RecommendationType =
  | {
      type: RecommendationTypeEnum.DATE;
      original: Date;
      recommended: Date;
    }
  | {
      type: RecommendationTypeEnum.AMOUNT;
      original: number;
      recommended: number;
    }
  | {
      type: unknown;
      original: unknown;
      recommended: undefined;
    };

export enum RecommendationTypeEnum {
  DATE = "Date",
  AMOUNT = "amount",
}

export interface GetProductDefaultsResponse {
  DefaultGoalName: string;
  DefaultGoalImageURL: string;
}

export enum CollectEnum {
  Y = "Y",
  N = "N",
}

export enum GoalStatusEnum {
  PENDING = "PENDING",
  ON_PROGRESS = "ON_PROGRESS",
  FULFILLED = "FULFILLED",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
  DELETED = "DELETED",
}

export interface getGoalDetailsResponse {
  TargetAmount: number;
  CurrentValue: number;
  AmountLeft: number;
  TargetDate: string;
  WalletId: string;
  TotalBalance: number;
  MarketStatus: number;
  InvestedAmount: number;
  ProfitLoss: number;
  GoldProfitLoss: number;
  TotalFixedWeight: number;
  AccountBalance: number;
  AccountNumber: string;
  MarketSellPrice: number;
  MarketBuyPrice: number;
  Transactions: TransactionType[];
  Image: string;
  GoalPercentageStatus: number;
  //TODO will add the  rest of keys once confirm  with BE to be like LLD
}

export interface TransactionType {
  TransactionId: string;
  Date: string;
  Type: string;
  Weight: number;
  PricePerUnit: number;
  TotalAmount: number;
  Status: string;
  SerialNumber: string;
}

export enum TransActionType {
  SELL = "SELL",
  BUY = "BUY",
}

export interface getTransactionsResponse {
  Offset: number;
  Pagesize: number;
  Transactions: TransactionType[];
  WalletId: string;
  AccountNumber: string;
}
export interface GoldFinalDealResponseType {
  TrxnId: string;
  TransactionKey: string;
  AccountNumber: string;
  AccountBalance: number;
  AutoRetryCount: number;
  SourceRefNo: string;
  Rate: number;
  TimeToLive: number;
  TotalAmount: number;
  MeasureUnit: MeasureUnitEnum;
  Weight: number;
  SupplierName: string;
  Qty: number;
  Purity: string;
}
export interface GoalSuggestionResponse {
  TargetDate: string;
  MonthlyContribution: number;
  TargetAmount: number;
}
export interface GoalRecurringResponse {
  RecurringId: string;
  ContributionAmount: number;
  Frequency: string;
  MeasuringUnit: string;
  RecurringDay: string;
  UpperLimit: number;
  Active: string;
  EndDate: string;
}
