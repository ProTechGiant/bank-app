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
  TransactionId: string;
  Date: string;
  Type: string;
  Weight: number;
  Price_per_unit: number;
  TotalAmount: number;
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

export enum TransferType {
  DEPOSIT = "Deposit",
  TRANSFER = "Transfer",
}
