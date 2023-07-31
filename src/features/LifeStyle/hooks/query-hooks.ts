import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { useMutation, useQuery, useQueryClient } from "react-query";

import sendApiRequest from "@/api";
import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

export interface Categories {
  CategoryId: string;
  CategoryName: string;
  CategoryDescription: string;
  CategoryLevel: number;
  ParentCategoryId: string;
  ImageUrl?: string;
  Selected: boolean;
}

interface LifeStyleInterests {
  CategoryId: string;
}

export const queryKeys = {
  all: () => ["categoryPreferences"] as const,
};

export function usePredefinedCategory() {
  const { i18n } = useTranslation();
  const { userId } = useAuthContext();

  return useQuery(queryKeys.all(), () =>
    sendApiRequest("v1", `lifestyles/preferences/${userId}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["x-device-id"]: DeviceInfo.getDeviceId(),
      ["Accept-Language"]: i18n.language.toUpperCase(),
    })
  );
}

export function useSubmitLifeStyleInterests() {
  const queryClient = useQueryClient();
  const { userId } = useAuthContext();

  return useMutation(
    async (values: LifeStyleInterests[]) => {
      return api("v1", `lifestyles/preferences/${userId}`, "PATCH", undefined, values, {
        ["x-correlation-id"]: generateRandomId(),
        ["x-device-id"]: DeviceInfo.getDeviceId(),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(queryKeys.all());
      },
    }
  );
}
