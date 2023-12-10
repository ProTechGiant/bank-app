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
  APPROVED = "APPROVED",
}

export enum CustomerStatus {
  NEW = "NEW",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  DECLINED = "DECLINED",
  HIGH_RISK = "HIGH_RISK",
}

export enum ProfessionEnum {
  employee = "01",
  retired = "02",
  businessOwner = "03",
  unemployed = "04",
  housewife = "46",
  student = "48",
  motsabib = "50",
  others = "05",
}

export enum SectorEnum {
  governmentEmployee = "01",
  governmentCivillian = "02",
  military = "03",
  privateEmployee = "04",
  others = "05",
}

export enum MainIncomeEnum {
  salary = "01",
  savings = "02",
  cheque = "03",
  others = "04",
}

export enum AdditionalIncomeTypeEnum {
  rent = "01",
  investment = "02",
  freelance = "03",
}

export enum IncomeAmountEnum {
  "02To500" = "01",
  "2501To5000" = "02",
  "5000TO10000" = "03",
  "10000To20000" = "04",
  "20000Plus" = "05",
}
