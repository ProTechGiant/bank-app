import { DocumentPickerResponse } from "react-native-document-picker";
import { Asset } from "react-native-image-picker";

export interface DisputeReasonType {
  PaymentCaseCategoryCode: string;
  PaymentCaseCategoryName: string;
  PaymentCaseCategoryDescription: string;
}

export interface CreateDisputeInput {
  DeclarationFlag: boolean;
  CaseDetails: string;
  File?: Asset | DocumentPickerResponse;
}

export type CaseType = "dispute" | "fraud";

export type TransactionType = "CARD" | "ATM";

export interface DisputeCaseListItem {
  CaseNumber: string;
  CaseType: string;
  ClassificationCode: string;
  ClosedOn: string;
  CreatedOn: string;
  CustomerId: string;
  Product: string;
  RequiredDocs: string[];
  Resolution: boolean;
  ScreeningId: null;
  StatusReason: string;
  Title: string;
}

export interface DisputeCase extends DisputeCaseListItem {
  Issue: string;
  AdditionalInformation: string;
  DmsAttachment: string;
}

export enum CasesCategoriesEnum {
  ALL = "All",
  COMPLAINTS = "Complaints",
  DISPUTES = "Payment Disputes",
  OTHERS = "Inquires/Others",
}

export enum TabsTypeEnum {
  ACTIVE = "active",
  RESOLVED = "resolved",
}
