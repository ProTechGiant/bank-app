import { useMemo } from "react";
import { useQuery } from "react-query";

import api from "@/api";

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
            schemeName: string;
            identification: string;
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
  const accounts = useQuery(["accounts"], () => {
    return api<ApiAccountResponseElement[]>("v1", "accounts", "GET");
  });

  const [accountData, currentAccount] = useMemo(() => {
    const accountData_ = accounts.data?.find(
      d => undefined !== d.Data.Account.find(a => a.AccountType === "CURRENT")
    )?.Data;
    const currentAccount_ = accountData_?.Account.find(a => a.AccountType === "CURRENT");

    return [accountData_, currentAccount_];
  }, [accounts]);

  const currentAccountId = currentAccount?.AccountId;

  const balances = useQuery(
    ["balances", { currentAccountId }],
    () => api<ApiBalanceResponseElement[]>("v1", `accounts/${currentAccountId}/balances`, "GET"),
    { enabled: undefined !== currentAccountId }
  );

  return useMemo(() => {
    const currentAccountName = currentAccount?.Description;
    const currentAccountIban = currentAccount?.Account.find(a => a.schemeName === "IBAN.NUMBER")?.identification;
    const currentAccountCustomerFullName = accountData?.SupplementaryData?.CustomerFullName;

    // eslint-disable-next-line prettier/prettier
    const balanceData = balances.data?.find(d => undefined !== d.Data.Balance.find(b => b.Type === "INTERIM_AVAILABLE"))?.Data;
    const currentBalance = balanceData?.Balance.find(b => b.Type === "INTERIM_AVAILABLE");

    const currentAccountCurrencyType = currentBalance?.Amount.Currency;
    const currentAccountBalance =
      undefined !== currentBalance?.Amount.Amount ? Number(currentBalance?.Amount.Amount) : undefined;

    return {
      data: {
        currentAccountId,
        currentAccountName,
        currentAccountIban,
        currentAccountCurrencyType,
        currentAccountBalance,
        currentAccountCustomerFullName,
      },
    };
  }, [accountData, currentAccount, balances, currentAccountId]);
}
