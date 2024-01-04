import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { useCurrentAccount } from "./use-accounts";

export interface ApiSingleTransactionsDetailResponse {
  AccountId: string;
  TransactionId: string;
  Status: string;
  Amount: number;
  Currency: string;
  BookingDateTime: number[];
  Location: string;
  CreditDebitIndicator: string;
  RoundUpAmount: number;
  Category: unknown;
  SavingGoal: unknown;
}

export default function useTransactions(transaction_id: string) {
  const account = useCurrentAccount();
  const account_id = account.data?.id;
  const single_transaction = useQuery(
    [transaction_id],
    () =>
      api<ApiSingleTransactionsDetailResponse>(
        "v1",
        `accounts/${account_id}/transactions/${transaction_id}`,
        "GET",
        {},
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

  const isLoading = single_transaction.isLoading;

  return { single_transaction, isLoading };
}
