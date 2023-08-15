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
  statements: StatementInterface[];
  totalRecords: number;
}

export interface PaginationInterface {
  limit: number;
  offset: number;
}
