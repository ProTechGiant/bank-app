import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAppreciationSearch } from "@/features/Appreciation/hooks/query-hooks";
import { FavoriteEnum } from "@/features/Appreciation/types";
import { AppreciationResponseType, SortingOptions, TabsTypes } from "@/types/Appreciation";
import { HomepageItemLayoutType } from "@/types/Homepage";
import { generateRandomId } from "@/utils";

import {
  AppreciationFeedbackRequest,
  BulletinTasksResponse,
  HomepageContentResponse,
  TopSpendingCategoriesResponse,
} from "../types";
import { getMonthDates } from "../utils";

const queryKeys = {
  all: () => ["layout"],
  getContent: () => [...queryKeys.all(), "getContent"],
  getAppreciations: () => [...queryKeys.all(), "getAppreciations"],
  getBulletinBoardTasks: () => ["bulletinBoardTasks"],
  getTopCategories: (fromDate: string, toDate: string, accountId: string) => [
    "topCategories",
    { fromDate: fromDate, toDate: toDate, accountId },
  ],
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

export function useRefetchHomepageLayout() {
  const queryClient = useQueryClient();

  const handleOnRefetch = () => {
    queryClient.invalidateQueries(queryKeys.all());
  };

  return { refetchAll: handleOnRefetch };
}

export function useBulletinBoardTasks() {
  const { i18n } = useTranslation();
  return useQuery(
    queryKeys.getBulletinBoardTasks(),
    () => {
      return api<BulletinTasksResponse>("v1", `mobile/homepage/actions`, "GET", undefined, undefined, {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language,
      });
    },
    {
      retry: false,
      enabled: false,
    }
  );
}

export function useDismissBulletinBoardTask() {
  const queryClient = useQueryClient();

  return useMutation(
    async (ActionTypeId: string) => {
      return api(
        "v1",
        "actions",
        "PUT",
        undefined,
        {
          ActionTypeId,
          StatusId: "2",
        },
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.getBulletinBoardTasks());
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
    [queryKeys.getTopCategories(fromDate, toDate, accountId)],
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
    FeedbackFlag: 0,
  });
}

export function useTopAppreciations() {
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.getAppreciations(),
    () => {
      return api<AppreciationResponseType>(
        "v1",
        "appreciations",
        "POST",
        undefined,
        {
          PageSize: 3,
          PageOffset: 1,
          SortBy: 1,
          IsFavourite: 0,
          ClassificationCodes: [],
          CategoryCodes: [],
          TypeCodes: [],
          SectionCodes: [],
          RedeemedFlag: [],
          LocationCodes: [],
          ActiveFlag: [],
        },
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language,
        }
      );
    },
    {
      select: res =>
        res.Appreciations.map(appreciation => ({
          ...appreciation,
          isFavourite: appreciation.isFavourite === FavoriteEnum.LIKED,
        })),
    }
  );
}

export function useHomePageContent() {
  const { userId } = useAuthContext();
  const { i18n } = useTranslation();

  return useQuery(
    queryKeys.getContent(),
    () => {
      return api<HomepageContentResponse>("v1", "mobile/homepage/content", "GET", undefined, undefined, {
        UserId: userId,
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language,
      });
    },
    {
      select: data => ({
        ...data.Homepage.Sections,
        Layouts: data.Homepage.Sections.Sections.sort((a, b) =>
          a.CustomerConfiguration.SectionIndex > b.CustomerConfiguration.SectionIndex ? 1 : -1
        ),
      }),
    }
  );
}
export function useAppreciationWishlist() {
  const { userId } = useAuthContext();
  return useMutation((appreciationId: string) => {
    return api<null>(
      "v1",
      "appreciations/wishlist",
      "POST",
      undefined,
      { AppreciationId: appreciationId, CustomerId: userId },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}
