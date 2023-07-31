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
export type NavigationType = "saveBill" | "payBill" | "oneTimePayment" | undefined;
