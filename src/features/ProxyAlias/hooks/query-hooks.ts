import { useMutation, useQuery } from "react-query";

import sendApiRequest from "@/api";
import api from "@/api";
import { useCurrentAccount } from "@/hooks/use-accounts";
import { generateRandomId } from "@/utils";

import {
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

interface LinkProxyAliasResponse {
  status: string;
  message: string;
}

export function useRegisterCustomer() {
  return useMutation(async () => {
    return sendApiRequest<RegisterCustomerResponseApi>("v1", `ips/register`, "POST", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useGetTermsAndConditions() {
  const account = useCurrentAccount();

  const account_id = account.data?.id;

  return useQuery(
    ["terms-and-conditions"],
    () =>
      api<TermsAndConditionsResponseApi>("v1", `ips/terms-and-conditions`, "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
      }),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
    }
  );
}

export function useGetUserProxies() {
  const account = useCurrentAccount();

  const account_id = account.data?.id;

  return useQuery(
    ["terms-and-conditions"],
    () =>
      api<UserProxiesResponse>("v1", `ips/proxies`, "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
      }),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
      enabled: !!account_id,
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

    return { linkResponeseStatus: response.status };
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

    return { unlinkResponeseStatus: response.status };
  });
}
