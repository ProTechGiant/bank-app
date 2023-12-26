import { useMutation } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

const NI_CLIENT_SECRET = "5uL8FWhOhO4O8kjPTuYscDAcSz72zzfX";
const NI_CLIENT_ID = "XrcdG1F8IQoFMPdFlj6DYtThdMZyMGL5uXJB5F7owGKa4ZLf";
const NI_GRANT_TYPE = "client_credentials";

export interface GetTokenResponse {
  AccessToken: string;
  TokenType: string;
  ExpiresIn: string;
}
const GetTokenParams = {
  ClientId: NI_CLIENT_ID,
  ClientSecret: NI_CLIENT_SECRET,
  GrantType: NI_GRANT_TYPE,
};
export function useGetToken() {
  return useMutation(async () => {
    return api<GetTokenResponse>("v1", `cards/token`, "POST", undefined, GetTokenParams, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
