import { ImageURISource } from "react-native/types";

export interface BillItem {
  BillName: string;
  AccountNumber: string;
  Amount: number;
  DueDate: string;
  icon: ImageURISource;
}
