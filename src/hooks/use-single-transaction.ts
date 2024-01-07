import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { useCurrentAccount } from "./use-accounts";

const queryKeys = {
  all: () => ["single_transfer"] as const,
  transactionID: (transaction_id: string) => [...queryKeys.all(), "transaction_id", { transaction_id }] as const,
};

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

export function useSingleTransaction(transaction_id: string) {
  const account = useCurrentAccount();
  const account_id = account.data?.id;

  return useQuery(
    queryKeys.transactionID(transaction_id),
    () =>
      api<ApiSingleTransactionsDetailResponse>(
        "v1",
        `accounts/${account_id}/transactions/${transaction_id}`,
        "GET",
        undefined,
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      enabled: !!account_id,
    }
  );
}
