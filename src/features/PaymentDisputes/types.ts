export interface DisputeReasonType {
  ProblemCategoryCode: string;
  ProblemCategoryName: string;
  ProblemCategoryDescription: string;
}

export type CaseType = "dispute" | "fraud";

export type TransactionType = "CARD" | "ATM";
