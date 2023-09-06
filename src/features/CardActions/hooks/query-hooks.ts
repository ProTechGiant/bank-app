import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { LUX_CARD_PRODUCT_ID, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { OtpRequiredResponse } from "@/features/OneTimePassword/types";
import { Address } from "@/types/Address";
import { generateRandomId } from "@/utils";
import { tokenizeCardForAppleWalletAsync } from "@/utils/apple-wallet";

import { Card, CardSettingsInput, CardStatus } from "../types";

export const queryKeys = {
  all: () => ["cards"] as const,
  settings: (cardId: string) => [...queryKeys.all(), "settings", { cardId }] as const,
  meawalletTokenization: (cardId: string) => [...queryKeys.all(), "meawallet-tokenization", { cardId }] as const,
  customerTier: () => ["customer-tier"] as const,
  posLimits: () => [...queryKeys.all(), "posLimits"] as const,
  currentPOSLimit: (cardId: string) => [...queryKeys.all(), "currentPOSLimit", { cardId }] as const,
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
        { Status: "freeze" },
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

export function useChangeCardStatus() {
  return useMutation(async ({ cardId, status }: { cardId: string; status: CardStatus }) => {
    const correlationId = generateRandomId();

    const response = await api<OtpRequiredResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: status },
      {
        ["x-correlation-id"]: correlationId,
      }
    );

    return { ...response, correlationId };
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
  CardType: string;
  CardProductId: typeof STANDARD_CARD_PRODUCT_ID | typeof LUX_CARD_PRODUCT_ID;
  Pin?: string;
  AlternateAddress?: Address;
}

interface RenewCardResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

export function useSubmitRenewCard() {
  return useMutation(async ({ values }: { values: RenewCardInput }) => {
    const correlationId = generateRandomId();

    const response = await api<RenewCardResponse>("v1", "cards/renew", "POST", undefined, values, {
      ["x-correlation-id"]: correlationId,
    });

    return { ...response, correlationId };
  });
}

interface POSLimitsResponse {
  MaxLimit: string;
  MinLimit: string;
  Banks: Array<string>;
}

export function usePOSLimits() {
  const correlationId = generateRandomId();

  return useQuery(
    queryKeys.posLimits(),
    () => {
      return api<POSLimitsResponse>(
        "v1",
        "cards/limits",
        "POST",
        undefined,
        {
          LimitType: "online_pos_limit",
        },
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
