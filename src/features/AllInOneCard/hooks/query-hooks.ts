// add your hooks here
import i18next from "i18next";
import { useMutation, useQuery } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import {
  CardInformation,
  CardIssuanceParams,
  CardIssuanceResponse,
  FeesResponse,
  ProductsResponse,
  Restriction,
  RewardTypeSwitchRequest,
} from "../types";

export const queryKeys = {
  all: () => ["aio-card", "all"] as const,
  fees: (productId: string, paymentPlanId: string) =>
    [...queryKeys.all(), { productId, paymentPlanId }, "fees"] as const,
  products: () => ["aio-card", "products"] as const,
  settings: () => ["aio-card", "settings"] as const,
  cardInformation: () => ["aio-card", "cardInformation"] as const,
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
  return useMutation(async (values: CardIssuanceParams) =>
    sendApiRequest<CardIssuanceResponse>("v1", `aio-card/issuance`, "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: "1000001199", //TODO : right now api only works with this user id ("1000001199") , so it will be removed when api works with all user ids
    })
  );
}

export function useGetSettings({ cardId }: { cardId: string }) {
  const { userId } = useAuthContext();

  return useQuery<Restriction[]>(queryKeys.settings(), () => {
    return sendApiRequest<Restriction[]>("v1", `aio-card/${cardId}/settings`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
      ["UserId"]: userId ?? "",
      ["Accept-Language"]: i18next.language.toUpperCase(),
    });
  });
}

export function useGetCardDetails({ id, type }: { id: string; type: string }) {
  const { userId } = useAuthContext();

  return useQuery<CardInformation>(queryKeys.cardInformation(), () => {
    return sendApiRequest<CardInformation>(
      "v1",
      `aio-card/balance?CardIdentifierId=${id}&CardIdentifierType=${type}`,
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
export function useSwitchRewardsType() {
  //TODO : UserId need to be made dynamic when api starts working for all userids
  return useMutation(async (request: RewardTypeSwitchRequest) =>
    sendApiRequest<CardIssuanceResponse>("v1", `aio-card/rewards`, "POST", undefined, request, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: "1000001199",
    })
  );
}
