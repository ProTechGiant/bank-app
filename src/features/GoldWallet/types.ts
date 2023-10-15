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

export enum AlertConditionsEnum {
  GREATER_THAN = 1,
  GREATER_THAN_OR_EQUAL = 2,
  LESS_THAN = 3,
  LESS_THAN_OR_EQUAL = 4,
  EQUAL = 5,
}
export enum AlertStatus {
  ACTIVE = 1,
  INACTIVE = 0,
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
