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
  File?: (Asset | DocumentPickerResponse) | undefined;
}

export type CaseType = "dispute" | "fraud";

export type TransactionType = "CARD" | "ATM";

export interface CaseDetails {
  TransactionSource: string;
  CaseID: string;
  Status: string;
  DayReported: string;
  Issue: string;
  Attachment: string;
  AdditionalInformation: string;
  TransactionAmount: string;
  TransactionCurrency: string;
  TransactionCreationDate: string;
  TransactionLocation: string;
}

export interface DisputeCaseListItem {
  CaseNumber: string;
  OpenedDate: string;
  Transaction: {
    Source: string;
    Location: string | undefined;
    Amount: string;
    Currency: string;
    CreatedOn: string;
  };
  CaseStatus: string;
}
