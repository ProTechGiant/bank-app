export type FundingType = "recurring-payments" | "one-off-payment" | "recommended-payment";

export interface CreateGoalInput {
  GoalName: string;
  TargetAmount: number;
  TargetDate: Date;
  RoundupFlag: boolean;
  NotificationFlag: boolean;
}

export interface EditGoalInput {
  GoalName: string;
  TargetAmount: number;
  TargetDate: Date;
  NotificationFlag: boolean;
}

export interface SavingsPot {
  PotId: string;
  GoalName: string;
  TargetAmount: string;
  SavingsPots: number;
  TargetDate: string;
  CreatedDate: string;
  AvailableBalanceAmount: string;
  AvailableBalanceCurrency: string;
  TargetCurrency: string;
  RoundupFlag: boolean;
  NotificationFlag: boolean;
  CustomerId: string;
  AccountId: string;
  PotStatus: string;
  ClosingDate: string;
}

export interface SavingsPotDetailsResponse {
  RecurringPayments: any;
  PotId: string;
  GoalName: string;
  TargetAmount: string;
  TargetCurrency: string;
  TargetDate: string;
  CreatedDate: string;
  RoundupFlag: boolean;
  NotificationFlag: boolean;
  CustomerId: string;
  AccountId: string;
  AvailableBalanceAmount: string;
  AvailableBalanceCurrency: string;
  PotStatus: string;
}

export interface NotificationPreferencesResponse {
  NotificationPreferencesFlag: boolean;
}

export interface SavingGoalTransaction {
  TransactionName: string;
  TransactionDate: number[];
  TransactionAmount: string;
  TransactionStatus: string;
  Category?: string;
}

export interface GoalTransaction {
  AccountId?: string;
  TransactionId?: string;
  StatementReference: string;
  CreditDebitIndicator?: string;
  Status: string;
  Category?: string;
  CardType?: string;
  BookingDateTime: number[];
  ValueDateTime?: number[];
  TransactionInformation?: string;
  Amount: { Amount: string };
}

export interface SavingGoalTransactionsApiParams {
  PageSize: number;
  PageNumber: number;
  Status?: string;
  transactionCode?: string;
  Categories?: string;
  Tags?: string;
  fromDate?: string;
  toDate?: string;
  RoundupFlag?: string;
  SavingGoalId?: string;
  uncategorizedFlag?: string;
  merchantName?: string;
  hiddenFlag?: string;
  transactionId?: string;
  GroupBy: string;
  sortBy: string;
  sortDirection: string;
  classifiedTransactionType?: string;
}

export interface SavingGoalTransactionsApiResponse {
  GroupedTransactions: GroupedTransaction[];
}

export interface GroupedTransaction {
  Key: string;
  Value: string;
  Transactions: Transaction[];
}

export interface Transaction {
  AccountId: string;
  TransactionId: string;
  StatementReference: string;
  CreditDebitIndicator: string;
  Status: string;
  CardType: string;
  BookingDateTime: number[];
  ValueDateTime: number[];
  TransactionInformation: string;
  AddressLine: string;
  ChargeAmount: ChargeAmount;
  Amount: Amount;
  MerchantDetails: MerchantDetails;
  SupplementaryData: SupplementaryData;
  ClassifiedTransactionType: string;
}

export interface ChargeAmount {
  Amount: string;
}

export interface Amount {
  Amount: string;
  Currency: string;
}

export interface MerchantDetails {
  MerchantName: string;
}

export interface SupplementaryData {
  RoundupAmount: string;
  RoundupCurrency: string;
  CategoryId: string;
  CategoryName: string;
  RoundupTransactionId?: string;
  RoundupTransactionDate?: number[];
  SavingGoalName?: string;
  SavingGoalId?: string;
}
