import DeviceInfo from "react-native-device-info";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { getConnectedServicesMock, getMockTppList } from "../mock/ConnectedServices.mock";

interface LanguagePreferred {
  PreferredLanguageCode: string;
  NotificationLanguageCode: string;
}
const queryKeys = {
  homeLayout: () => ["layout", "getLayout"] as const,
  all: () => ["customerProfileData"] as const,
  getLayout: () => [...queryKeys.all(), "getLayout"],
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

export const useGetAccountAccessConsents = () => {
  return useQuery([], () => {
    return getConnectedServicesMock();
    // return api<GetUserConnectedServicesInterface>(
    //   "v1",
    //   "open-banking/account-access-consents/list",
    //   "GET",
    //   undefined,
    //   undefined,
    //   {
    //     ["x-correlation-id"]: generateRandomId(),
    //     ["Authorization"]: generateRandomId(),
    //     ["Accept-Language"]: i18n.language,
    //   }
    // );
  });
};

export const useGetTppList = () => {
  return useQuery([], () => {
    return getMockTppList();
    // const { i18n } = useTranslation();
    //   "v1",
    //   "open-banking/account-access-consents/tpps",
    //   "GET",
    //   undefined,
    //   undefined,
    //   {
    //     ["x-correlation-id"]: generateRandomId(),
    //     ["Authorization"]: generateRandomId(),
    //     ["Accept-Language"]: i18n.language,
    //   }
    // );
  });
};
