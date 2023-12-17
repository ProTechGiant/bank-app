export enum DocumentStatus {
  Pending = "01",
  Approved = "02",
  Downloaded = "03",
  Failed = "04",
}

export enum DocumentCategory {
  "IBAN Letter" = "01",
  "Bank Certificate" = "02",
  "Consolidated Tax Invoice" = "03",
}

export enum DocumentLanguageType {
  English = "EN",
  العربية = "AR",
}

export enum LanguageType {
  English = "English",
  العربية = "العربية",
}

export enum StatusType {
  Pending = "Pending",
  Approved = "Approved",
  Downloaded = "Downloaded",
  Failed = "Failed",
}

export enum DocumentType {
  IBAN_LETTER = "IBAN Letter",
  BANK_CERTIFICATE = "Bank Certificate",
  CONSOLIDATED_TAX_INVOICE = "Consolidated Tax Invoice",
}

export const FILTER_DEFAULT_VALUES = {
  documentType: "01,02",
  language: "EN,AR",
  status: "01,02,03,04",
};

export const DocumentTypeMapping: Record<string, DocumentCategory> = {
  [DocumentType.IBAN_LETTER]: DocumentCategory["IBAN Letter"],
  [DocumentType.BANK_CERTIFICATE]: DocumentCategory["Bank Certificate"],
};

export const DocumentLanguageMapping: Record<string, DocumentLanguageType> = {
  [LanguageType.English]: DocumentLanguageType.English,
  [LanguageType.العربية]: DocumentLanguageType.العربية,
};

export const DocumentStatusMapping: Record<string, DocumentStatus> = {
  [StatusType.Approved]: DocumentStatus.Approved,
  [StatusType.Downloaded]: DocumentStatus.Downloaded,
  [StatusType.Failed]: DocumentStatus.Failed,
  [StatusType.Pending]: DocumentStatus.Pending,
};

export enum FilterParamsTypes {
  DOCUMENT_TYPE = "documentType",
  DOCUMENT_STATUS = "status",
  DOCUMENT_LANGUAGE = "language",
}
