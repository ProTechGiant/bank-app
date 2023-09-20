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
    //TODO: will be removed when API is ready
    const testMode = true;
    if (testMode) {
      return {
        AccessToken: "ytXYfc4ibY8ZmwQsBPbgZiW1uTAeQyTA",
        RefreshToken: "9g3ZExZ39hyBgaK56xKris3iKtmuKcmytasCPRmA",
        IdToken:
          "eyJraWQiOiI0NTdDXzhvWnVWOURiM2FZTzZ4MVN2UjYtNmpjR2xGRF9rNHBuUjczTkxnIiwiYWxnIjoiUlMyNTYifQ.eyJydF9oYXNoIjoiSkVLZEV4VEQ5d01tMElSMUhJZ3FXZyIsImlhdCI6MTY5MzEzMzU0OCwiaXNzIjoiaHR0cHM6Ly9pc3ZhLXJwMS5hcHBzLmRldi1ub25wcm9kLWlzdmEubnBuYmFuay5sb2NhbCIsImF0X2hhc2giOiJpV1I2ZFBub1lDeEJVMGhlNkd5aFp3Iiwic3ViIjoidGVzdHVzZXIxIiwiZXhwIjoxNjkzMTM3MTQ4LCJhdWQiOiJ0UjJvWjJXWW9rbnhyWnhIbm5YcyJ9.c7buL_hEF2DKwPWyJFKq1y46mDeta098higmEmcixIL_9ZPPi90GXE0sG0OO_DDAJUFMYKBilk7O0m1Eujp1LS9VgwelO4nsDLH7m48Ru67LA1WrkNSfcNoRpNjJf6wG_eIcgNr8cvFdNILFFUg3YpaInZac-ZnDnlFh5cmPDV0CU6hO1MRldRuEBHE2iBpspvHBlFVSbmYeutLY5iDJb_2DQdh4vEu4hyKMeuBO1N5dy61Mtaq4hZHwXhju1QuLZKhNOEfaggBTn5W5VlSWeegCfFDF54pS0xX3BCbS_4JcXzD6OL721YWxCMkHQ5a21DMOCBw7zzdPZmfUp0F_TA",
        TokenType: "bearer",
      };
    } else {
      return sendApiRequest<AuthenticationApiResponse>("v1", "api/authentication", "GET", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
        ["DeviceId"]: DeviceInfo.getDeviceId(),
        ["DeviceName"]: await DeviceInfo.getDeviceName(),
      });
    }
  });
}
