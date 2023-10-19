import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { generateRandomId } from "@/utils";

import { PushConsentBodyRequest } from "../types";

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
      { ["x-correlation-id"]: generateRandomId() }
    );
  });
}
