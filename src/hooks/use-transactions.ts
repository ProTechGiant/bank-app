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
}

export interface ApiTransactionsResponseElement {
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

interface ApiPendingTransactionsResponseElement {
  Transaction: {
    AccountId: string;
    TransactionReference: string;
    TransactionInformation?: string;
    Amount: {
      Amount: string;
    };
    SupplementaryData: {
      FromDate: [year: number, month: number, day: number, hours: number, minutes: number];
    };
  }[];
  Meta: unknown;
}

export default function useTransactions(
  transactionCode?: string,
  categories?: string,
  selectedFilters?: string[],
  groupBy?: string,
  fromDate?: string,
  toDate?: string
) {
  const account = useCurrentAccount();

  const account_id = account.data?.id;

  const transactions = useQuery(
    ["transactions", { transactionCode, selectedFilters, status: "completed", fromDate, toDate }],
    () =>
      api<ApiTransactionsResponseElement>(
        "v1",
        `accounts/${account_id}/transactions`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
          Status: "COMPLETED",
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

  const pendingTransactions = useQuery(
    ["transactions", { status: "pending" }],
    () =>
      api<ApiPendingTransactionsResponseElement>(
        "v1",
        `accounts/${account_id}/transactions`,
        "GET",
        {
          PageSize: 1000,
          PageNumber: 0,
          Status: "PENDING",
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

  const isLoading = transactions.isLoading || pendingTransactions.isLoading;

  return { transactions, pendingTransactions, isLoading };
}
