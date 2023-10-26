export const NATIONAL_ID_TYPE = "01";
export const IQAMA_TYPE = "02";
export const PASSCODE_LENGTH = 6;

export enum UploadDocumentStatus {
  NEW = "NEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum HighRiskCaseStatus {
  NEW = "NEW",
  DOCUMENTS_UPLOADED = "DOCUMENTS_UPLOADED",
  DOCUMENTS_RETURNED = "DOCUMENTS_RETURNED",
  DOCUMENTS_REQUIRED = "DOCUMENTS_REQUIRED",
}
