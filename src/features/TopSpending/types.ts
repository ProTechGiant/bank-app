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
}

export interface Transaction {
  AccountId: string;
  TransactionId: string;
  CardType: string;
  StatementReference: string;
  CreditDebitIndicator: string;
  Status: string;
  TransactionInformation: string;
  BookingDateTime: [];
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
