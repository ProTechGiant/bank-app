import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { Address } from "@/types/Address";
import { generateRandomId } from "@/utils";
import { tokenizeCardForAppleWalletAsync } from "@/utils/apple-wallet";

import { Card, CardSettingsInput } from "../types";

export const queryKeys = {
  all: () => ["cards"] as const,
  settings: (cardId: string) => [...queryKeys.all(), "settings", { cardId }] as const,
  meawalletTokenization: (cardId: string) => [...queryKeys.all(), "meawallet-tokenization", { cardId }] as const,
  customerTier: () => ["customer-tier"] as const,
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
        queryClient.invalidateQueries(queryKeys.all());
      },
    }
  );
}

export function useUnfreezeCard() {
  return useMutation(async ({ cardId }: { cardId: string }) => {
    const correlationId = generateRandomId();

    const response = await api<OtpRequiredResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: "unfreeze" },
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

interface OtpRequiredResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

interface ValidateOtpRequest<T extends object> {
  OtpId: string;
  OtpCode: string;
  correlationId: string;
  optionalParams: T;
}

interface ValidateOtpResponse {
  IsOtpValid: boolean;
  NumOfAttempts: number;
}

export function useOtpValidation<RequestT extends object, ResponseT extends object>() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ OtpId, OtpCode, correlationId, optionalParams }: ValidateOtpRequest<RequestT>) => {
      return api<ValidateOtpResponse & ResponseT>(
        "v1",
        `cards/otp-validation`,
        "POST",
        undefined,
        {
          ...optionalParams,
          OtpId: OtpId,
          OtpCode: OtpCode,
        },
        {
          ["x-correlation-id"]: correlationId,
        }
      );
    },
    {
      onSettled: (_data, _error, variables, _context) => {
        queryClient.invalidateQueries(queryKeys.all());

        if (variables.optionalParams?.CardId !== undefined) {
          queryClient.invalidateQueries(queryKeys.settings(variables.optionalParams.CardId));
        }
      },
    }
  );
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

export function useReportCard() {
  const queryClient = useQueryClient();

  return useMutation(
    ({
      cardId,
      correlationId,
      status,
      alternativeAddress,
    }: {
      cardId: string;
      correlationId: string;
      status: string;
      alternativeAddress?: Address;
    }) => {
      return api<OtpRequiredResponse>(
        "v1",
        `cards/${cardId}`,
        "POST",
        undefined,
        { Status: status, alternativeAddress: alternativeAddress },
        { ["x-correlation-id"]: correlationId }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(queryKeys.all());
      },
    }
  );
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

export default function useSubmitOrderCard() {
  return useMutation(async ({ values }: { values: OrderCardInput }) => {
    const correlationId = generateRandomId();

    const response = await api<OrderCardResponse>("v1", "cards", "POST", undefined, values, {
      ["x-correlation-id"]: correlationId,
    });

    return { ...response, correlationId };
  });
}
