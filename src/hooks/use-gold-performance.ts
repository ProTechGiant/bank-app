import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";

import api from "@/api";
import {
  GoldPerformanceDailyType,
  GoldPerformanceMonthlyType,
  groupingByEnum,
  periodEnum,
  TabsTypes,
} from "@/types/GoldChart";
import { generateRandomId } from "@/utils";

export const queryKeys = {
  all: () => ["gold-details"] as const,
};

const performanceQueryParams = {
  [TabsTypes.Week]: {
    duration: 1,
    period: periodEnum.WEEK,
    groupingBy: groupingByEnum.daily,
  },
  [TabsTypes.Month]: {
    duration: 1,
    period: periodEnum.MONTH,
    groupingBy: groupingByEnum.daily,
  },
  [TabsTypes.Year]: {
    duration: 1,
    period: periodEnum.YEAR,
    groupingBy: groupingByEnum.daily,
  },
  [TabsTypes.FiveYears]: {
    duration: 5,
    period: periodEnum.YEAR,
    groupingBy: groupingByEnum.monthly,
  },
};

export default function useGoldPerformance(chartType: typeof TabsTypes) {
  const { i18n } = useTranslation();

  return useQuery([...queryKeys.all(), chartType], () => {
    return api<GoldPerformanceMonthlyType | GoldPerformanceDailyType>(
      "v1",
      `goals/gold-details`,
      "GET",
      performanceQueryParams[chartType],
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language,
      }
    );
  });
}
