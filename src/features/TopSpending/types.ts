export interface ChartDataType {
  category: string;
  series1: number;
  series2: number;
}

export interface SingleBarChart {
  interval: string;
  value: number;
}
export interface SingleChartDataType {
  total: number;
  chartData: SingleBarChart[];
}

export interface DWMData {
  Daily?: SingleChartDataType;
  Weekly?: SingleChartDataType;
  Monthly: SingleChartDataType;
}
export interface YearData {
  Yearly: SingleChartDataType;
}

export interface CompareDatesTypes {
  firstDate: PeriodDateTypes;
  lastDate: PeriodDateTypes;
}

export interface PeriodDateTypes {
  startDate: string;
  endDate: string;
}

export interface TransactionDetailed {
  cardType: string;
  status: string;
  location: string;
  title: string;
  subTitle: string;
  amount: string;
  currency: string;
  transactionDate: number[];
  roundUpsAmount: string;
  categoryName?: string;
  categoryId?: string;
  hiddenIndicator: string;
}

export interface Transaction {
  AccountId: string;
  TransactionId: string;
  CardType: string;
  StatementReference: string;
  CreditDebitIndicator: string;
  Status: string;
  TransactionInformation: string;
  BookingDateTime: number[];
  ValueDateTime: number[];
  AddressLine: string;
  ChargeAmount: {
    Amount: string;
  };
  Amount: {
    Amount: string;
    Currency: string;
  };
  MerchantDetails: { MerchantName: string };
  SupplementaryData: {
    RoundupAmount: string;
    RoundupCurrency: string;
    CategoryId: string;
    CategoryName: string;
  };
  HiddenIndicator: string;
}

export interface DateInterface {
  color: string;
  customContainerStyle: {
    borderRadius: number;
  };
  disableTouchEvent: boolean;
  endingDay?: boolean;
  startingDay?: boolean;
  textColor: string;
}

export interface Tag {
  TagId: string;
  TagName: string;
  Amount: number;
  TagIcon: string;
  TransactionCount: number;
  Percentage?: string;
  Currency: string;
}
export interface TagIconType {
  id: number;
  path: string;
  name: string;
  viewBox?: string;
}

export interface PredefinedTagType {
  id: number;
  name: string;
  path: string;
  viewBox?: string;
}

export interface CreateNewTagType {
  tagName: string;
  tagIcon: string;
  transactionId: string;
}

export interface CreateNewTagApiResponseType {
  Status: string;
  Message: string;
  tagTransactionDetailResModel: {
    TagId: number;
    TagName: string;
    TagIcon: string;
    AccountId: string;
    transactionId: string;
  };
}

export interface GetCustomerTagsApiResponseType {
  PageCount: number;
  RowCount: number;
  Tags: Array<GetCustomerSingleTagType>;
}

export interface GetCustomerSingleTagType {
  TagId: number;
  TagName: string;
  TagIcon: string;
  AccountId: string;
}

export interface DailyGraghType {
  Total: number;
  H0004: number;
  H0408: number;
  H0812: number;
  H1216: number;
  H1620: number;
  H2024: number;
}

export interface WeeklyGraghType {
  Total: number;
  Saturday: number;
  Sunday: number;
  Monday: number;
  Tuesday: number;
  Wednesday: number;
  Thursday: number;
  Friday: number;
}

export interface MonthlyGraghType {
  Total: number;
  Week1: number;
  Week2: number;
  Week3: number;
  Week4: number;
}

export interface YearlyGraghType {
  Total: number;
  Jan: number;
  Feb: number;
  Mar: number;
  Apr: number;
  May: number;
  Jun: number;
  Jul: number;
  Aug: number;
  Sep: number;
  Oct: number;
  Nov: number;
  Dec: number;
}

export interface LastSixMonthsType {
  Month: string;
  Amount: number;
}
export interface DWMGraghData {
  Daily?: DailyGraghType;
  Weekly?: WeeklyGraghType;
  Monthly: MonthlyGraghType;
}

export interface YGraghData {
  Yearly: YearlyGraghType;
}

export interface LastSixMonthsApiResponse {
  Total: number;
  Months: LastSixMonthsType[];
}
export interface GraghApiResponse {
  Data: DWMGraghData & YGraghData;
}
export interface SetMonthRowCardType {
  label: string;
  onPressSetDate: () => void;
  selectedMonth?: string | null;
}

export interface PlusTierDateTypes {
  month: number;
  year: number;
}

export interface GetMonthSpendingsComparisonSummary {
  Total: number;
  Months: Month[];
}

export interface Month {
  Month: string;
  Year: string;
  Total: number;
  GraphData: GraphData[];
  Categories: Category[];
}

export interface GraphData {
  Week: string;
  Amount: number;
}

export interface Category {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  percentage: string;
  currency: string;
  transactionCount: number;
  iconPath: string;
}
export interface SingleSelectedMonthType {
  fromDate: string;
  toDate: string;
}
