import DeviceInfo from "react-native-device-info";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useSignInContext } from "@/features/SignIn/contexts/SignInContext";

export interface AuthenticationApiResponse {
  AccessToken: string;
  RefreshToken: string;
  IdToken: string;
  TokenType: string;
  ExpiresIn?: number;
}

export function useGetAuthenticationToken() {
  const { correlationId } = useSignInContext();

  return useMutation(async () => {
    if (correlationId === undefined) throw new Error("Cannot fetch api/authentication without `correlationId`");
    return sendApiRequest<AuthenticationApiResponse>("v2", "api/authentication", "POST", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
      ["x-device-name"]: await DeviceInfo.getDeviceName(),
    });
  });
}
