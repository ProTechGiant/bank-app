export enum TabsTypes {
  Week = "Week",
  Month = "Month",
  Year = "Year",
  FiveYears = "5 Years",
}
export enum MarketStatusEnum {
  OPEN = 1,
  CLOSED = 0,
}

export interface GetWalletResponseType {
  WalletId: string;
  MarketStatus: MarketStatusEnum;
  TotalBalance: number;
  CostValue: number;
  ProfitLoss: number;
  TotalFixedWeight: number;
  AccountNumber: string;
  MarketSellPrice: number;
  MarketBuyPrice: number;
  profitLoss: number;
  WalletDtls: [
    {
      FixedWeight: number;
      Karat: number;
      Purity: number;
      Rate: number;
      TransType: string;
      TotalAmount: number;
    }
  ];
  AvailableBullionsItem: {
    AvailableFreeWeight: number;
    FixedBullionsItem: [
      {
        Weight: number;
        MeasureUnit: string;
      }
    ];
  };
}
export interface TransactionType {
  Transaction_id: string;
  Date: string;
  Type: string;
  Weight: number;
  Price_per_unit: number;
  Total_amount: number;
  Status: string;
  SerialNumber: string;
}
export interface getTransactionsResponse {
  Offset: number;
  Pagesize: number;
  Transactions: TransactionType[];
  WalletId: string;
}

export enum AlertConditionsEnum {
  GREATER_THAN = "GREATER_THAN",
  GREATER_THAN_OR_EQUAL = "STRICTLY_GREATER_THAN",
  LESS_THAN = "LESS_THAN",
  LESS_THAN_OR_EQUAL = "STRICTLY_LESS_THAN",
  EQUAL = "EQUAL",
}
export enum AlertStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}
export interface AlertSettingsResponseType {
  TargetPrice: number;
  Operator: AlertConditionsEnum;
  ActiveFlag: AlertStatus;
}

export const AlertSettingsMocked: AlertSettingsResponseType = {
  ActiveFlag: AlertStatus.ACTIVE,
  Operator: AlertConditionsEnum.GREATER_THAN_OR_EQUAL,
  TargetPrice: 200,
};

export interface ConditionWithLabelsType {
  label: string;
  value: AlertConditionsEnum;
}

export interface GoldPerformanceDailyType {
  Date: string;
  SellPrice: number;
  BuyPrice: number;
  Month: string;
  Day: string;
}

export interface GoldPerformanceMonthlyType {
  Date: string;
  Performance: number;
}

export enum TransactionTypeEnum {
  SELL = "SELL",
  BUY = "BUY",
}

export enum MeasureUnitEnum {
  KG = "KG",
  GM = "GM",
}

export enum DealStatusEnum {
  ACCEPT = 1,
  REJECT = 0,
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

export enum TimerStatusEnum {
  RUNNING = "running",
  STOPPED = "stopped",
  NOT_STARTED = "notStarted",
  PAUSED = "paused",
}
