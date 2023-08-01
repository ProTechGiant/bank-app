import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { HomepageItemLayoutType, Notification } from "../types";

const queryKeys = {
  all: () => ["layout"],
  getLayout: () => [...queryKeys.all(), "getLayout"],
  getContent: (language: string) => [...queryKeys.all(), "getContent", { language }] as const,
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

export function useHomeContent(language: string) {
  const { userId } = useAuthContext();
  const correlationId = generateRandomId();

  return useQuery(queryKeys.getContent(language), () => {
    return api("v1", `mobile/homepage/content`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: correlationId,
      ["customerId"]: userId,
      ["Accept-Language"]: language,
    });
  });
}

export function useActions(faqId: string, language: string) {
  const { userId } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation(
    () => {
      return api<unknown>("v1", ``, "POST", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
        ["CustomerId"]: userId,
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.getContent(language));
      },
    }
  );
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

export function useRefetchHomepageLayout() {
  const queryClient = useQueryClient();

  const handleOnRefetch = () => {
    queryClient.invalidateQueries(queryKeys.all());
  };

  return { refetchAll: handleOnRefetch };
}

export function useNotifications() {
  const { userId } = useAuthContext();

  const { data } = useQuery<Notification[]>(["notifications", { userId }], () => {
    return api<Notification[]>("v1", `customer/${userId}/actions`, "GET");
  });

  return useMemo(() => data?.filter(d => d.action_status === "pending") ?? [], [data]);
}
