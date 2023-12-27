export interface PortfoliosPerformanceList {
  PortfoliosPerformanceList: PortfolioPerformanceList[];
}

export interface PortfolioPerformanceList {
  PortfolioPerformanceList: {
    PortfolioCode: string;
    Date: string;
    MarketValue: string;
  }[];
}

export interface Portfolios {
  TotalPortfoliosValue: number;
  TotalCashBalance: number;
  TotalGainLoss: number;
  TotalGainLossPercentage: number;
  PortfolioList: [
    {
      PortfolioId: number;
      PortfolioCode: string;
      PortfolioName: string;
      PortfolioHoldingList: [
        {
          ProductInformation: {
            ProductId: number;
            ProductName: string;
          };
        },
        {
          ProductInformation: {
            ProductId: number;
            ProductName: string;
          };
        }
      ];
    }
  ];
}

export interface PortfolioDetails {
  PortfolioId: number;
  PortfolioCode: string;
  PortfolioName: string;
  PortfolioCurrency: string;
  TotalPortfolioValue: number;
  TotalCashBalance: number;
  TotalGainLoss: number;
  TotalGainLossPercentage: number;
  PortfolioHoldingList: [
    {
      ProductId: number;
      ProductName: string;
      ProductCurrency: string;
      IsCash: string;
      InvestedValue: number;
      NAV: number;
      YTD: number;
      AverageCost: number;
      Units: number;
      InceptionDate: string;
      ValuationDate: string;
      ExchangeRate: number;
      UnrealizedGainLoss: number;
      SubscriptionFees: number;
      MinimumSubscriptionAmount: number;
      MinimumAdditionalSubscriptionAmount: number;
      Dividend: string;
      CategoryArabic: string;
      CategoryEnglish: string;
      Strategy: string;
      MutualFundInfo: string;
      AssetAllocation: {
        SokukFund: number;
        SharesFund: number;
        CashMarketsFund: number;
        InvestmentFund: number;
      };
    }
  ];
  PortfolioPerformanceList: PortfolioPerformanceList;
}

export interface AssetsAllocation {
  SokukFund: number;
  InvestmentFund: number;
  SharesFund: number;
  CashMarketsFund: number;
}

export type Product = {
  Id: string;
  Name: string;
  YTD: number;
  NAV: number;
  IsActive: boolean;
  Currency: string;
  FundAvailability: string;
  MinimumSubscriptionAmount: number;
  MinimumAdditionalSubscriptionAmount: number;
  SubscriptionFees: number;
  RiskLevel: string;
  IsEndowment: boolean;
  Category: string;
  Strategy: string;
  DealingDaysFrequency: string;
  DealingDays: string;
  Dividend: string;
  Risk: string;
  AssetsAllocation: AssetsAllocation;
};

export type OffersProducts = {
  mutualFundProductsList: Product[];
};

export interface Account {
  AccountName: string;
}

type ProductInformation = {
  ProductId: number;
  ProductName: string;
};

export type PortfolioHolding = {
  ProductInformation: ProductInformation;
};

export type Portfolio = {
  PortfolioId: number;
  PortfolioCode: string;
  PortfolioName: string;
  PortfolioHoldingList: PortfolioHolding[];
};

export type PortfolioData = {
  TotalPortfoliosValue: number;
  TotalCashBalance: number;
  TotalGainLoss: number;
  TotalGainLossPercentage: number;
  PortfolioList: Portfolio[];
};
type HoldinInformation = {
  RiskLevel: string;
  InceptionDate: string;
  ProductCurrency: string;
  SubscriptionFees: string;
  MinimumSubscriptionAmount: number;
  MinimumAdditionalSubscriptionAmount: number;
};
export type PortfolioDetail = {
  PortfolioHoldingList: HoldinInformation[];
};

export type Investment = {
  assetName: string;
  percentage: string;
  investmentAmount: string;
  color: string;
};

export type AssetInvestment = {
  TotalInvesmtent: string;
  Investments: Investment[];
};

export interface PerformanceLastYearsInterface {
  Last3YearsPerformance: number;
}

export interface ProductKeyInformation {
  mutualFundName: string;
  inceptionDate: string;
  fundCurrency: string;
  performanceFee: string;
  minimumSubscription: number;
  minimumAdditionalSubscription: number;
  riskLevel: string;
}
export interface GetSuitabilityQuestionInterface {
  ProductCode: string;
  ProductRisk: string;
  Analytics: AnalyticsInterface;
  Template: TemplateInterface;
}

interface AnalyticsInterface {
  HasData: boolean;
  FormId: string;
  IsQualified: boolean;
  MustUpdate: boolean;
  Scoring: ScoringInterface;
}

interface ScoringInterface {
  TotalScore: number;
  EnglishScoreCategoryDescription: string;
  ArabicScoreCategoryDescription: string;
  ScoreRiskAppetite: string;
  EnglishInvObjectiveDescription: string;
  ArabicInvObjectiveDescription: string;
}

interface TemplateInterface {
  ProductCode: string;
  Id: number;
  Version: number;
  EnglishDescription: string;
  ArabicDescription: string;
  IsValidAnswers: boolean;
  TotalScore: number;
  Questions: QuestionInterface[];
}

