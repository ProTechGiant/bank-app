import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAppreciationSearch } from "@/features/Appreciation/hooks/query-hooks";
import { SortingOptions, TabsTypes } from "@/types/Appreciation";
import { generateRandomId } from "@/utils";

import {
  AppreciationFeedbackRequest,
  HomepageItemLayoutType,
  QuickActionsType,
  TaskType,
  TopSpendingCategoriesResponse,
} from "../types";
import { getMonthDates } from "../utils";

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

export function useCategories(accountId: string) {
  const { fromDate, toDate } = getMonthDates();
  const { i18n } = useTranslation();
  const {
    data: categories,
    isError,
    refetch,
  } = useQuery(
    ["topCategories", { fromDate: fromDate, toDate: toDate }],
    () =>
      api<TopSpendingCategoriesResponse>(
        "v1",
        `accounts/${accountId}/categories`,
        "GET",
        {
          PageSize: 3, // pageSize = 3 because we need only 3 top categories
          PageNumber: 0,
          fromDate: fromDate,
          toDate: toDate,
        },
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language,
        }
      ),
    {
      // set staleTime to 10 seconds for caching
      staleTime: 10000,
    }
  );
  const total = categories?.categories.total;
  const includedTopCategories = categories?.categories.includedCategories;

  return { includedTopCategories, total, isError, refetch };
}

export function useAppreciationFeedback() {
  const { userId } = useAuthContext();
  return useMutation((appreciationFeedbackRequest: AppreciationFeedbackRequest) => {
    return api<null>(
      "v1",
      "appreciations/feedback",
      "PUT",
      { CustomerId: userId },
      {
        AppreciationId: appreciationFeedbackRequest.appreciationId,
        Comments: appreciationFeedbackRequest.comment,
        VoteId: appreciationFeedbackRequest.voteId,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export function useAppreciationsWithNoFeedback(language: string) {
  return useAppreciationSearch(null, SortingOptions.ALPHABETIC, TabsTypes.ALL, language, {
    FeedbackFlag: 2,
  });
}
