import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { useCurrentAccount } from "./use-accounts";

export interface ApiTransactionsResponseElement {
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

export default function useTransactions(transactionCode?: string, categories?: string, selectedFilters?: string[]) {
  const account = useCurrentAccount();

  const account_id = account.data?.id;

  const transactions = useQuery(
    ["transactions", { transactionCode, selectedFilters, status: "completed" }],
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
          GroupBy: "yes",
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
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
