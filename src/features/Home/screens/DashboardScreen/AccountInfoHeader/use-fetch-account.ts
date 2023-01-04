import { useEffect, useState } from "react";
import { useQuery } from "react-query";

import agent from "@/Axios/AxiosAgent";
import { Account, Balance } from "@/types/account";

export const useFetchAccount = () => {
  const [accountId, setAccountId] = useState("");
  const [data, setData] = useState({
    currentAccountName: "",
    currentAccountIBAN: "",
    currencyType: "",
    currentAccountBalance: "",
    decimalBalance: "",
  });
  const accountsEndpoint = `/v1/accounts`;
  const balancesEndpoint = `/v1/accounts/${accountId}/balances`;

  const accounts = useQuery<Account[]>("dataAcc", async () => await agent.SL.account(accountsEndpoint));
  const balances = useQuery<Balance[]>(
    ["balanceData", { accountId }],
    async () => await agent.SL.balance(balancesEndpoint),
    {
      enabled: accountId.length > 0,
    }
  );

  useEffect(() => {
    if (accounts.data) {
      const currentAccount = accounts.data.map((data: Account) => {
        return data.Data.Account.find(acc => {
          return acc.AccountType === "CURRENT";
        });
      })?.[0];
      setData(data => ({
        ...data,
        currentAccountName: currentAccount?.Description ?? "",
        currentAccountIBAN:
          currentAccount?.Account?.find(acc => {
            return acc.schemeName === "IBAN.NUMBER";
          })?.identification ?? "",
      }));
      setAccountId(currentAccount?.AccountId ?? "");
    }
  }, [accounts.status]);

  useEffect(() => {
    if (balances.status === "success") {
      const currentAccountStatus = balances.data.map((data: Balance) => {
        return data.Data.Balance.find(acc => {
          return acc.Type === "INTERIM_AVAILABLE" && acc.AccountId === accountId;
        });
      })?.[0];
      setData(data => ({
        ...data,
        currencyType: currentAccountStatus?.Amount?.Currency ?? "",
      }));
      const [int, dec] = currentAccountStatus?.Amount?.Amount?.split(".") ?? ["", ""];
      setData(data => ({
        ...data,
        currentAccountBalance: int.length ? Intl.NumberFormat("en-US", {}).format(Number(int)) : "",
        decimalBalance: dec,
      }));
    }
  }, [balances.status]);

  return { data };
};
