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

export type NavigationType = "saveBill" | "payBill" | "oneTimePayment" | "paymentHistory" | undefined;
