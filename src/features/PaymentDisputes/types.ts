import { DocumentPickerResponse } from "react-native-document-picker";
import { Asset } from "react-native-image-picker";

export interface DisputeReasonType {
  ProblemCategoryCode: string;
  ProblemCategoryName: string;
  ProblemCategoryDescription: string;
}

export interface CreateDisputeInput {
  DeclarationFlag: boolean;
  CaseDetails: string;
  File?: (Asset | DocumentPickerResponse) | undefined;
}

export type CaseType = "dispute" | "fraud";

export type TransactionType = "CARD" | "ATM";

export interface DisputeCase {
  CaseNumber: string;
  Transaction: {
    Source: string;
    Location: string | undefined;
    Amount: string;
    Currency: string;
    CreatedOn: string;
  };
  CaseStatus: string;
}
