import { StatementLanguageTypes, StatementStatus } from "./constants";

export interface StatementInterface {
  CBSReferenceNumber: string;
  DocumentId: string;
  Status: StatementStatus;
  StatementLanguage: StatementLanguageTypes;
  StatementStartDate: string;
  StatementEndDate: string;
  StatementGenerationDate: string;
}
export interface GetAccessStatementApiResponse {
  Statements: StatementInterface[];
  count: number;
}

export interface PaginationInterface {
  limit: number;
  offset: number;
}

export type SelectedLanguageType = "en" | "ar";

export interface TimeFrameInterface {
  label: string;
  value: "last3Month" | "last6Month" | "last12Month";
}

export interface DownloadStatementResponse {
  StatementName: string;
  StatementType: string;
  StatementContent: string;
}

export interface RetryRequestInterface {
  StatementRequestId: string;
}
