import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { useCurrentAccount } from "./use-accounts";

export interface ApiNonGroupedTransactionsResponseElement {
  AccountId: string;
  TransactionId: string;
  StatementReference: string;
  CreditDebitIndicator: string;
  Status: string;
  BookingDateTime: number[];
  ValueDateTime: number[];
  AddressLine: string;
  CardType: string;
  TransactionInformation: string;
  ChargeAmount: {
    Amount: string;
  };
  Amount: {
    Amount: string;
    Currency: string;
  };
  MerchantDetails: {
    MerchantName: string;
  };
  SupplementaryData: {
    RoundupTransactionId: string;
    RoundupAmount: string;
    RoundupCurrency: string;
    RoundupTransactionDate: number[];
    CategoryId: string;
    CategoryName: string;
    SavingGoalName: string;
    SavingGoalId: string;
  };
  HiddenIndicator: string;
}

export interface ApiTransactionsResponseElement {
  TotalAmount: number;
  Transaction: ApiNonGroupedTransactionsResponseElement[];
  GroupedTransactions: [
    {
      Key: string;
      Value: string;
      Transactions: [
        {
          AccountId: string;
          TransactionId: string;
          StatementReference: string;
          CreditDebitIndicator: string;
          Status: string;
          BookingDateTime: [];
          ValueDateTime: number[];
          AddressLine: string;
          CardType: string;
          TransactionInformation: string;
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
      ];
      AccountCategory: string;
    }
  ];
  Meta: unknown;
}

export default function useTransactions(
  transactionCode?: string,
  categories?: string,
  tags?: string,
  selectedFilters?: string[],
  groupBy?: string,
  fromDate?: string,
  toDate?: string
) {
  const account = useCurrentAccount();
  const account_id = account.data?.id;

  const notPendingTransactions = useQuery(
    ["transactions", { transactionCode, selectedFilters, categories, StatusId: "1", fromDate, toDate }],
    () =>
      api<ApiTransactionsResponseElement>(
        "v1",
        `accounts/${account_id}/transactions/not-pending`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
          SortBy: "bookingDateTime",
          SortDirection: "DESC",
          StatusId: "1",
          Tags: tags?.toString(),
          ...(transactionCode ? { transactionCode: transactionCode } : {}),
          ...(categories ? { Categories: categories } : {}),
          GroupBy: groupBy,
          fromDate: fromDate,
          toDate: toDate,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
    }
  );

  const isLoading = notPendingTransactions.isLoading;

  return { notPendingTransactions, isLoading };
}
