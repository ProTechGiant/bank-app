import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { HomepageItemLayoutType, QuickActionsType, TaskType } from "../types";

const queryKeys = {
  all: () => ["layout"],
  getLayout: () => [...queryKeys.all(), "getLayout"],
  getQuickActions: () => [...queryKeys.all(), "getShortcuts"],
};

interface HomepageSectionLayoutType {
  name: string;
  widgets: HomepageItemLayoutType[];
}

export interface HomepageLayoutType {
  tabs: [
    {
      name: string;
      sections: HomepageSectionLayoutType[];
    }
  ];
}

export function useHomepageLayout() {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();

  return useQuery(queryKeys.getLayout(), () => {
    return api<HomepageLayoutType>("v1", `customers/${userId}/homepage`, "GET", {
      ["x-Correlation-Id"]: correlationId,
    });
  });
}

export function usePostHomepageLayout() {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();

  return useMutation(async ({ values }: { values: HomepageLayoutType }) => {
    return api<HomepageLayoutType>("v1", `customers/${userId}/homepage`, "POST", undefined, values, {
      ["x-correlation-id"]: correlationId,
    });
  });
}

export function useQuickActions() {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();
  const { i18n } = useTranslation();
  return useQuery(queryKeys.getQuickActions(), () => {
    return api<QuickActionsType>("v1", `mobile/homepage/configuration`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
      ["customerID"]: userId,
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function usePostQuickActions() {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();
  const { i18n } = useTranslation();
  return useMutation(({ values }: { values: QuickActionsType }) => {
    return api<QuickActionsType>("v1", `mobile/homepage/configuration`, "POST", undefined, values, {
      ["x-Correlation-Id"]: correlationId,
      ["customerID"]: userId,
      ["Accept-Language"]: i18n.language,
    });
  });
}

export function useRefetchHomepageLayout() {
  const queryClient = useQueryClient();

  const handleOnRefetch = () => {
    queryClient.invalidateQueries(queryKeys.all());
  };

  return { refetchAll: handleOnRefetch };
}

export function useTasks() {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();

  return useQuery<TaskType[]>(["tasks", { userId }], () => {
    return api<TaskType[]>("v1", `actions/1`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
      ["customerID"]: userId,
    });
  });
}

export function useActionDismiss() {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();
  const queryClient = useQueryClient();

  return useMutation(
    (ActionTypeId: string) => {
      return api<QuickActionsType>(
        "v1",
        "actions",
        "PUT",
        undefined,
        {
          ActionTypeId,
          // StatusId 2 indicates "Dismissed" as we utilize this API for dismissal and update.
          StatusId: "2",
        },
        {
          ["x-Correlation-Id"]: correlationId,
          ["customerID"]: userId,
        }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(["tasks", { userId }]);
      },
    }
  );
}
