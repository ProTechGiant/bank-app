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
  OpenedDate: string;
  Transaction: {
    Source: string;
    Location: string | undefined;
    Amount: string;
    Currency: string;
    CreatedOn: string;
    TransactionRef: string;
  };
  CaseStatus: string;
}

export interface DisputeCase extends DisputeCaseListItem {
  Issue: string;
  AdditionalInformation: string;
  DmsAttachment: string;
}
