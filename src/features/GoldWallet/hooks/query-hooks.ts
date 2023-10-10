import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import api from "@/api";
import { TermsAndConditionContainer } from "@/types/Content";
import { generateRandomId } from "@/utils";

import { GetWalletResponseType } from "../types";

const queryKeys = {
  all: () => ["layout"],
  getWallet: () => [...queryKeys.all(), "getWallet"],
  createWallet: () => [...queryKeys.all(), "createWallet"],
  getTermsAndConditions: () => [...queryKeys.all(), "getTermsAndConditions"],
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

export function useTermsAndConditions() {
  const { i18n } = useTranslation();
  return useQuery(queryKeys.getTermsAndConditions(), () => {
    return api<TermsAndConditionContainer>("v1", `gold/terms-conditions`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
    });
  });
}
