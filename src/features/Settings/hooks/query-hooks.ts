import { StringifiableRecord } from "query-string";
import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import {
  ConsentDetailedResponse,
  GetTppListApiResponseInterface,
  GetUserConnectedServicesInterface,
  GetUserConsentAPIParamsInterface,
  SuccessApiResponse,
} from "../types";

interface LanguagePreferred {
  PreferredLanguageCode: string;
  NotificationLanguageCode: string;
}
const queryKeys = {
  homeLayout: () => ["layout", "getLayout"] as const,
  all: () => ["customerProfileData"] as const,
  getLayout: () => [...queryKeys.all(), "getLayout"],
  getUserConsent: (queryParams: GetUserConsentAPIParamsInterface) => [
    ...queryKeys.all(),
    "getUserConsents",
    queryParams,
  ],
  getTppList: () => [...queryKeys.all(), "getUserConsents"],
  getTodosList: (type: string) => [...queryKeys.all(), "getTodosList", { type }],
  getConsentDetailed: (consentId: string) => [...queryKeys.all(), "getConsentDetailed", { consentId }] as const,
};
interface UpdatePasscodeStatus {
  UpdatePasscodeEnabled: boolean;
}

const queryKey = {
  all: () => ["update-passcode-limit"] as const,
};

export function useUpdateCustomerProfileLanguage() {
  const queryClient = useQueryClient();

  return useMutation(
    async (values: LanguagePreferred) => {
      return api(
        "v1",
        "customers/languages",
        "PATCH",
        undefined,
        {
          PreferredLanguageCode: values.PreferredLanguageCode,
          NotificationLanguageCode: values.NotificationLanguageCode,
        },
        {
          ["x-correlation-id"]: generateRandomId(),
          ["x-device-id"]: DeviceInfo.getDeviceId(),
        }
      );
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.all());
      },
    }
  );
}

export function useHomepageLayout() {
  const { userId } = useAuthContext();

  return useQuery(queryKeys.getLayout(), () => {
    return api("v1", `customers/${userId}/homepage`, "GET", {
      ["x-Correlation-Id"]: generateRandomId(),
    });
  });
}

export function usePostHomepageLayout() {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ values }) => {
      return api("v1", `customers/${userId}/homepage`, "POST", undefined, values, {
        ["x-Correlation-Id"]: generateRandomId(),
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.homeLayout());
      },
    }
  );
}

export const useCheckDailyPasscodeLimit = () => {
  return useQuery(queryKey.all(), async () => {
    return api<UpdatePasscodeStatus>("v2", "customers/passcode-update-flag", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
};

export const useGetAccountAccessConsents = (queryParams: GetUserConsentAPIParamsInterface) => {
  const { i18n } = useTranslation();
  return useQuery(queryKeys.getUserConsent(queryParams), () => {
    const params = queryParams as unknown as StringifiableRecord;
    return api<GetUserConnectedServicesInterface>(
      "v1",
      "open-banking/account-access-consents/list",
      "GET",
      params,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Authorization"]: generateRandomId(),
        ["Accept-Language"]: i18n.language.toUpperCase(),
      }
    );
  });
};

export const useGetTppList = () => {
  const { i18n } = useTranslation();
  return useQuery(queryKeys.getTppList(), () => {
    return api<GetTppListApiResponseInterface>(
      "v1",
      "open-banking/account-access-consents/tpps",
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Authorization"]: generateRandomId(),
        ["Accept-Language"]: i18n.language.toUpperCase(),
      }
    );
  });
};

export function useGetConsentDetailed(consentId: string) {
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.getConsentDetailed(consentId),
    () =>
      api<ConsentDetailedResponse>(
        "v1",
        `open-banking/account-access-consents/${consentId}`,
        "GET",
        undefined,
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language.toUpperCase(),
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
    }
  );
}

export const useManageBiometrics = () => {
  const correlationId = generateRandomId();

  return useMutation(async (ActionId: string) => {
    return api<true>(
      "v2",
      `customers/biometric`,
      "POST",
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

export const handleOnManageBiometrics = (ActionId: string) => {
  const correlationId = generateRandomId();
  return api<true>(
    "v2",
    `customers/biometric`,
    "POST",
    undefined,
    {
      ActionId,
    },
    {
      ["x-correlation-id"]: correlationId,
    }
  );
};

export function useUpdateTPPNickName() {
  const correlationId = generateRandomId();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ consentId, TPPNickName }: { consentId: string; TPPNickName: string }) => {
      return api<SuccessApiResponse>(
        "v1",
        `open-banking/account-access-consents/tpp/${consentId}`,
        "PATCH",
        undefined,
        {
          TPPNickName,
        },
        {
          ["x-correlation-id"]: correlationId,
          ["Accept-Language"]: i18n.language.toUpperCase(),
        }
      );
    },
    {
      onMutate: variables => {
        queryClient.setQueryData(queryKeys.getConsentDetailed(variables.consentId), variables.TPPNickName);
      },
      onSuccess: (_, variables) => {
        // Refetch the getConsentDetailed query with the specific consent ID
        const consentId = variables.consentId;
        queryClient.invalidateQueries(queryKeys.getConsentDetailed(consentId));
      },
    }
  );
}

export function useRevokeConsent() {
  const correlationId = generateRandomId();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation(
    async ({ consentId }: { consentId: string }) => {
      return api<SuccessApiResponse>(
        "v1",
        `open-banking/account-access-consents/${consentId}`,
        "DELETE",
        undefined,
        undefined,
        {
          ["x-correlation-id"]: correlationId,
          ["Accept-Language"]: i18n.language.toUpperCase(),
        }
      );
    },
    {
      onSuccess: async () => {
        // Refetch queries to update the local data
        await queryClient.invalidateQueries(queryKeys.getTppList());
      },
    }
  );
}

export function useGetTodosList(type: string) {
  const { i18n } = useTranslation();

  return useQuery(queryKeys.getTodosList(type), () =>
    api<ConsentDetailedResponse>("v1", `limit/actions?type=${type}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language.toUpperCase(),
    })
  );
}
