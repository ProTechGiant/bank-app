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
