import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { Categories, UpdatedSubCategories } from "./types";

const queryKeys = {
  all: ["notification-preferences"] as const,
};

export function useNotificationPreferences() {
  const { userId } = useAuthContext();

  return useQuery(queryKeys.all, () => {
    return api<Categories[]>("v1", "customer/notifications", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["userId"]: "0000001321", //TODO: replace with userId from useAuthContext(), once function returns authenticated user
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
  const { userId } = useAuthContext();

  return useMutation(
    (values: UpdatedSubCategories[]) => {
      return api<void>("v1", "customer/notifications", "PATCH", undefined, values, {
        ["x-correlation-id"]: generateRandomId(),
        ["userId"]: "0000001321", //TODO: replace with userId from useAuthContext(), once function returns authenticated user
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.all);
      },
    }
  );
}
