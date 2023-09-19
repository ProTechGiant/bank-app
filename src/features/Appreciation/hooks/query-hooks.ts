import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { SortingOptions, TabsTypes } from "@/types/Appreciation";
import { generateRandomId } from "@/utils";

import { AppreciationResponseType, FavoriteEnum, FiltersType } from "../types";

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
      if (!filters) filters = { Categories: [], Locations: [], Sections: [], Types: [] };
      return api<AppreciationResponseType>(
        "v1",
        "appreciations",
        "POST",
        undefined,
        {
          PageSize: 0,
          PageOffset: 0,
          SortBy:
            SortingOptions.RECOMMENDED === sortType
              ? 4
              : SortingOptions.MOST_RECENT === sortType
              ? 1
              : SortingOptions.ALPHABETIC === sortType
              ? 2
              : 3,
          CategoryCodes: filters.Categories.filter(item => item.isActive).map(item => item.Code),
          TypeCodes: filters.Types.filter(item => item.isActive).map(item => item.Code),
          SectionCodes: filters.Sections.filter(item => item.isActive).map(item => item.Code),
          RedeemedFlag: currentTab === TabsTypes.ALL ? [] : ["1"],
          LocationCodes: filters.Locations.filter(item => item.isActive).map(item => item.Code),
          ActiveFlag: currentTab === TabsTypes.ALL ? [0] : ["2"],
          FeedbackFlag: feedback?.FeedbackFlag,
          IsFavourite: currentTab === TabsTypes.LIKED ? FavoriteEnum.LIKED : 0,
        },
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Accept-Language"]: language,
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
