export interface TransferValue {
  PaymentAmount: number;
  TransferReason: TransferReason;
}

export interface TransferReason {
  Code: string;
  Description: string;
}

export interface BeneficiaryType {
  id: number;
  name: string;
  bank: string;
  accountNumber: string;
  isActive?: boolean;
  lastUpdated: Date;
}
