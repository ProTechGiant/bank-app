import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import sendApiRequest from "@/api";
import api from "@/api";
import { generateRandomId } from "@/utils";

import {
  OptOutInputs,
  OptOutResponse,
  OtpChallengeParams,
  RegisterCustomerResponseApi,
  RegisterEmailInputs,
  RegisterEmailResponse,
  TermsAndConditionsResponseApi,
  UserProxiesResponse,
} from "../types";

export function useRegisterEmail() {
  return useMutation(async (email: RegisterEmailInputs) => {
    return sendApiRequest<RegisterEmailResponse>("v1", `ips/register-email`, "POST", undefined, email, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useOptOut() {
  return useMutation(async (input: OptOutInputs) => {
    return sendApiRequest<OptOutResponse>("v1", `ips/opt-out`, "POST", undefined, input, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

interface LinkProxyAliasResponse {
  Status: string;
  Message: string;
}

export function useRegisterCustomer() {
  return useMutation(async () => {
    return sendApiRequest<RegisterCustomerResponseApi>("v1", `ips/register`, "POST", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useGetTermsAndConditions() {
  const { i18n } = useTranslation();

  return useQuery(
    ["terms-and-conditions"],
    () =>
      api<TermsAndConditionsResponseApi>(
        "v1",
        `ips/terms-and-conditions`,
        "GET",
        {
          language: i18n.language,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
    }
  );
}

export function useGetUserProxies() {
  return useQuery(
    ["proxyAliases"],
    () =>
      api<UserProxiesResponse>("v1", `ips/proxies`, "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
      }),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
    }
  );
}

export function useLinkProxyAlias() {
  return useMutation(async (proxyTypeId: string) => {
    const correlationId = generateRandomId();

    const response = await api<LinkProxyAliasResponse>(
      "v1",
      `ips/link/${proxyTypeId}`,
      "POST",
      undefined,
      undefined,

      {
        ["x-correlation-id"]: correlationId,
      }
    );

    return { linkResponeseStatus: response.Status };
  });
}

export function useUnLinkProxyAlias() {
  return useMutation(async (registerationId: string) => {
    const correlationId = generateRandomId();

    const response = await api<LinkProxyAliasResponse>(
      "v1",
      `ips/unlink/${registerationId}`,
      "POST",
      undefined,
      undefined,

      {
        ["x-correlation-id"]: correlationId,
      }
    );

    return { unlinkResponeseStatus: response.Status };
  });
}

export function useSendProxiesOTP() {
  const correlationId = generateRandomId();

  //TODO: will change the reasons once we recicve it form the BE team.
  return useMutation(async (reasonCode: "register-email" | "link-proxy-alias" | "optout-proxy-alias") => {
    return sendApiRequest<OtpChallengeParams>(
      "v1",
      "customers/otps/send",
      "POST",
      undefined,
      {
        Reason: reasonCode,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}
