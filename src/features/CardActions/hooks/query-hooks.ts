import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { OtpRequiredResponse } from "@/features/OneTimePassword/types";
import { Address } from "@/types/Address";
import { generateRandomId } from "@/utils";
import { tokenizeCardForAppleWalletAsync } from "@/utils/apple-wallet";

import { MOCK_API_URL } from "../mocks/mockPOSTransactionLimits";
import { ActionType, Card, CardSettingsInput, CardStatus, ChangePOSLimit, RenewalReason } from "../types";

const NI_CLIENT_SECRET = "Q3HVEbgpY3";
const NI_CLIENT_ID = "xzzy7tvwvvqy9v4f26xszkb9";
const NI_GRANT_TYPE = "client_credentials";

export const queryKeys = {
  all: () => ["cards"] as const,
  settings: (cardId: string) => [...queryKeys.all(), "settings", { cardId }] as const,
  meawalletTokenization: (cardId: string) => [...queryKeys.all(), "meawallet-tokenization", { cardId }] as const,
  customerTier: () => ["customer-tier"] as const,
  verificationStatus: (cardId: string) => [...queryKeys.all(), "verificationStatus", { cardId }],
  posLimits: () => [...queryKeys.all(), "posLimits"] as const,
  currentPOSLimit: (cardId: string) => [...queryKeys.all(), "currentPOSLimit", { cardId }] as const,
  activateCard: (cardId: string) => [...queryKeys.all(), "activateCard", { cardId }] as const,
  ivrValidation: (cardId: string) => [...queryKeys.all(), "ivr-validation", { cardId }] as const,
};

interface CardsResponse {
  Cards: Card[];
}

export function useCards() {
  return useQuery(queryKeys.all(), () => {
    return api<CardsResponse>("v1", "cards", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useCard(cardId: string) {
  const cards = useCards();

  return { ...cards, data: cards?.data?.Cards.find(card => card.CardId === cardId) };
}

interface FreezeCardResponse {
  Status: string;
  IsOtpRequired: boolean;
}

export function useFreezeCard() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ cardId }: { cardId: string }) => {
      return api<FreezeCardResponse>(
        "v1",
        `cards/${cardId}`,
        "POST",
        undefined,
        { Status: "LOCK" },
        { ["x-correlation-id"]: generateRandomId() }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.all());
      },
    }
  );
}

interface ActivateCardResponse extends OtpRequiredResponse {
  Status: string;
}

export function useActivateCard(cardId: string, interval: number) {
  const queryClient = useQueryClient();

  return useQuery(
    queryKeys.activateCard(cardId),
    () => {
      return api<ActivateCardResponse>(
        "v1",
        `cards/${cardId}`,
        "POST",
        undefined,
        { Status: "ACTIVATE" },
        {
          ["x-correlation-id"]: generateRandomId(),
        }
      );
    },
    {
      refetchInterval: interval,
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.all());
      },
    }
  );
}

export function useChangeCardStatus() {
  return useMutation(async ({ cardId, status, Reason }: { cardId: string; status: CardStatus; Reason?: string }) => {
    const correlationId = generateRandomId();

    const response = await api<OtpRequiredResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: status, Reason: Reason },
      {
        ["x-correlation-id"]: correlationId,
      }
    );

    return { ...response, correlationId };
  });
}

export function useApplyForPhysicalCard() {
  return useMutation(async ({ cardId }: { cardId: string }) => {
    const correlationId = generateRandomId();

    const response = await api<OtpRequiredResponse>(
      "v1",
      `cards/renew`,
      "POST",
      undefined,
      { CardId: cardId, ActionType: "ReissAsNew" },
      {
        ["x-correlation-id"]: correlationId,
      }
    );

    return { ...response, correlationId };
  });
}

interface UpdateAddressInput {
  cardId: string;
  cardHolderName: string;
  cardType: string;
  addressOne: string | undefined;
  addressTwo: string | undefined;
  city: string | undefined;
  postalCode: string | undefined;
}

