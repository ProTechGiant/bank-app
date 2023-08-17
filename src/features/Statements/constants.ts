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
  English = "English",
  Arabic = "العربية",
}

export enum StatementLanguageHeaderTypes {
  English = "EN",
  Arabic = "AR",
}

export enum StatementTypes {
  MONTHLY = "monthly",
  CUSTOM = "custom",
}

export enum StatementStatus {
  FAILED = "failed",
  PENDING = "pending",
  GENERATED = "generated",
  DOWNLOADED = "downloaded",
}

export enum TabsTypes {
  MONTHLY = "Monthly",
  CUSTOM_DATE = "Custom Date",
}
export const MONTHLY_STATEMENT_LIMIT = 24;
export const CUSTOM_DATE_STATEMENT_LIMIT = 10;
export const PAGE_OFFSET = 0;

// TODO: Later will remove temporaryOnboardingDate
export const temporaryOnboardingDate = "2021-01-01";
