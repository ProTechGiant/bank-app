import { DocumentCategory, DocumentStatus } from "./constants";

export interface DocumentInterface {
  DocumentId: string;
  AdhocDocRequestId: string;
  Status: DocumentStatus;
  Category: DocumentCategory;
  ExpiryDate: string;
  CreateDateTime: string;
  DocumentStatusUpdateDateTime: string;
  DocumentLanguage: string;
}

export interface PaginationInterface {
  limit: number;
  offset: number;
}

export interface GetDocumentsApiResponse {
  Documents: DocumentInterface[];
  TotalRecords: number;
}

export interface RetryAdHocResponse {
  AdhocDocumentRequestId: string;
}

export const DOCUMENT_LIMIT = 10;
export const DOCUMENT_OFFSET = 0;

export enum DocumentTypeOptions {
  BankCertificate = "Bank Certificate",
  IBANLetter = "IBAN Letter",
}

export enum LanguageOptions {
  English = "English",
  Arabic = "العربية",
}

export enum StatusOptions {
  Approved = "Approved",
  Pending = "Pending",
  Failed = "Failed",
}
export interface DownloadDocumentResponse {
  DocumentName: string;
  DocumentType: string;
  DocumentContent: string;
}