interface QuestionInterface {
  Id: number;
  EngishSectionTitle: string;
  ArabicSectionTitle: string;
  QuestionNumber: number;
  IsInvestmentObjective: boolean;
  SystemOwner: string;
  KycDtoPath: string;
  EnglishTitle: string;
  ArabicTitle: string;
  InputType: string;
  Answer: AnswerInterface;
  Options: OptionInterface[];
}

interface AnswerInterface {
  OptionIds: string;
  Value: string;
  ErrorText: string;
  IsValid: boolean;
  Score: number;
}

interface OptionInterface {
  Id: number;
  TemplateId: number;
  QuestionId: number;
  OptionNumber: number;
  EnglishLabel: string;
  ArabicLabel: string;
  Value: string;
  Points: number;
}

interface ProductInformations {
  ProductId: number;
  ProductName: string;
  Symbol: string;
  Isin: string;
  ArabicProductName: string;
  ProductCurrency: string;
}

interface PortfolioHoldings {
  ProductId: string;
  ProductName: string;
  ProductInformation: ProductInformation;
  CurrentValue: number;
  Units: number;
  UnrealizedGainLossRatio: number;
  RiskLevel: string;
}
interface PortfolioType {
  PortfolioId: number;
  PortfolioCode: string;
  PortfolioName: string;
}

export interface CustomerPortfolioListType {
  PortfolioList: PortfolioType[];
}
export interface PortfoliosDetails {
  PortfolioCode: string;
  Id: number;
  Name: string;
  MinimumSubscriptionAmount: number;
  MinimumAdditionalSubscriptionAmount: number;
  SubscriptionFees: number;
  SecurityType: string;
  Symbol: string;
  Currency: string;
  RiskLevel: string;
  CurrentValue: number;
  InvestedAmount: number;
  TotalGainLoss: number;
  Ytd: number;
  NumberOfUnits: number;
}

export interface CardInfo {
  PortfoliosMarketValue: number;
  PortfolioMarketValue: number;
  PortfolioInformation: ProductInformations;
  PortfolioHoldingList: PortfolioHoldings[];
}

export type PaymentType = "monthly" | "onetime" | undefined;

export enum PaymentEnum {
  Monthly = "monthly",
  OneTime = "onetime",
}

export type RiskType = "LOW_RISK" | "MEDIUM_RISK" | "HIGH_RISK";

export enum RiskEnum {
  LOW = "LOW_RISK",
  MEDIUM = "MEDIUM_RISK",
  HIGH = "HIGH_RISK",
}

export interface AssetAllocationItem {
  Name: string;
  Ratio: string;
  Color: string;
  Icon: string;
}

export interface AssetAllocationResponse {
  AssetAllocation: AssetAllocationItem[];
  Last3YearsPerformance: number;
  RiskLevel: RiskType;
  FundId: number;
}

export interface CheckProductRiskResponse {
  HasData: boolean;
  IsQualified: boolean;
  MustUpdate: boolean;
  ProductName: string;
  RiskLevel: RiskType;
  MinimumSubscription: number;
  MinimumAdditionalSubscription: number;
  CurrentPrice: number;
  AccountNumber: string;
  AccountBalance: number;
  TermsAndConditionsUrl: string;
  ConsentKey?: string;
  SubscriptionFees: number;
}

export interface CheckCustomerResponse {
  CustomerId: string;
  CustomerPortfolioNumber: number;
}
export interface MutualFundState {
  CustomerPortfolioNumber: string;
  CustomerId: string;
  setMutualFundContextState: (newState: Partial<MutualFundContextState>) => void;
  resetMutualFundContextState: () => void;
}
export interface MutualFundContextState {
  CustomerPortfolioNumber: string;
  CustomerId: string;
  productId?: number;
  startingAmountValue: string;
  monthlyAmountValue: string;
  selectedPayment: string;
  consentKey: string;
  accountNumber?: number;
  setMutualFundContextState: (newState: Partial<MutualFundContextState>) => void;
  resetMutualFundContextState: () => void;
}
export type MutualFundStateType = Omit<
  MutualFundContextState,
  "setMutualFundFundContextState" | "resetMutualFundContextState"
>;

export interface PortfolioOrderType {
  Code: string;
  Name: string;
}

export interface ProductOrderType {
  Name: string;
  Currency: string;
}

export interface OrderType {
  OrderType: string;
  OrderAmount: number;
  OrderQuantity: number;
  Portfolio: PortfolioOrderType;
  Product: ProductOrderType;
  OrderStatus: string;
  OrderUnitPrice: number;
  OrderExchangeRate: number;
  CreationDateTime: string;
  TradeDateTime: string;
  UpdateDateTime: string;
}

export interface OrdersStatusListResponse {
  OrdersList: OrderType[];
}

export interface OrderOtpParams {
  PortfolioId: string;
  OrderAmount: number;
  ProductId: number;
  OrderCurrency: string;
  PaymentFlag: number;
  NumberOfUnits: number;
  PortfolioCode: string;
  IsCroatiaAccount: number;
  ConsentKey: string;
  TermsAndConditionsFlag: number;
}
export interface PortfolioManagement {
  Name: string;
  Description: string;
}

export interface PortfolioManagmentRespons {
  PortfolioManagement: PortfolioManagement[];
}

export interface MutualFundManagement {
  Name: string;
  Description: string;
}

export interface MutualFundManagementRespons {
  MutualFundManagement: MutualFundManagement[];
}

export interface OrdersListRespons {
  Name: string;
  Status: string;
}
