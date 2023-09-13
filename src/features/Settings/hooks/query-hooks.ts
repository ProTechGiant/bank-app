import DeviceInfo from "react-native-device-info";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { queryKeys } from "@/hooks/use-customer-profile";
import { generateRandomId } from "@/utils";

interface LanguagePreferred {
  PreferredLanguageCode: string;
  NotificationLanguageCode: string;
}

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

export const useCheckDailyPasscodeLimit = () => {
  return useQuery(queryKey.all(), async () => {
    return api<UpdatePasscodeStatus>("v1", "customers/passcode-update-flag", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
};
