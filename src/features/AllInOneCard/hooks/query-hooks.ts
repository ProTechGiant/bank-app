// add your hooks here
import i18next from "i18next";
import { useMutation, useQuery } from "react-query";

import sendApiRequest from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { generateRandomId } from "@/utils";

import {
  AddCurrenciesRequest,
  AddCurrenciesResponse,
  AIOPinChangeRequest,
  AIOPinChangeResponse,
  CardDetailResponse,
  CardInformation,
  CardIssuanceParams,
  CardIssuanceResponse,
  CardRestrictions,
  CardTransactionQuery,
  CitiesResponse,
  CurrencyRequest,
  CurrencySummaryResponse,
  EditControlSettings,
  FeesResponse,
  FreezeCardResponse,
  PricePlansResponse,
  ProductsResponse,
  RewardsMethodsResponse,
  RewardTypeSwitchRequest,
  TransactionResponse,
} from "../types";

export const queryKeys = {
  all: () => ["aio-card", "all"] as const,
  fees: (productId: string, paymentPlanId: string) =>
    [...queryKeys.all(), { productId, paymentPlanId }, "fees"] as const,
  products: () => ["aio-card", "products"] as const,
  settings: () => ["aio-card", "settings"] as const,
  cardInformation: () => ["aio-card", "cardInformation"] as const,
  paymentMethod: () => ["aio-card", "paymentMethod"] as const,
  rewards: () => ["aio-card", "rewards"] as const,
  currencies: () => ["aio-card", "currencies"] as const,
  customerCurrencies: () => ["aio-card", "customerCurrencies"] as const,
  cardFreeze: (cardFreeze: FreezeCardResponse) => ["aio-card", "cardFreeze", { cardFreeze }] as const,
  cardDashboardDetail: () => ["aio-card", "cardDashboardDetail"] as const,
  cities: () => ["aio-card", "cities"] as const,
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

  return useQuery<CardRestrictions>(queryKeys.settings(), () => {
    return sendApiRequest<CardRestrictions>("v1", `aio-card/${cardId}/settings`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
      ["UserId"]: userId ?? "",
      ["Accept-Language"]: i18next.language,
    });
  });
}

export function useEditControlSettings({ cardId }: { cardId: string }) {
  const { userId } = useAuthContext();

  return useMutation(async (values: EditControlSettings) =>
    sendApiRequest("v1", `aio-card/${cardId}/settings`, "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: userId ?? "",
    })
  );
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

export function useGetAllCurrencies() {
  const { userId } = useAuthContext();

  return useQuery<CurrencyRequest>(queryKeys.currencies(), () => {
    return sendApiRequest<CurrencyRequest>("v1", `aio-card/currencies`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
      ["UserId"]: userId ?? "",
      ["Accept-Language"]: i18next.language,
    });
  });
}

export function useGetCustomerCurrencies(cardExId: string) {
  const { userId } = useAuthContext();

  return useQuery<CurrencySummaryResponse>(queryKeys.customerCurrencies(), () => {
    return sendApiRequest<CurrencySummaryResponse>(
      "v1",
      `aio-card/customer/currencies?cardExId=${cardExId}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-Correlation-Id"]: generateRandomId(),
        ["UserId"]: userId ?? "",
        ["Accept-Language"]: i18next.language,
      }
    );
  });
}

export function useGetRewardsMethods() {
  const { userId } = useAuthContext();

  return useQuery<RewardsMethodsResponse>(queryKeys.rewards(), () => {
    return sendApiRequest<RewardsMethodsResponse>("v1", `aio-card/rewards`, "GET", undefined, undefined, {
      ["x-Correlation-Id"]: generateRandomId(),
      ["UserId"]: userId ?? "",
      ["Accept-Language"]: i18next.language,
    });
  });
}

export function useGetCardTransactions() {
  // const { userId } = useAuthContext();

  return useMutation((options: CardTransactionQuery) => {
    const url = `FromDate=${options.FromDate}&ToDate=${options.ToDate}&TransactionType=${options.TransactionType}&Currency=${options.Currency}&NoOfTransaction=${options.NoOfTransaction}&ReturnMCCGroup=${options.ReturnMCCGroup}`;

    return sendApiRequest<TransactionResponse>(
      "v1",
      `aio-card/transactions?${url}`,
      "POST",
      undefined,
      {
        CardIdentifierId: options.CardIdentifierId,
        CardIdentifierType: options.CardIdentifierType,
      },
      {
        ["x-correlation-id"]: generateRandomId(),
        // ["UserId"]: userId ?? "",
        ["UserId"]: "1", //TODO : right now api only works with this user id ("1000001199") , so it will be removed when api works with all user ids
      }
    );
  });
}
export function useFreezeCard() {
  const { userId } = useAuthContext();
  //TODO : UserId need to be made dynamic when api starts working for all userid
  return useMutation(async (values: FreezeCardResponse) => {
    return sendApiRequest<string>("v1", "aio-card/status", "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: userId ?? "",
    });
  });
}

export function useAioCardDashboardDetail({
  ProductType,
  NoOfTransaction,
  IncludeTransactionsList,
}: {
  ProductType: string;
  NoOfTransaction: string;
  IncludeTransactionsList: string;
}) {
  const { userId } = useAuthContext();

  return useQuery<CardDetailResponse>(queryKeys.cardDashboardDetail(), () => {
    return sendApiRequest<CardDetailResponse>(
      "v1",
      `aio-card?ProductType=${ProductType}&NoOfTransaction=${NoOfTransaction}&IncludeTransactionsList=${IncludeTransactionsList}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-Correlation-Id"]: generateRandomId(),
        ["UserId"]: userId ?? "",
        ["Accept-Language"]: i18next.language,
      }
    );
  });
}

export function useCities({ countryCode }: { countryCode: string }) {
  const { userId } = useAuthContext();

  return useQuery<CitiesResponse>(queryKeys.cities(), () => {
    return sendApiRequest<CitiesResponse>(
      "v1",
      `aio-card/cities?countryCode=${countryCode}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-Correlation-Id"]: generateRandomId(),
        ["UserId"]: userId ?? "",
        ["Accept-Language"]: i18next.language,
      }
    );
  });
}
export function useAIOPinChange() {
  return useMutation(async (request: AIOPinChangeRequest) => {
    return sendApiRequest<AIOPinChangeResponse>("v1", "aio-card/pin-change/otp-generate", "POST", undefined, request, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: "1000001199", //TODO : UserId need to be made dynamic when api starts working for all userid
    });
  });
}

export function useValidateAddCurrencies() {
  const { userId } = useAuthContext();

  return useMutation(async (values: AddCurrenciesRequest) => {
    return sendApiRequest<AddCurrenciesResponse>("v1", "aio-card/currencies", "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
      ["UserId"]: userId ?? "",
    });
  });
}
export function useGetPaymentsMethod({ productId, channelId }: { productId: string; channelId: string }) {
  const { userId } = useAuthContext();

  return useQuery<PricePlansResponse>(queryKeys.paymentMethod(), () => {
    return sendApiRequest<PricePlansResponse>(
      "v1",
      `price-plans/price-plans-product-id?ProductId=${productId}&CHANNEL_ID=${channelId}`,
      "GET",
      undefined,
      undefined,
      {
        ["x-Correlation-Id"]: generateRandomId(),
        ["UserId"]: userId ?? "",
        ["CHANNEL_ID"]: channelId,
      }
    );
  });
}
