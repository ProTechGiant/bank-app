import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { OtpChallengeParams } from "@/features/OneTimePassword/types";
import { TermsAndConditionContainer } from "@/types/Content";
import {
  DealStatusEnum,
  GoldFinalDealResponseType,
  MeasureUnitEnum,
  TransactionTypeEnum,
} from "@/types/GoldTransactions";
import { generateRandomId } from "@/utils";

import { AlertSettingsResponseType, getTransactionsResponse, GetWalletResponseType } from "../types";

const queryKeys = {
  all: () => ["goldWallet"],
  getWallet: () => [...queryKeys.all(), "getWallet"],
  createWallet: () => [...queryKeys.all(), "createWallet"],
  getTermsAndConditions: () => [...queryKeys.all(), "getTermsAndConditions"],
  getWalletTransactions: () => [...queryKeys.all(), "getTransactions"],
  getAlertSettings: () => [...queryKeys.all(), "getAlertSettings"],
  getFinalDeal: () => [queryKeys.all(), "getFinalDeal"],
  acceptFinalDeal: () => [queryKeys.all(), "acceptFinalDeal"],
};

export function useWallet() {
  const { i18n } = useTranslation();
  return useQuery(queryKeys.getWallet(), () => {
    return api<GetWalletResponseType>("v1", `gold/wallet`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function useCreateWallet() {
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(
    () => {
      return api<GetWalletResponseType>("v1", `gold/wallet`, "POST", { acceptTCFlg: 1 }, undefined, {
        ["x-Correlation-Id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.getWallet());
      },
    }
  );
}

export function useTermsAndConditions() {
  const { i18n } = useTranslation();
  return useQuery(queryKeys.getTermsAndConditions(), () => {
    return api<TermsAndConditionContainer>("v1", `gold/terms-conditions`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function useWalletTransaction(walletId: string | undefined) {
  const { i18n } = useTranslation();
  return useQuery(
    queryKeys.getWalletTransactions(),
    () => {
      return api<getTransactionsResponse>(
        "v1",
        `gold/wallet/${walletId}/transactions`,
        "GET",
        {
          PageSize: 4, //TODO will be repalce with real pagination once BE API be available
          PageOffset: 1,
        },
        undefined,
        {
          ["x-Correlation-Id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language,
        }
      );
    },
    { enabled: !!walletId, select: response => response.Transactions }
  );
}

export function useAlertSettings() {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();
  return useQuery(queryKeys.getAlertSettings(), () => {
    return api<AlertSettingsResponseType>(
      "v1",
      `gold/price-alert`,
      "GET",
      {
        customerId: userId,
      },
      undefined,
      {
        ["x-Correlation-Id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language,
      }
    );
  });
}

export function useSetAlertSettings() {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();

  const queryClient = useQueryClient();
  return useMutation(
    (body: AlertSettingsResponseType) => {
      return api(
        "v1",
        `gold/price-alert`,
        "POST",
        undefined,
        { ...body, CustomerId: userId },
        {
          ["x-Correlation-Id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language,
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.getAlertSettings());
      },
    }
  );
}

export function useFinalDeal({
  walletId,
  weight,
  type,
  measureUnit,
}: {
  walletId: string;
  weight: number;
  type: TransactionTypeEnum;
  measureUnit: MeasureUnitEnum;
}) {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();
  return useQuery(queryKeys.getFinalDeal(), () => {
    return api<GoldFinalDealResponseType>(
      "v1",
      "gold/final-deal",
      "POST",
      undefined,
      {
        CustomerId: userId,
        WalletId: walletId,
        Weight: weight,
        Type: type,
        MeasureUnit: measureUnit,
      },
      {
        ["Accept-Language"]: i18n.language,
        ["x-Correlation-Id"]: generateRandomId(),
      }
    );
  });
}

export function useAcceptFinalDeal() {
  const { userId } = useAuthContext();
  const { i18n } = useTranslation();
  return useMutation(
    queryKeys.acceptFinalDeal(),
    ({
      TrxnId,
      TransactionKey,
      Status,
      Weight,
      SupplierName,
      Qty,
      Purity,
      SourceRefNo,
      walletId,
      TotalAmount,
      Type,
    }: {
      TrxnId?: string;
      TransactionKey?: string;
      Status?: DealStatusEnum;
      Weight?: number;
      SupplierName?: string;
      Qty?: number;
      Purity?: string;
      SourceRefNo?: string;
      walletId?: string;
      TotalAmount: number;
      Type: TransactionTypeEnum;
    }) => {
      return api(
        "v1",
        "gold/final-deal-acceptance",
        "POST",
        undefined,
        {
          CustomerId: userId,
          TrxnId,
          TransactionKey,
          Status,
          Weight,
          SupplierName,
          Qty,
          Purity,
          SourceRefNo,
          WalletId: walletId,
          TotalAmount,
          Type,
          LinkedAccount: "100001403", // TODO will be replaced when BE finish integrate with market place
        },
        {
          ["x-Correlation-Id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language,
        }
      );
    }
  );
}

export function useOtpGeneration() {
  return useMutation(() => {
    return api<OtpChallengeParams>("v1", "gold/otps/send", "POST", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
    });
  });
}
