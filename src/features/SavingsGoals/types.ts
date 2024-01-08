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
  GroupBy?: string;
  sortBy?: string;
  sortDirection?: string;
  classifiedTransactionType?: string;
}

export interface TransactionSavingPot {
  AccountId: string;
  TransactionId: string;
  Status: string;
  CardType: string;
  BookingDateTime: number[];
  ChargeAmount: {
    Amount: string;
  };
  Amount: {
    Amount: string;
    Currency: string;
  };
  SupplementaryData: {
    Application: string;
    CompanyId: string;
    Operator: string;
    RelatedReference: string;
    TransactionType: string;
    DateTime: string;
    CreditAccountCurrencyCode: string;
    DebitAccountCurrencyCode: string;
    OrderingCustomer: string;
    OrderingCustName: string;
    OrderingCustAddrLine: string[];
    OrderingReference: string;
    PaymentExecutionDate: string;
    EndToEndReference: string;
    Narrative: string[];
    CreditValueDate: string;
  };
  HiddenIndicator: string;
}

export interface SavingGoalTransactionsApiResponse {
  Transaction: TransactionSavingPot[];
}
