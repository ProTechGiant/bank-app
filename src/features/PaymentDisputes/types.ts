export interface DisputeReasonType {
  ProblemCategoryCode: string;
  ProblemCategoryName: string;
  ProblemCategoryDescription: string;
}

export type CaseType = "dispute" | "fraud";

export type TransactionType = "CARD" | "ATM";

export interface DisputeCase {
  CaseNumber: string;
  Transaction: {
    Source: string;
    Location: string;
    Amount: string;
    Currency: string;
    CreatedOn: string;
  };
  CaseStatus: string;
}
