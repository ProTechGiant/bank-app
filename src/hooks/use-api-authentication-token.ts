import DeviceInfo from "react-native-device-info";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSignInContext } from "@/features/SignIn/contexts/SignInContext";
import { generateRandomId } from "@/utils";
import { setItemInEncryptedStorage } from "@/utils/encrypted-storage";

export interface AuthenticationApiResponse {
  AccessToken: string;
  RefreshToken: string;
  IdToken: string;
  TokenType: string;
  ExpiresIn?: number;
}

export function useGetAuthenticationToken() {
  const { correlationId } = useSignInContext();
  const auth = useAuthContext();
  return useMutation(
    async () => {
      return sendApiRequest<AuthenticationApiResponse>("v2", "api/authentication", "POST", undefined, undefined, {
        ["x-correlation-id"]: correlationId || generateRandomId(),
      });
    },
    {
      onSuccess(data) {
        setItemInEncryptedStorage("authToken", data.AccessToken);
        auth.setAuthToken(data.AccessToken);
      },
    }
  );
}

export function useRefreshAuthenticationToken() {
  const { correlationId } = useSignInContext();
  const auth = useAuthContext();
  return useMutation(
    async () => {
      if (correlationId === undefined)
        throw new Error("Cannot fetch customers/sign-in/refresh without `correlationId`");
      return sendApiRequest<AuthenticationApiResponse>(
        "v2",
        "customers/sign-in/refresh",
        "POST",
        undefined,
        undefined,
        {
          ["x-correlation-id"]: correlationId,
          ["Authorization"]: "Bearer " + auth.refreshToken,
        }
      );
    },
    {
      onSuccess(data) {
        setItemInEncryptedStorage("authToken", data.AccessToken);
        auth.setAuthToken(data.AccessToken);
        auth.setRefreshToken(data.RefreshToken);
      },
    }
  );
}
