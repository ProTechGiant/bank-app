import i18next from "i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import {
  OffersProducts,
  PerformanceLastYearsInterface,
  PortfolioData,
  PortfolioDetails,
  Portfolios,
  PortfoliosPerformanceList,
} from "../types";

const queryKeys = {
  PortfoliosPerformanceList: () => ["PortfoliosPerformanceList"],
  Portfolios: () => ["Portfolios"],
  PortfolioDetails: () => ["PortfolioDetails"],
  mutualFundProductList: () => ["mutualFundProductList"],
  mutualFundPortfolios: () => ["mutualFundPortfolios"],
  performanceLastYears: () => ["performanceLastYears"],
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

export function useGetMutualFundProducts(riskLevel: string) {
  return useQuery(queryKeys.mutualFundProductList(), () => {
    return api<OffersProducts>("v1", "mutual-fund/products", "GET", { risk: riskLevel }, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18next.language,
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

export function useGetCustomerPortfolios() {
  return useQuery(queryKeys.mutualFundPortfolios(), () => {
    return api<PortfolioData>("v1", "mutual-fund/portfolios", "GET", undefined, undefined, {
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

export function usePerformanceLast3Years(productId: string) {
  return useQuery(queryKeys.performanceLastYears(), () => {
    return api<PerformanceLastYearsInterface>(
      "v1",
      `mutual-fund/${productId}/last3years-performance`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: "en",
      }
    );
  });
}
