import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { Categories, UpdatedSubCategories } from "./types";

const queryKeys = {
  all: ["notification-preferences"] as const,
};

export function useNotificationPreferences() {
  return useQuery(queryKeys.all, () => {
    return api<Categories[]>("v1", "customer/notifications", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["userId"]: "34e16d1c-ebee-4faf-89ad-75c8140f68f0", //TODO: temp uuid, will change later once auth is set
    });
  });
}

export function useNotificationPreferencesCategory(categoryId: string) {
  const preferences = useNotificationPreferences();
  return {
    data: preferences.data?.find(category => category.CategoryId === categoryId)?.SubCategories ?? [],
  };
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation(
    (values: UpdatedSubCategories[]) => {
      return api<void>("v1", "customer/notifications", "PATCH", undefined, values, {
        ["x-correlation-id"]: generateRandomId(),
        ["userId"]: "34e16d1c-ebee-4faf-89ad-75c8140f68f0", //TODO: temp uuid, will change later once auth is set
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.all);
      },
    }
  );
}
