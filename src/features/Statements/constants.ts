export enum MonthNameTypes {
  JANUARY = "january",
  FEBRUARY = "february",
  MARCH = "march",
  APRIL = "april",
  MAY = "may",
  JUNE = "june",
  JULY = "july",
  AUGUST = "august",
  SEPTEMBER = "september",
  OCTOBER = "october",
  NOVEMBER = "november",
  DECEMBER = "december",
}

export enum StatementLanguageTypes {
  English = "EN",
  Arabic = "AR",
}

export enum StatementTypes {
  MONTHLY = "MONTHLY",
  CUSTOM = "CUSTOM",
}

export enum StatementStatus {
  FAILED = "FAILED",
  PENDING = "PENDING",
  GENERATED = "GENERATED",
  DOWNLOADED = "DOWNLOADED",
}

export const MONTHLY_STATEMENT_LIMIT = 24;
export const CUSTOM_DATE_STATEMENT_LIMIT = 10;
export const PAGE_OFFSET = 0;

export const maxStatementLongerYearPeriod = 2;
export const maxStatementOlderPeriod = 5;
