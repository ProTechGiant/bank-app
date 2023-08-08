import DeviceInfo from "react-native-device-info";
import { useMutation, useQueryClient } from "react-query";

import api from "@/api";
import { queryKeys } from "@/hooks/use-customer-profile";
import { generateRandomId } from "@/utils";

interface LanguagePreferred {
  PreferredLanguageCode: string;
  NotificationLanguageCode: string;
}

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
