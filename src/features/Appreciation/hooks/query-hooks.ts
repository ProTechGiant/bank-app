import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import {
  AppreciationFeedbackRequest,
  AppreciationResponceType,
  FiltersType,
  SortingOptions,
  TabsTypes,
} from "../types";

export const queryKeys = {
  all: ["appreciation"] as const,
  searchAppreciation: (
    filters: FiltersType | null,
    sortType: SortingOptions,
    language: string,
    feedback: object | undefined
  ) => [...queryKeys.all, "search", [filters, sortType, language, feedback]] as const,
  filters: (language: string) => [...queryKeys.all, "filters", language] as const,
};
export function useAppreciationsWithNoFeedback(language: string) {
  return useAppreciationSearch(null, SortingOptions.ALPHABETIC, TabsTypes.ALL, language, { FeedbackFlag: 2 });
}

export function useAppreciationSearch(
  filters: FiltersType | null,
  sortType: SortingOptions,
  currentTab: TabsTypes,
  language: string,
  feedback?: { FeedbackFlag: number }
) {
  return useQuery(
    queryKeys.searchAppreciation(filters, sortType, language, feedback),
    () => {
      return api<AppreciationResponceType>(
        "v1",
        "appreciations",
        "POST",
        undefined,
        {
          SortBy: SortingOptions.RECOMMENDED === sortType ? 3 : SortingOptions.MOST_RECENT === sortType ? 1 : 2, // TODO  2 value will be replaced with  the actual value for like tab
          CategaoryCodes: !filters ? [] : filters.Categories.filter(item => item.isActive).map(item => item.Code),
          TypeCodes: !filters ? [] : filters.Types.filter(item => item.isActive).map(item => item.Code),
          SectionCodes: [],
          RedeemedFlag: currentTab === TabsTypes.ALL ? [] : ["1"],
          LocationCodes: !filters ? [] : filters.Locations.filter(item => item.isActive).map(item => item.Code),
          ActiveFlag: currentTab === TabsTypes.ALL ? ["1"] : ["2"],
          ...feedback,
        },
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Accept-Language"]: language,
        }
      );
    },
    {
      select: res => res.Appreciations,
    }
  );
}

export function useAppreciationFilters(language: string) {
  return useQuery(queryKeys.filters(language), () => {
    return api<FiltersType>("v1", "appreciations/filters", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: language,
    });
  });
}

export function useRedeemAppreciation() {
  const { userId } = useAuthContext();
  return useMutation((appreciationId: string) => {
    return api<null>(
      "v1",
      "appreciations/redeem",
      "PUT",
      { AppreciationId: appreciationId, CustomerId: userId },
      {
        RedeemedFlag: "1",
      },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
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
