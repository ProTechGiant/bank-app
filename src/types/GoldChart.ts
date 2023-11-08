export enum TabsTypes {
  Week = "Week",
  Month = "Month",
  Year = "Year",
  FiveYears = "5 Years",
}
export interface GoldPerformanceMonthlyType {
  Date: string;
  Performance: number;
}
export interface GoldPerformanceDailyType {
  Date: string;
  SellPrice: number;
  BuyPrice: number;
  Month: string;
  Day: string;
}

export enum periodEnum {
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export enum groupingByEnum {
  daily = "DAILY",
  monthly = "MONTHLY",
}
