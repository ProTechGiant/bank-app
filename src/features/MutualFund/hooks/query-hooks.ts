import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { OtpChallengeParams } from "@/features/OneTimePassword/types";
import { generateRandomId } from "@/utils";

import {
  AssetAllocationResponse,
  CardInfo,
  CheckCustomerResponse,
  CheckProductRiskResponse,
  GetSuitabilityQuestionInterface,
  MutualFundManagementRespons,
  OffersProducts,
  OrderOtpParams,
  OrdersStatusListResponse,
  PerformanceLastYearsInterface,
  PortfolioData,
  PortfolioDetails,
  PortfolioManagmentRespons,
  Portfolios,
  PortfoliosDetails,
  PortfoliosPerformanceList,
  RiskType,
} from "../types";

const queryKeys = {
  PortfoliosPerformanceList: () => ["PortfoliosPerformanceList"],
  Portfolios: () => ["Portfolios"],
  PortfolioDetails: () => ["PortfolioDetails"],
  mutualFundProductList: () => ["mutualFundProductList"],
  mutualFundPortfolios: () => ["mutualFundPortfolios"],
  performanceLastYears: () => ["performanceLastYears"],
  getSuitabilityQuestions: () => ["getSuitabilityQuestions"],
  cardRiskInfo: () => ["cardRiskInfo"],
  getProductDetails: () => ["getProductDetails"],
  getAssetAllocation: () => ["getAssetAllocation"],
  getCheckProductRisk: () => ["getCheckProductRisk"],
  getCheckCustomerExist: () => ["getCheckCustomerExist"],
  getOrderStatusList: () => ["getOrderStatusList"],
  getRiskContentByConsentKey: () => ["getRiskContentByConsentKey"],
  getPortfolioManagment: () => ["getPortfolioManagment"],
  getMutualFundManagment: () => ["getMutualFundManagment"],
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
        ["Accept-Language"]: i18next.language,
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
export function useCreateCustomerOtp() {
  const { userId } = useAuthContext();

  return useMutation(async () => {
    return api<OtpChallengeParams>(
      "v1",
      "mutual-fund/otps/send",
      "POST",
      undefined,
      { customerId: userId, reasonCode: CREATE_CUSTOMER_OTP_REASON_CODE },

      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}
export function useGetSuitabilityQuestions() {
  return useQuery(queryKeys.getSuitabilityQuestions(), () => {
    return api<GetSuitabilityQuestionInterface>(
      "v1",
      `mutual-fund/suitability-questions`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18next.language,
      }
    );
  });
}
export function useGetProductInfo(productId: number) {
  return useQuery(queryKeys.cardRiskInfo(), () => {
    return api<CardInfo>("v1", `mutual-fund/portfolios/${productId}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18next.language,
    });
  });
}

export function useGetProductDetails(productId: number) {
  const temp = 28253; // TODO : until fix this issue from BE team
  return useQuery(queryKeys.getProductDetails(), () => {
    return api<PortfoliosDetails>(
      "v1",
      `mutual-fund/portfolios/${productId}/products?productId=${temp}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18next.language,
      }
    );
  });
}

export function useAssetAllocation(risk: RiskType) {
  const { i18n } = useTranslation();
  return useQuery([queryKeys.getAssetAllocation(), risk], () => {
    return api<AssetAllocationResponse>(
      "v1",
      `mutual-fund/products/asset-allocation?risk=${risk}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18n.language,
      }
    );
  });
}

export function useCheckProductRisk(productId: number | undefined) {
  const { i18n } = useTranslation();
  return useQuery(
    [queryKeys.getCheckProductRisk()],
    () => {
      return api<CheckProductRiskResponse>(
        "v1",
        `mutual-fund/scoring?productId=${productId}`,
        "GET",
        undefined,
        undefined,
        {
          ["x-correlation-id"]: generateRandomId(),
          ["Accept-Language"]: i18n.language,
          ["userId"]: "1000001102", //TODO: this is temp until BE team fix api issue
        }
      );
    },
    {
      enabled: !!productId,
    }
  );
}

export function useCheckCustomerExist() {
  return useQuery([queryKeys.getCheckCustomerExist()], () => {
    return api<CheckCustomerResponse>("v1", `mutual-fund/customerInfo`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18next.language,
      ["userId"]: "1000001204", //TODO: this is temp until BE team fix api issue
    });
  });
}

export function useOrderStatusList() {
  const { i18n } = useTranslation();
  return useQuery([queryKeys.getOrderStatusList()], () => {
    return api<OrdersStatusListResponse>("v1", `mutual-fund/orders`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
      ["userId"]: "1000001204", //TODO: this is temp until BE team fix api issue
    });
  });
}

export function useMutualFundSubscribeOTP() {
  const { i18n } = useTranslation();
  return useMutation(async (values: OrderOtpParams) => {
    return api<OtpChallengeParams>("v1", `mutual-fund/subscribe`, "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
      ["Accept-Language"]: i18n.language,
      ["userId"]: "1000004239", //TODO: this is temp until BE team fix api issue
    });
  });
}

export function useRiskContentByConsentKey(ConsentKey?: string) {
  const { t } = useTranslation();
  //TODO: this is temp until BE team fix api issue
  return useQuery(
    queryKeys.getRiskContentByConsentKey(),
    () => {
      // return api<any>( // TODO: check response type with BE team
      //   "v1",
      //   "/contents/terms",
      //   "GET",
      //   { Language: i18n.language, IncludeChildren: "true", ContentCategoryId: ConsentKey },
      //   undefined,
      //   {
      //     ["x-Correlation-Id"]: generateRandomId(),
      //   }
      // );
      return Promise.resolve(t("MutualFund.MutualFundDetailsScreen.consentKey"));
    },
    {
      enabled: !!ConsentKey,
    }
  );
}

export const CREATE_CUSTOMER_OTP_REASON_CODE = "105";

export function useGetPortfolioManagment(id: number) {
  return useQuery(queryKeys.getPortfolioManagment(), () => {
    return api<PortfolioManagmentRespons>(
      "v1",
      `mutual-fund/portfolios/${id}/management`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18next.language,
      }
    );
  });
}

export function useGetMutualFundManagment(id: number) {
  return useQuery(queryKeys.getMutualFundManagment(), () => {
    return api<MutualFundManagementRespons>(
      "v1",
      `mutual-fund/products/${id}/management`,
      "GET",
      undefined,
      undefined,
      {
        ["x-correlation-id"]: generateRandomId(),
        ["Accept-Language"]: i18next.language,
      }
    );
  });
}
