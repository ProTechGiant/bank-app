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
  transactionId: string;
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
