import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { useMutation, useQuery } from "react-query";

import sendApiRequest from "@/api";
import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { ActionsIds, OPERATION_TYPE } from "../constants";
import { useSignInContext } from "../contexts/SignInContext";
import {
  CheckCustomerStatusResponse,
  CheckUserStatusResponse,
  DeviceList,
  LogInOtpChallengeParams,
  LoginUserType,
  RegistrationResponse,
  RequestNumberResponseType,
  ValidateDeviceType,
} from "../types";

const queryKeys = {
  all: () => ["data"],
};

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
  const { correlationId } = useSignInContext();
  const { setRefreshToken } = useAuthContext();

  return useMutation(
    async ({ passCode, nationalId, method }: { passCode: string; nationalId: string; method: string }) => {
      if (!correlationId) throw new Error("Need valid `correlationId` to be available");

      return sendApiRequest<LoginUserType>(
        "v2",
        "customers/sign-in",
        "POST",
        undefined,
        {
          Passcode: passCode,
          NationalId: nationalId,
        },
        {
          ["x-correlation-id"]: correlationId,
          ["x-forwarded-for"]: DeviceInfo.getIpAddressSync(),
          ["LoginMethod"]: method,
        }
      );
    },
    {
      onSuccess(data) {
        setRefreshToken(data.RefreshToken);
      },
    }
  );
}

