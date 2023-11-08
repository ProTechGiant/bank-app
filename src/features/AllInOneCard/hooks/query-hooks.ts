// add your hooks here
import { useMutation, useQuery } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import { CardIssuanceParams, CardIssuanceResponse, FeesResponse, ProductsResponse } from "../types";

export const queryKeys = {
  all: () => ["aio-card", "all"] as const,
  fees: (productId: string, paymentPlanId: string) =>
    [...queryKeys.all(), { productId, paymentPlanId }, "fees"] as const,
  products: () => ["aio-card", "products"] as const,
};

export function useAllInOneCardOTP() {
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

export function useGetFees(productId: string, paymentPlanId: string) {
  const { userId } = useAuthContext();

  return useQuery<FeesResponse>(queryKeys.fees(productId, paymentPlanId), () => {
    return sendApiRequest<FeesResponse>(
      "v1",
      `aio-card/fees?ProductId=${productId}&PaymentPlanId=${paymentPlanId}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-Correlation-Id"]: generateRandomId(),
        ["UserId"]: userId ?? "",
      }
    );
  });
}

export function useGetProducts() {
  const { userId } = useAuthContext();

  return useQuery<ProductsResponse>(queryKeys.products(), () => {
    return sendApiRequest<ProductsResponse>("v1", `aio-card/products`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
      ["UserId"]: userId ?? "",
    });
  });
}
export function useIssueCard() {
  const { userId } = useAuthContext();

  return useMutation(async (values: CardIssuanceParams) =>
    sendApiRequest<CardIssuanceResponse>("v1", `aio-card/issuance`, "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: userId ?? "",
    })
  );
}
