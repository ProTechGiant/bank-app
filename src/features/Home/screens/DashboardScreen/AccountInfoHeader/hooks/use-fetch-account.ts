import { useMemo } from "react";
import { useQuery } from "react-query";

import api from "@/api";

import { Account, Balance } from "../types/account";

export default function useFetchAccount() {
  const accounts = useQuery("accounts", () => {
    return api<Account[]>("v1", "accounts", "GET", undefined, undefined);
  });

  const { currentAccountName, currentAccountIBAN, accountId, customerFullName } = useMemo(() => {
    const currentAccount = accounts?.data?.map((data: Account) => {
      return data.Data.Account.find(acc => {
        return acc.AccountType === "CURRENT";
      });
    })?.[0];

    //reading customer info data
    const customerInfo = accounts?.data?.map((data: Account) => {
      return data?.Data?.SupplementaryData;
    });

    const customerFullName = customerInfo ? customerInfo[0].CustomerFullName : "";

    const currentAccountName = currentAccount?.Description ?? "";
    const currentAccountIBAN =
      currentAccount?.Account?.find(acc => {
        return acc.schemeName === "IBAN.NUMBER";
      })?.identification ?? "";
    const accountId = currentAccount?.AccountId ?? "";
    return { currentAccountName, currentAccountIBAN, accountId, customerFullName };
  }, [accounts]);

  const balances = useQuery(
    ["balances", { accountId }],
    () => {
      return api<Balance[]>("v1", `accounts/${accountId}/balances`, "GET", undefined, undefined);
    },
    {
      enabled: accountId?.length > 0,
    }
  );

  const { currencyType, currentAccountBalance, decimalBalance } = useMemo(() => {
    const currentAccountStatus = balances?.data?.map((data: Balance) => {
      return data.Data.Balance.find(acc => {
        return acc.Type === "INTERIM_AVAILABLE" && acc.AccountId === accountId;
      });
    })?.[0];
    const currencyType = currentAccountStatus?.Amount?.Currency ?? "";
    const [int, dec] = currentAccountStatus?.Amount?.Amount?.split(".") ?? ["", ""];
    const currentAccountBalance = int.length ? Intl.NumberFormat("en-US", {}).format(Number(int)) : "";
    const decimalBalance = dec;
    return { currencyType, currentAccountBalance, decimalBalance };
  }, [balances, accountId]);

  return {
    data: {
      accountId,
      currentAccountName,
      currentAccountIBAN,
      currencyType,
      currentAccountBalance,
      decimalBalance,
      customerFullName,
    },
  };
}