export function useUpdateAddress() {
  const { userId, phoneNumber } = useAuthContext();
  return useMutation(({ cardId, cardHolderName, cardType, addressOne, addressTwo, city }: UpdateAddressInput) => {
    const correlationId = generateRandomId();
    const requestParam = {
      CustomerId: userId,
      CardHolderName: cardHolderName,
      CardType: cardType,
      CardId: cardId,
      DeliveryAddressOne: addressOne,
      DeliveryAddressTwo: addressTwo,
      DeliveryCity: city,
      DeliveryCountry: "SAU",
      DeliveryEmail: "", //TODO: Needs to be replaced with email when available.
      DeliveryMobileNumber: phoneNumber,
    };

    return api<null>("v1", `cards/delivery-address`, "POST", undefined, requestParam, {
      ["x-correlation-id"]: correlationId,
    });
  });
}

interface CustomerTierResponse {
  Tier: string;
}

export function useCustomerTier() {
  return useQuery(queryKeys.customerTier(), () => {
    return api<CustomerTierResponse>("v1", "customer/tier", "GET");
  });
}

// alias for explicitness
type CardSettingsResponse = CardSettingsInput;
export function useCardSettings(cardId: string) {
  return useQuery(queryKeys.settings(cardId), () => {
    return api<CardSettingsResponse>("v1", `cards/${cardId}/settings`, "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

interface UpdateCardSettingsWithoutOtpResponse {
  Message: string;
  IsOtpRequired: false;
}

interface UpdateCardSettingsOtpRequiredResponse extends OtpRequiredResponse {
  IsOtpRequired: true;
}

type UpdateCardSettingsResponse = UpdateCardSettingsWithoutOtpResponse | UpdateCardSettingsOtpRequiredResponse;
export function useUpdateCardSettings() {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ cardId, settings }: { cardId: string; settings: CardSettingsInput }) => {
      const correlationId = generateRandomId();
      const response = await api<UpdateCardSettingsResponse & { correlationId: string }>(
        "v1",
        `cards/${cardId}/settings`,
        "POST",
        undefined,
        settings,
        {
          ["X-Correlation-Id"]: correlationId,
        }
      );

      return { ...response, correlationId };
    },
    {
      onMutate: variables => {
        queryClient.setQueryData(queryKeys.settings(variables.cardId), variables.settings);
      },
      onSettled: (data, _options, variables) => {
        if (data !== undefined && data.IsOtpRequired) return;
        queryClient.invalidateQueries(queryKeys.settings(variables.cardId));
      },
    }
  );
}

export function useRequestViewPinOtp() {
  return useMutation(async ({ cardId }: { cardId: string }) => {
    const correlationId = generateRandomId();

    const response = await api<OtpRequiredResponse>("v1", `cards/${cardId}/pin`, "GET", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
    });

    return { ...response, correlationId };
  });
}

export function useResetPincode() {
  return useMutation(async ({ cardId }: { cardId: string }) => {
    const correlationId = generateRandomId();

    const response = await api<OtpRequiredResponse>("v1", `cards/${cardId}/pin`, "POST", undefined, undefined, {
      ["X-Correlation-Id"]: correlationId,
    });

    return { ...response, correlationId };
  });
}

