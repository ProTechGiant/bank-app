export interface BillItem {
  BillerId: string;
  BillName: string;
  AccountNumber: string;
  Amount: number;
  DueDate: string;
  iconUrl: string;
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
  otherBillAmount: string | undefined;
  billID: string;
  category: BillerCategory | undefined;
  billIssuer: Biller | undefined;
  accountNumber: string | undefined;
  description: string;
}

export type NavigationType = "saveBill" | "payBill" | "oneTimePayment" | "paymentHistory" | undefined;
