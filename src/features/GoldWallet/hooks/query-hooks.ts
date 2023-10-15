import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { TermsAndConditionContainer } from "@/types/Content";
import { generateRandomId } from "@/utils";

import { AlertSettingsResponseType, GetWalletResponseType } from "../types";

const queryKeys = {
  all: () => ["layout"],
  getWallet: () => [...queryKeys.all(), "getWallet"],
  createWallet: () => [...queryKeys.all(), "createWallet"],
  getTermsAndConditions: () => [...queryKeys.all(), "getTermsAndConditions"],
  getAlertSettings: () => [...queryKeys.all(), "getAlertSettings"],
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
      return api<GetWalletResponseType>("v1", `gold/wallet`, "POST", undefined, undefined, {
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
        {
          customerId: userId,
        },
        { ...body },
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
