import { useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { AppreciationResponceType, FiltersType, SortingOptions, TabsTypes } from "../types";

export const queryKeys = {
  all: ["appreciation"] as const,
  searchAppreciation: (filters: FiltersType | null, sortType: keyof typeof SortingOptions, language: string) =>
    [...queryKeys.all, "search", [filters, sortType, language]] as const,
  filters: (language: string) => [...queryKeys.all, "filters", language] as const,
};

export function useAppreciationSearch(
  filters: FiltersType | null,
  sortType: keyof typeof SortingOptions,
  currentTab: TabsTypes,
  language: string
) {
  return useQuery(
    queryKeys.searchAppreciation(filters, sortType, language),
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
