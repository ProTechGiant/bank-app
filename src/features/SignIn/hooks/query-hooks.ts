import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";

import { useSignInContext } from "../contexts/SignInContext";
import {
  CheckUserStatusResponse,
  LogInOtpChallengeParams,
  LoginUserType,
  RegistrationResponse,
  ValidateDeviceType,
} from "../types";

export function useCheckUser() {
  const { correlationId } = useSignInContext();
  return useMutation(({ NationalId }: { NationalId: string }) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");
    return sendApiRequest<{ HasPasscode: boolean }>(
      "v1",
      "customers/check/user",
      "POST",
      undefined,
      {
        NationalOrIqamaId: NationalId,
      },
      {
        ["x-Correlation-Id"]: correlationId,
      }
    );
  });
}

export function useLoginUser() {
  const { updatePhoneNumber } = useAuthContext();
  const { correlationId, setNationalId } = useSignInContext();

  return useMutation(
    async (passCode: string) => {
      if (!correlationId) throw new Error("Need valid `correlationId` to be available");

      return sendApiRequest<LoginUserType>(
        "v1",
        "customers/login",
        "POST",
        undefined,
        {
          Passcode: passCode,
        },
        {
          ["x-correlation-id"]: correlationId,
        }
      );
    },
    {
      onSuccess(data) {
        setNationalId(data.NationalOrIqamaId);
        updatePhoneNumber(data.MobileNumber);
      },
    }
  );
}

export function useValidateDevice() {
  const { correlationId } = useSignInContext();

  return useMutation(async (passcode: string) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<ValidateDeviceType>(
      "v1",
      "customers/validate-device",
      "POST",
      undefined,
      {
        Passcode: passcode,
      },
      {
        ["x-correlation-id"]: correlationId,
        ["x-device-id"]: "9898989", //TODO: for testing we are using this device id, will revert when done from BE side
      }
    );
  });
}

export function useCreatePasscode() {
  const { correlationId } = useSignInContext();

  return useMutation(async (passCode: string) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<string>(
      "v1",
      "customers/update/passcode",
      "PATCH",
      undefined,
      {
        Passcode: passCode,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useValidatePincode() {
  const { correlationId } = useSignInContext();

  return useMutation(async (pinCode: string) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<{ Status: boolean }>(
      "v1",
      "customers/validate-pin",
      "POST",
      undefined,
      {
        CardPin: pinCode,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useRegistration() {
  const { correlationId, nationalId } = useSignInContext();
  const { phoneNumber } = useAuthContext();

  const { i18n } = useTranslation();

  return useMutation((passCode: string) => {
    if (undefined === correlationId) throw new Error("Cannot fetch customers/registration without `correlationId`");

    return sendApiRequest<RegistrationResponse>(
      "v1",
      "customers/registration",
      "POST",
      undefined,
      {
        PassCode: passCode,
        NationalOrIqamaId: nationalId,
        MobileNumber: phoneNumber,
        Language: i18n.language.toUpperCase(),
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useCheckUserStatus() {
  const { correlationId } = useSignInContext();

  return useMutation(() => {
    if (undefined === correlationId) throw new Error("Cannot fetch customers/registration without `correlationId`");

    return sendApiRequest<CheckUserStatusResponse>("v1", "customers/check/user/status", "GET", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
    });
  });
}

export function useSignIn() {
  const { correlationId, setNationalId } = useSignInContext();
  const { updatePhoneNumber } = useAuthContext();

  return useMutation(
    (passcode: string) => {
      if (undefined === correlationId) throw new Error("Cannot fetch customers/sign-in without `correlationId`");

      return sendApiRequest<LoginUserType>(
        "v1",
        "customers/sign-in",
        "POST",
        undefined,
        {
          Passcode: passcode,
        },
        {
          ["x-correlation-id"]: correlationId,
        }
      );
    },
    {
      onSuccess(data) {
        setNationalId(data.NationalOrIqamaId);
        updatePhoneNumber(data.MobileNumber);
      },
    }
  );
}

export function useSendLoginOTP() {
  const { correlationId } = useSignInContext();

  return useMutation(async (reasonCode: "login" | "reset-passcode" | "change-passcode" | "create-passcode") => {
    if (undefined === correlationId) throw new Error("Cannot fetch customers/data without `correlationId`");

    return sendApiRequest<LogInOtpChallengeParams>(
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
