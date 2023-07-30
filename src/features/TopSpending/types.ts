export interface ChartDataType {
  category: string;
  series1: number;
  series2: number;
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
