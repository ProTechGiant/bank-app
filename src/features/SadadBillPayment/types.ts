export interface BillItem {
  BillerId: string;
  BillName: string;
  AccountNumber: string;
  Amount: number;
  DueDate: string;
  iconUrl: string;
  PaymentId: string;
}

export interface BillHistorySectionList {
  title: string;
  data: BillItem[];
}
export interface BillerCategory {
  Code: string;
  Id: string;
  NameEn: string;
  NameAr: string;
  LogoUrl: string;
  BillersList?: Array<Biller>;
}
export interface Biller {
  Id: string;
  Code: string;
  NameEn: string;
  NameAr: string;
  LogoUrl: string;
}
export interface BillDetail {
  BillNumber: string;
  OtherBillAmount: string | undefined;
  BillID: string;
  Category: BillerCategory | undefined;
  BillIssuer: Biller;
  AccountNumber: string | undefined;
  Description: string;
  BillingAccount: string;
  BillAmount: string;
  BillAmountCurrency: string;
  BillerNumber: string;
  BillStatusCode: string;
  DueDate: string;
  ExactPaymentRequired: boolean;
  IsAdvancePaymentAllowed: boolean;
  IsOverPaymentAllowed: boolean;
  IsPartialPaymentAllowed: boolean;
  PaidAmount: string;
  PaidAmountCurrency: string;
  ServiceType: string;
  BillDescriptionList: Array<BillDescriptionListInterface>;
}

export interface BillDescriptionListInterface {
  LanguagePreference: string;
  Text: string;
}
export interface AddBillInterface {
  ServiceType: string;
  BillerId: string;
  BillNumber: string;
  BillingAccount: string;
  BillDescriptionList: [
    {
      LanguagePreference: string;
      Text: string;
    }
  ];
}

export interface PayBillInterface {
  TransactionType: string;
  ServiceType: string;
  BillerId: string;
  BillAmount: string;
  BillAmountCurrency: string;
  PaidAmount: string;
  PaidAmountCurrency: string;
  ExactPaymentRequired: string;
  BillCategory: string;
  BillType: string;
  BillNumber: string;
  BillingAccount: string;
  IdType: string;
  IdNumber: string;
  DisplayLabelEn: string;
  DisplayLabelAr: string;
  DescriptionEn: string;
  DescriptionAr: string;
}

export type NavigationType = "saveBill" | "payBill" | "oneTimePayment" | "paymentHistory" | undefined;
