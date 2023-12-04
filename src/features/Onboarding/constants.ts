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
  Employee = "01",
  Retired = "02",
  "Business Owner" = "03",
  Unemployed = "04",
  Housewife = "46",
  Student = "48",
  Motsabib = "50",
  Others = "05",
}

export enum SectorEnum {
  "Government Employee" = "01",
  "Government Civillian" = "02",
  Military = "03",
  "Private Employee" = "04",
  Others = "05",
}

export enum OccupationCodeEnum {
  Amassador = "01",
  Analyst = "02",
  Arts = "03",
  "Assistant minister" = "04",
  "Auditor accountant" = "05",
  Baker = "06",
  Barber = "07",
}

export enum MainIncomeEnum {
  Salary = "01",
  Savings = "02",
  Cheque = "03",
  Others = "04",
}

export enum MonthlyDebitCreditAmountEnum {
  "0-2,500" = "01",
  "2,501-5,000" = "02",
  "5,000-10,000" = "03",
  "10,000 – 20,000" = "04",
  "20,000+" = "05",
}

export enum AdditionalIncomeTypeEnum {
  Rent = "01",
  Investment = "02",
  Freelance = "03",
}

export enum IncomeAmountEnum {
  "0-2,500" = "01",
  "2,501-5,000" = "02",
  "5,000-10,000" = "03",
  "10,000 – 20,000" = "04",
  "20,000+" = "05",
}
