import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import api from "@/api";
import { generateRandomId } from "@/utils";

import { RegisterEmailInputs, RegisterEmailResponse } from "../types";

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
