import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { LUX_CARD_PRODUCT_ID, STANDARD_CARD_PRODUCT_ID } from "@/constants";
import { OtpRequiredResponse } from "@/features/OneTimePassword/types";
import { Address } from "@/types/Address";
import { generateRandomId } from "@/utils";
import { tokenizeCardForAppleWalletAsync } from "@/utils/apple-wallet";

import { Card, CardSettingsInput, CardStatus } from "../types";

export const cardsQueryKeys = {
  all: () => ["cards"] as const,
  settings: (cardId: string) => [...cardsQueryKeys.all(), "settings", { cardId }] as const,
  meawalletTokenization: (cardId: string) => [...cardsQueryKeys.all(), "meawallet-tokenization", { cardId }] as const,
  customerTier: () => ["customer-tier"] as const,
};

interface CardsResponse {
  Cards: Card[];
}

export function useCards() {
  return useQuery(cardsQueryKeys.all(), () => {
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
    ({ cardId, correlationId }: { cardId: string; correlationId: string }) => {
      return api<FreezeCardResponse>(
        "v1",
        `cards/${cardId}`,
        "POST",
        undefined,
        { Status: "freeze" },
        { ["x-correlation-id"]: correlationId }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(cardsQueryKeys.all());
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
  tier: string;
}

export function useCustomerTier() {
  return useQuery(cardsQueryKeys.customerTier(), () => {
    return api<CustomerTierResponse>("v1", "customer/tier", "GET");
  });
}

// alias for explicitness
type CardSettingsResponse = CardSettingsInput;
export function useCardSettings(cardId: string) {
  return useQuery(cardsQueryKeys.settings(cardId), () => {
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
        queryClient.setQueryData(cardsQueryKeys.settings(variables.cardId), variables.settings);
      },
      onSettled: (data, _options, variables) => {
        if (data !== undefined && data.IsOtpRequired) return;
        queryClient.invalidateQueries(cardsQueryKeys.settings(variables.cardId));
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
    cardsQueryKeys.meawalletTokenization(cardId),
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

export default function useSubmitOrderCard() {
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

interface RenewCardInput {
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