export function useUnmaskedCardDetails() {
  return useMutation(async ({ cardId }: { cardId: string }) => {
    const correlationId = generateRandomId();
    const response = await api<OtpRequiredResponse>("v1", `cards/${cardId}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
    });

    return { ...response, correlationId };
  });
}

export function useMeawalletTokenization(cardId: string) {
  return useQuery(
    queryKeys.meawalletTokenization(cardId),
    async () => {
      return tokenizeCardForAppleWalletAsync(cardId);
    },
    {
      staleTime: Infinity,
    }
  );
}

interface OrderCardInput {
  CardType: string;
  CardProductId: string;
  Pin?: string;
  AlternateAddress?: Address;
}

interface OrderCardResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

export function useSubmitOrderCard() {
  return useMutation(async ({ values }: { values: OrderCardInput }) => {
    const correlationId = generateRandomId();

    const response = await api<OrderCardResponse>("v1", "cards", "POST", undefined, values, {
      ["x-correlation-id"]: correlationId,
    });

    return { ...response, correlationId };
  });
}

interface VerifyCvvResponse {
  Message: string;
  NumOfAttempts: number;
}

export function useVerifyCVV() {
  return useMutation(async ({ cardId, cvv }: { cardId: string; cvv: string }) => {
    const correlationId = generateRandomId();

    const response = await api<VerifyCvvResponse>(
      "v1",
      `cards/${cardId}/verify-cvv`,
      "POST",
      undefined,
      {
        Cvv: cvv,
      },
      {
        ["x-correlation-id"]: correlationId,
      }
    );

    return response;
  });
}

export interface RenewCardInput {
  CardId: string;
  ActionType: ActionType;
  ExpiryDate?: string;
  Reason?: RenewalReason;
}

interface RenewCardResponse {
  NewCardDetails: {
    CardId: string;
    NewExpiryDate: string;
    NewMaskedPan: string;
  };
}

export function useSubmitRenewCard() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ values }: { values: RenewCardInput }) => {
      const correlationId = generateRandomId();

      const response = await api<RenewCardResponse>("v1", "cards/renew", "POST", undefined, values, {
        ["x-correlation-id"]: correlationId,
      });

      return { ...response, correlationId };
    },

    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.all());
      },
    }
  );
}

export function useVerificationCardStatus(cardId: string, INTERVAL: number) {
  return useQuery(
    queryKeys.verificationStatus(cardId),
    async () => {
      const response = await fetch(MOCK_API_URL); //TODO: mock api later to be replaced with actual one
      const content = await response.json();
      return content;
    },
    { refetchInterval: INTERVAL }
  );
}
interface POSLimitsResponse {
  MaxLimit: string;
  MinLimit: string;
  Limits: Array<string>;
}

export function usePOSLimits() {
  const correlationId = generateRandomId();

  return useQuery(
    queryKeys.posLimits(),
    () => {
      return api<POSLimitsResponse>(
        "v1",
        "cards/limits",
        "GET",
        {
          LimitType: "online_pos_limit",
        },
        undefined,
        {
          ["x-correlation-id"]: correlationId,
        }
      );
    },
    {
      cacheTime: Infinity,
    }
  );
}

interface CurrentPOSLimitResponse {
  LimitType: string;
  Value: string;
  Currency: string;
}

export function useCurrentPOSLimit(cardId: string) {
  const correlationId = generateRandomId();
  return useQuery(queryKeys.currentPOSLimit(cardId), () => {
    return api<CurrentPOSLimitResponse>(
      "v1",
      `cards/${cardId}/limits`,
      "GET",
      {
        limitType: "online_pos_limit",
      },
      undefined,
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useChangePOSLimit() {
  return useMutation(async (values: ChangePOSLimit) => {
    return api<OtpRequiredResponse>("v1", `cards/${values.CardId}/limits`, "POST", undefined, values, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
export interface GetTokenResponse {
  AccessToken: string;
  TokenType: string;
  ExpiresIn: string;
}
const GetTokenParams = {
  ClientId: NI_CLIENT_ID,
  ClientSecret: NI_CLIENT_SECRET,
  GrantType: NI_GRANT_TYPE,
};
export function useGetToken() {
  return useMutation(async () => {
    return api<GetTokenResponse>("v1", `cards/token`, "POST", undefined, GetTokenParams, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}

export function useIVRValidations(cardId: string) {
  return useMutation(queryKeys.ivrValidation(cardId), () => {
    return api("v1", `cards/apply-pay/activate/`, "POST", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
      ["cardId"]: cardId,
    });
  });
}
