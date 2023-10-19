import i18next from "i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { PortfolioDetails, Portfolios, PortfoliosPerformanceList } from "../types";

const queryKeys = {
  PortfoliosPerformanceList: () => ["PortfoliosPerformanceList"],
  Portfolios: () => ["Portfolios"],
  PortfolioDetails: () => ["PortfolioDetails"],
};

export function useMutualFundOTP() {
  return useMutation(async () => {
    // TODO: remove this mock when api delivered from BE
    return Promise.resolve({
      OneTimePassword: {
        Length: 0,
        TimeToLive: 0,
        AllowedAttempts: 0,
      },
    });
  });
}

export function usePortfoliosPerformanceList() {
  return useQuery(queryKeys.PortfoliosPerformanceList(), () => {
    return api<PortfoliosPerformanceList>(
      "v1",
      "mutual-fund/portfolios/performance?period=1",
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export function usePortfolios() {
  return useQuery(queryKeys.Portfolios(), () => {
    return api<Portfolios>("v1", "mutual-fund/portfolios", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18next.language,
    });
  });
}

export function usePortfolioDetails() {
  return useQuery(queryKeys.PortfolioDetails(), () => {
    return api<PortfolioDetails>("v1", "mutual-fund/portfolios/1", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18next.language,
    });
  });
}
