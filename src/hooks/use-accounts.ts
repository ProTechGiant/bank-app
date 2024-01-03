import { useMemo } from "react";
import { useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId, removeLeadingZeros } from "@/utils";

export const queryKeys = {
  all: () => ["account"] as const,
  accounts: () => [...queryKeys.all(), "info"] as const,
  balances: (accountIds: string[]) => [...queryKeys.all(), "balances", ...accountIds] as const,
};

export function useAccounts() {
  const { userId } = useAuthContext();

  if (userId === undefined) throw new Error('Cannot use "useAccounts()" without an user-id');
  const sanitizedUserId = removeLeadingZeros(userId);

  const accounts = useQuery(
    queryKeys.accounts(),
    async () => {
      const response = await findAllAccounts(sanitizedUserId);

      return response.Data.Account;
    },
    {
      cacheTime: Infinity,
    }
  );

  const balances = useQuery(
    queryKeys.balances(accounts.data ? accounts.data.map(a => a.AccountId) : []),
    async () => {
      if (accounts.data === undefined) return Promise.reject();
      return Promise.all(accounts.data.map(account => findAccountBalance(account.AccountId, sanitizedUserId)));
    },
    {
      cacheTime: Infinity,
      enabled: accounts.data !== undefined,
    }
  );

  return useMemo(() => {
    if (accounts.data === undefined || balances.data === undefined) {
      return { ...balances, data: undefined };
    }

    return {
      ...balances,
      data: interleaveAccountsWithBalances(accounts.data, balances.data),
    };
  }, [accounts.data, balances]);
}

export function useInvalidateBalances() {
  const queryClient = useQueryClient();

  return function invalidate() {
    queryClient.invalidateQueries(queryKeys.balances([]));
  };
}

export function useCurrentAccount() {
  const accounts = useAccounts();

  return useMemo(() => {
    return {
      ...accounts,
      data: accounts.data?.find(account => account.accountType === "CURRENT"),
    };
  }, [accounts]);
}

export function useSavingsAccount() {
  const accounts = useAccounts();

  return useMemo(() => {
    return {
      ...accounts,
      data: accounts.data?.find(account => account.accountType === "SAVINGS"),
    };
  }, [accounts]);
}

// eslint-disable-next-line prettier/prettier
function interleaveAccountsWithBalances(accounts: ApiAccountResponseElement["Data"]["Account"], balances: ApiBalanceResponseElement[]) {
  return accounts.map((account, index) => {
    const balance = balances[index];
    const balanceAvailable = balance.Data.Balance.find(b => b.Type === "INTERIM_AVAILABLE");

    if (balanceAvailable === undefined || balanceAvailable.AccountId !== account.AccountId) {
      throw new Error("Woops! Balance does not match account");
    }

    const iban = account.Account.find(value => value.SchemeName === "IBAN.NUMBER")?.Identification;

    return {
      iban,
      id: account.AccountId,
      name: account.Description,
      bankCode: iban?.substring(5, 10),
      accountNumber: iban?.slice(-12),
      owner: account.Account.find(value => value.SchemeName === "CUSTOMER.FULL.NAME")?.Identification,
      currencyType: balanceAvailable.Amount.Currency,
      balance: Number(balanceAvailable.Amount.Amount),
      accountType: account.AccountType,
      description: account.Description,
    };
  });
}

function findAllAccounts(userId: string) {
  return api<ApiAccountResponseElement>("v1", "accounts", "GET", undefined, undefined, {
    ["x-correlation-id"]: generateRandomId(),
    ["userId"]: userId,
  });
}

function findAccountBalance(accountId: string, userId: string) {
  return api<ApiBalanceResponseElement>("v1", `accounts/${accountId}/balances`, "GET", undefined, undefined, {
    ["x-correlation-id"]: generateRandomId(),
    ["userId"]: userId,
  });
}

interface ApiAccountResponseElement {
  Data: {
    Account: [
      {
        AccountId: string;
        Currency: string;
        AccountType: "CURRENT" | "SAVINGS";
        Description: string;
        OpeningDate: string;
        Account: [
          {
            SchemeName: string;
            Identification: string;
          }
        ];
        AccountCategory: string;
      }
    ];
    SupplementaryData: {
      CustomerFullName: string;
    };
  };
  Meta: unknown;
}

interface ApiBalanceResponseElement {
  Data: {
    Balance: [
      {
        AccountId: string;
        Type: string;
        Amount: {
          Amount: string;
          Currency: string;
        };
      }
    ];
  };
  Meta: {
    TotalPages: number;
  };
}
