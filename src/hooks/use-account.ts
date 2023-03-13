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
    // eslint-disable-next-line prettier/prettier
    const accountData_ = accounts.data?.find(d => undefined !== d.Data.Account.find(a => a.AccountType === "CURRENT"))?.Data;
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
    if (undefined === currentAccountId || undefined === currentAccount || undefined === balances.data) {
      return { data: undefined };
    }

    const currentAccountName = currentAccount.Description;
    const currentAccountIban = currentAccount.Account.find(a => a.schemeName === "IBAN.NUMBER")?.identification;
    const currentAccountCustomerFullName = accountData?.SupplementaryData?.CustomerFullName;
    // eslint-disable-next-line prettier/prettier
    const balanceData = balances.data.find(d => undefined !== d.Data.Balance.find(b => b.Type === "INTERIM_AVAILABLE"))?.Data;
    const currentBalance = balanceData?.Balance.find(b => b.Type === "INTERIM_AVAILABLE");
    const currentAccountCurrencyType = currentBalance?.Amount.Currency;
    // eslint-disable-next-line prettier/prettier
    const currentAccountBalance = undefined !== currentBalance?.Amount.Amount ? Number(currentBalance?.Amount.Amount) : undefined;
    const currentAccountOwner = currentAccount.Account.find(a => a.schemeName === "CUSTOMER.FULL.NAME")?.identification;
    const currentAccountType = currentAccount.AccountType;
    const currentAccountBankCode = currentAccountIban?.substring(5, 10);
    const currentAccoutNumber = currentAccountIban?.slice(-12);

    return {
      data: {
        currentAccountId,
        currentAccountName,
        currentAccountIban,
        currentAccountBankCode,
        currentAccoutNumber,
        currentAccountOwner,
        currentAccountCurrencyType,
        currentAccountBalance,
        currentAccountCustomerFullName,
        currentAccountType,
      },
    };
  }, [accountData, currentAccount, balances, currentAccountId]);
}
