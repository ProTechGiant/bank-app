/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  AccountType,
  ApiAccountResponseElement,
  ApiBalanceResponseElement,
  useCurrentAccount,
} from "@/hooks/use-accounts";
import { useHomeConfiguration, usePostHomeConfigurations } from "@/hooks/use-homepage";
import { warn } from "@/logger";
import { HomepageItemLayoutType, QuickActionType } from "@/types/Homepage";

import { useBulletinBoardTasks, useHomePageContent } from "../hooks/query-hooks";
import { BulletinTasksResponse, DEFAULT_BULLETIN_BOARD } from "../types";

interface HomepageContentContextProps {
  quickActions: QuickActionType[];
  setQuickActions: (value: QuickActionType[]) => void;
  refetchHomeConfigurations: () => void;
  layout: HomepageItemLayoutType[];
  setLayout: (value: HomepageItemLayoutType[]) => void;
  bulletinBoardTasks: BulletinTasksResponse;
  account: AccountType | undefined;
  refetchBulletinBoardTasks: () => void;
  refetchCurrentAccount: () => void;
  isError: boolean;
  balanceVisibility: boolean;
  updateBalanceVisibility: (visibility: boolean) => void;
}

const HomepageContentContext = createContext<HomepageContentContextProps>({
  quickActions: [],
  setQuickActions: () => {
    // ..
  },
  refetchHomeConfigurations: () => {
    // ..
  },
  layout: [],
  setLayout: () => {
    // ..
  },
  bulletinBoardTasks: DEFAULT_BULLETIN_BOARD,
  account: undefined,
  refetchBulletinBoardTasks: () => {
    // ..
  },
  refetchCurrentAccount: () => {
    // ..
  },
  isError: false,
});

export function HomepageContentContextProvider({ children }: React.PropsWithChildren) {
  const { data: homepageData, isError } = useHomePageContent();
  const { data: homepageConfigurations, refetch: refetchHomeConfigurations } = useHomeConfiguration(false);
  const { data: account, refetch: refetchCurrentAccount } = useCurrentAccount(false);
  const postHomepageContent = usePostHomeConfigurations();
  const {
    data: bulletinBoardTasks,
    isRefetchError: isBulletinBoardError,
    refetch: refetchBulletinBoardTasks,
  } = useBulletinBoardTasks();

  const [state, setState] = useState<
    Pick<HomepageContentContextProps, "quickActions" | "layout" | "bulletinBoardTasks" | "account">
  >({
    quickActions: [],
    layout: [],
    bulletinBoardTasks: DEFAULT_BULLETIN_BOARD,
    account: undefined,
  });

  useEffect(() => {
    if (homepageData !== undefined) {
      const currentAccount = extractCurrentAccountData(
        homepageData.Products[0].Accounts.Account,
        homepageData.Products[0].Accounts.Balance
      );
      setState(prevState => ({
        ...prevState,
        layout: homepageData.Layouts,
        quickActions: homepageData.Shortcuts,
        bulletinBoardTasks: homepageData.Actions,
        account: currentAccount,
        balanceVisibility: homepageData.BalanceVisibility,
      }));
    }
  }, [homepageData]);

  useEffect(() => {
    if (bulletinBoardTasks !== undefined) setState(prevState => ({ ...prevState, bulletinBoardTasks }));
  }, [bulletinBoardTasks]);

  useEffect(() => {
    if (isBulletinBoardError) setState(prevState => ({ ...prevState, bulletinBoardTasks: DEFAULT_BULLETIN_BOARD }));
  }, [isBulletinBoardError]);

  useEffect(() => {
    if (account !== undefined && account.id !== state.account?.id) setState(prevState => ({ ...prevState, account }));
  }, [account]);

  useEffect(() => {
    if (homepageConfigurations?.Shortcuts !== undefined)
      setState(prevState => ({ ...prevState, quickActions: homepageConfigurations?.Shortcuts }));
  }, [homepageConfigurations?.Shortcuts]);

  useEffect(() => {
    if (homepageConfigurations?.Layouts !== undefined)
      setState(prevState => ({ ...prevState, layout: homepageConfigurations?.Layouts }));
  }, [homepageConfigurations?.Layouts]);

  const handleOnSetConfigurations = async (layout: HomepageItemLayoutType[], quickActions: QuickActionType[]) => {
    setState(current => ({ ...current, quickActions, layout }));
    try {
      await postHomepageContent.mutateAsync({
        values: {
          Homepage: {
            Shortcuts: quickActions,
            HeroFeatures: [],
            Sections: layout,
          },
        },
      });
    } catch (err) {
      warn("homepage", "Could not post home configurations", JSON.stringify(err));
    }
  };

  const handleOnSetQuickActions = async (value: QuickActionType[]) => {
    handleOnSetConfigurations(state.layout, value);
  };

  const handleOnSetLayout = async (value: HomepageItemLayoutType[]) => {
    handleOnSetConfigurations(value, state.quickActions);
  };

  const extractCurrentAccountData = (
    accounts: ApiAccountResponseElement["Data"]["Account"],
    balances: ApiBalanceResponseElement["Data"]["Balance"]
  ): AccountType | undefined => {
    const accountData = accounts.find(a => a.AccountType === "CURRENT");
    const balanceData = balances.find(b => b.Type === "INTERIM_AVAILABLE");
    if (accountData === undefined || balanceData === undefined) return undefined;

    const iban = accountData.Account.find(value => value.SchemeName === "IBAN.NUMBER")?.Identification;
    if (iban === undefined) return undefined;

    return {
      iban,
      id: accountData.AccountId,
      name: accountData.Description,
      bankCode: iban.substring(5, 10),
      accountNumber: iban.slice(-12),
      owner: accountData.Account.find(value => value.SchemeName === "CUSTOMER.FULL.NAME")?.Identification,
      currencyType: balanceData.Amount.Currency,
      balance: Number(balanceData.Amount.Amount),
      accountType: accountData.AccountType,
    };
  };

  const updateBalanceVisibility = (balanceVisibility: boolean) => {
    setState(prevState => ({
      ...prevState,
      balanceVisibility,
    }));
  };

  return (
    <HomepageContentContext.Provider
      value={useMemo(
        () => ({
          ...state,
          setQuickActions: handleOnSetQuickActions,
          refetchHomeConfigurations,
          setLayout: handleOnSetLayout,
          refetchBulletinBoardTasks,
          refetchCurrentAccount,
          isError,
          updateBalanceVisibility,
        }),
        [state, handleOnSetQuickActions]
      )}>
      {children}
    </HomepageContentContext.Provider>
  );
}

export function useHomepageContent() {
  return useContext(HomepageContentContext);
}