export function useConfirmIVR() {
  return useMutation(async ({ correlationId, operation }: { correlationId: string; operation: OPERATION_TYPE }) => {
    return api<boolean>(
      "v2",
      `ivr/confirm`,
      "PATCH",
      undefined,
      {
        Operation: operation,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function handleOnRegisterNewDevice({
  passCode,
  nationalId,
  correlationId,
}: {
  passCode: string;
  nationalId: string;
  correlationId: string;
}) {
  if (!correlationId) throw new Error("Need valid `correlationId` to be available");
  return sendApiRequest<LoginUserType>(
    "v2",
    "customers/sign-in/register",
    "POST",
    undefined,
    {
      Passcode: passCode,
      NationalId: nationalId,
    },
    {
      ["x-correlation-id"]: correlationId,
      ["x-forwarded-for"]: DeviceInfo.getIpAddressSync(),
    }
  );
}

export function handleOnOneTimeLogin({
  passCode,
  nationalId,
  correlationId,
}: {
  passCode: string;
  nationalId: string;
  correlationId: string;
}) {
  return sendApiRequest<LoginUserType>(
    "v2",
    "customers/sign-in/one-time",
    "POST",
    undefined,
    {
      Passcode: passCode,
      NationalId: nationalId,
    },
    {
      ["x-correlation-id"]: correlationId,
      ["x-forwarded-for"]: DeviceInfo.getIpAddressSync(),
    }
  );
}

export function useValidatePasscode() {
  const { correlationId } = useSignInContext();

  return useMutation(async ({ passCode, nationalId }: { passCode: string; nationalId: string }) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<{ DiffUserFlag: number }>(
      "v2",
      "customers/passcode/validate",
      "POST",
      undefined,
      {
        Passcode: passCode,
        NationalId: nationalId,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
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
      }
    );
  });
}

export function useRequestNumber() {
  const { correlationId, setTransactionId, nationalId } = useSignInContext();
  const { i18n } = useTranslation();

  if (!correlationId) throw new Error("Need valid `correlationId` to be available");

  return useMutation(
    async () => {
      return api<RequestNumberResponseType>("v2", "customers/nafath/get-transaction-id", "GET", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18n.language.toUpperCase(),
        ["IDNumber"]: nationalId || "",
      });
    },
    {
      onSuccess(data) {
        const transValue = data.Body.transId;
        setTransactionId(transValue);
      },
    }
  );
}

export function useGetCustomerDetails() {
  const { correlationId, transactionId } = useSignInContext();
  const { i18n } = useTranslation();

  if (!correlationId) throw new Error("Need valid `correlationId` to be available");

  return useQuery(queryKeys.all(), () => {
    return api<{ OnboardingDate: string }>(
      "v2",
      "customers/nafath/cust-info",
      "GET",
      {
        transactionId,
      },
      undefined,
      {
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18n.language.toUpperCase(),
      }
    );
  });
}

export function useCreatePasscode() {
  const { correlationId } = useSignInContext();

  return useMutation(
    async ({ passCode, currentPasscode }: { passCode: string; currentPasscode: string | undefined }) => {
      if (!correlationId) throw new Error("Need valid `correlationId` to be available");

      return sendApiRequest<string>(
        "v2",
        "customers/passcode/update",
        "PATCH",
        undefined,
        {
          NewPasscode: passCode,
          CurrentPasscode: currentPasscode,
        },
        {
          ["x-correlation-id"]: correlationId,
        }
      );
    }
  );
}

export const useManageDevice = () => {
  const { correlationId } = useSignInContext();

  return useMutation(async ({ ActionId, isvaUserId }: { ActionId: ActionsIds; isvaUserId: string | undefined }) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<string>(
      "v2",
      `customers/device/manage/${isvaUserId}`,
      "PATCH",
      undefined,
      {
        ActionId,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
};

export function useGetDevices() {
  const { userId } = useAuthContext();
  const { correlationId } = useSignInContext();

  if (!correlationId) throw new Error("Need valid `correlationId` to be available");

  return useQuery<DeviceList>("devices", () => {
    return sendApiRequest<DeviceList>("v2", `customers/${userId}/devices`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
    });
  });
}

export const useResetPasscode = () => {
  const { correlationId } = useSignInContext();

  return useMutation(async ({ Passcode, isvaUserId }: { Passcode: string; isvaUserId: string | undefined }) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<string>(
      "v2",
      `customers/passcode/reset/${isvaUserId}`,
      "PATCH",
      undefined,
      {
        Passcode,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
};

export function useValidatePincode() {
  const { correlationId } = useSignInContext();

  return useMutation(async (pinCode: string) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<{ Status: boolean }>(
      "v2",
      "customers/card-pin-verify",
      "POST",
      undefined,
      {
        PIN: pinCode,
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

export const useUpdatePasscode = () => {
  const { correlationId } = useSignInContext();

  return useMutation(async ({ newPasscode, currentPasscode }: { newPasscode: string; currentPasscode: string }) => {
    if (!correlationId) throw new Error("Need valid `correlationId` to be available");

    return sendApiRequest<string>(
      "v2",
      `customers/passcode/update`,
      "PATCH",
      undefined,
      {
        NewPasscode: newPasscode,
        CurrentPasscode: currentPasscode,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
};

export function useCheckCustomerStatus() {
  const { correlationId } = useSignInContext();

  return useMutation((customerId: string) => {
    if (undefined === correlationId) throw new Error("Cannot fetch customers/registration without `correlationId`");

    return sendApiRequest<CheckCustomerStatusResponse>(
      "v2",
      `customers/${customerId}/status`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useRequestNumberPanic() {
  const { correlationId, setTransactionId, nationalId } = useSignInContext();
  const { i18n } = useTranslation();

  if (!correlationId) throw new Error("Need valid `correlationId` to be available");

  return useMutation(
    async () => {
      return api<RequestNumberResponseType>("v1", "customers/panic/get-transaction-id", "POST", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18n.language.toUpperCase(),
        ["IDNumber"]: nationalId || "",
        ["deviceId"]: DeviceInfo.getDeviceId(),
      });
    },
    {
      onSuccess(data) {
        const transValue = data.Body.transId;
        setTransactionId(transValue);
      },
    }
  );
}

export function useRequestNumberResetPassCode() {
  const { correlationId, setTransactionId, nationalId } = useSignInContext();
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();

  if (!correlationId) throw new Error("Need valid `correlationId` to be available");

  return useMutation(
    async () => {
      return api<RequestNumberResponseType>("v2", "customers/nafath/get-transaction-id", "GET", undefined, undefined, {
        ["x-correlation-id"]: correlationId,
        ["Accept-Language"]: i18n.language.toUpperCase(),
        ["IDNumber"]: nationalId || "",
        ["deviceId"]: DeviceInfo.getDeviceId(),
        ["UserId"]: userId ?? "",
      });
    },
    {
      onSuccess(data) {
        const transValue = data.Body.transId;
        setTransactionId(transValue);
      },
    }
  );
}

export function usePanicMode() {
  const correlationId = generateRandomId();

  const { userId } = useAuthContext();

  if (!correlationId) throw new Error("Need valid `correlationId` to be available");
  return useMutation(
    async ({
      isPanic,
      nationalId,
      mobileNumber,
      token,
    }: {
      isPanic: boolean;
      nationalId: string;
      mobileNumber: string;
      token: string;
    }) => {
      return api<string>(
        "v1",
        `customers/${userId}/panic`,
        "POST",
        undefined,
        {
          IsPanic: isPanic,
          Poi: nationalId,
          MobileNumber: mobileNumber,
        },
        {
          ["x-correlation-id"]: correlationId,
          ["Authorization"]: `Bearer ${token}`,
        }
      );
    }
  );
}

export async function handleOnResetPasscode({
  Passcode,
  isvaUserId,
  correlationId,
}: {
  Passcode: string;
  isvaUserId: string | undefined;
  correlationId: string;
}) {
  return sendApiRequest<void>(
    "v2",
    `customers/passcode/reset/${isvaUserId}`,
    "PATCH",
    undefined,
    {
      Passcode,
    },
    {
      ["x-correlation-id"]: correlationId,
      ["x-device-name"]: await DeviceInfo.getDeviceName(),
    }
  );
}
