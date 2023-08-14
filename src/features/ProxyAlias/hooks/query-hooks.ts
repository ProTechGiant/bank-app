import { useMutation } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

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
