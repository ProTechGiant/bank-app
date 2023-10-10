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
