import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { Categories, UpdatedSubCategories } from "./types";

const queryKeys = {
  all: ["notification-preferences"] as const,
};

export function useNotificationPreferences() {
  return useQuery(queryKeys.all, () => {
    return api<Categories[]>("v1", "customer/notifications", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
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
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.all);
      },
    }
  );
}
