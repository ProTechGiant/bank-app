import { ImageURISource } from "react-native/types";

export interface BillItem {
  BillName: string;
  AccountNumber: string;
  Amount: number;
  DueDate: string;
  icon: ImageURISource;
}

export interface BillHistorySectionList {
  title: string;
  data: BillItem[];
}

export interface BillDetail {
  category: string | undefined;
  billIssuer: string | undefined;
  accountNumber: string | undefined;
  description: string | undefined;
  otherBillAmount: string | undefined;
}

export type NavigationType = "saveBill" | "payBill" | "oneTimePayment" | undefined;
