import { useMemo } from "react";
import { useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId, removeLeadingZeros } from "@/utils";

interface ApiAccountResponseElement {
  Data: {
    Account: [
      {
        AccountId: string;
        Currency: string;
        AccountType: string;
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

export default function useAccount() {
  const { userId } = useAuthContext();

  // Need the leading 0s for internal transfer but have to remove for useAccount
  const userIdLeadingZerosRemoved = removeLeadingZeros(userId);

  const accounts = useQuery(["accounts"], () => {
    return api<ApiAccountResponseElement>("v1", "accounts", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["userId"]: userIdLeadingZerosRemoved,
    });
  });

  const [, currentAccount] = useMemo(() => {
    const accountData_ = accounts.data?.Data.Account;
    const currentAccount_ = accountData_?.find(a => a.AccountType === "CURRENT");
    return [accountData_, currentAccount_];
  }, [accounts]);

  const currentAccountId = currentAccount?.AccountId;

  const balances = useQuery(
    ["balances", { currentAccountId }],
    () =>
      api<ApiBalanceResponseElement>("v1", `accounts/${currentAccountId}/balances`, "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
        ["userId"]: userIdLeadingZerosRemoved,
      }),
    { enabled: undefined !== currentAccountId }
  );

  return useMemo(() => {
    if (undefined === currentAccountId || undefined === currentAccount) {
      return { data: undefined };
    }

    let currentAccountCurrencyType;
    let currentAccountBalance;

    // @todo remove once balance API is working again
    if (balances.data !== undefined) {
      const balanceData = balances.data?.Data.Balance;
      const currentBalance = balanceData?.find(b => b.Type === "INTERIM_AVAILABLE");
      currentAccountCurrencyType = currentBalance?.Amount.Currency;
      currentAccountBalance =
        undefined !== currentBalance?.Amount.Amount ? Number(currentBalance?.Amount.Amount) : undefined;
    }

    const currentAccountName = currentAccount.Description;
    const currentAccountIban = currentAccount.Account.find(a => a.SchemeName === "IBAN.NUMBER")?.Identification;
    const currentAccountOwner = currentAccount.Account.find(a => a.SchemeName === "CUSTOMER.FULL.NAME")?.Identification;
    const currentAccountType = currentAccount.AccountType;
    const currentAccountBankCode = currentAccountIban?.substring(5, 10);
    const currentAccountNumber = currentAccountIban?.slice(-12);

    return {
      data: {
        currentAccountId,
        currentAccountName,
        currentAccountIban,
        currentAccountBankCode,
        currentAccountNumber,
        currentAccountOwner,
        currentAccountCurrencyType,
        currentAccountBalance,
        currentAccountType,
      },
    };
  }, [currentAccount, balances, currentAccountId]);
}
