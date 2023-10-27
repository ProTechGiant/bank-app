import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

import { ConsentDataResponse, PushConsentBodyRequest } from "../types";

interface PushConsentResponse {
  Status: string;
  Message: string;
}

export function usePushConsent() {
  return useMutation((requestBody: PushConsentBodyRequest) => {
    return sendApiRequest<PushConsentResponse>(
      "v1",
      `open-banking/account-access-consents/authorize`,
      "POST",
      undefined,
      requestBody,
      {
        ["x-correlation-id"]: generateRandomId(),
        // TODO: Remove the static ID when the onboarding flow for the user is completed.
        ["UserId"]: "1000001208",
      }
    );
  });
}

export function useGetConsent() {
  const { i18n } = useTranslation();

  return useQuery(
    ["consentData"],
    () =>
      sendApiRequest<ConsentDataResponse>("v1", `open-banking/account-access-consents`, "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language.toUpperCase(),
        // TODO: Remove the static ID when the onboarding flow for the user is completed.
        ["UserId"]: "1000001208",
      }),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
    }
  );
}
