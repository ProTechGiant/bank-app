import { useMutation, useQuery, useQueryClient } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { Card, CardCreateResponse, CardSettingsInput, DetailedCardResponse } from "./types";

const queryKeys = {
  all: () => ["cards"] as const,
  settings: (cardId: string) => [...queryKeys.all(), "settings", { cardId }],
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
  return useMutation(({ cardId, correlationId }: { cardId: string; correlationId: string }) => {
    return api<OtpRequiredResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: "unfreeze" },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
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
    ({ correlationId, cardId, settings }: { correlationId: string; cardId: string; settings: CardSettingsInput }) => {
      return api<UpdateCardSettingsResponse>("v1", `cards/${cardId}/settings`, "POST", undefined, settings, {
        ["x-correlation-id"]: correlationId,
      });
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
  return useMutation(({ cardId, correlationId }: { cardId: string; correlationId: string }) => {
    return api<OtpRequiredResponse>("v1", `cards/${cardId}/pin`, "GET", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
    });
  });
}

interface OtpRequiredResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

interface ValidateOtpRequest {
  OtpId: string;
  OtpCode: string;
  CardId: string;
  correlationId: string;
}

interface ValidateOtpResponse {
  IsOtpValid: boolean;
  NumOfAttempts: number;
  Pin?: string;
  CardCreateResponse?: CardCreateResponse;
  DetailedCardResponse?: DetailedCardResponse;
}

export function useOtpValidation() {
  const queryClient = useQueryClient();

  return useMutation(
    ({ CardId, OtpId, OtpCode, correlationId }: ValidateOtpRequest) => {
      return api<ValidateOtpResponse>(
        "v1",
        `cards/otp-validation`,
        "POST",
        undefined,
        {
          CardId: CardId,
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

        if (variables.CardId !== undefined && variables.CardId !== "") {
          queryClient.invalidateQueries(queryKeys.settings(variables.CardId));
        }
      },
    }
  );
}

export function useUnmaskedCardDetails() {
  return useMutation(({ cardId, correlationId }: { cardId: string; correlationId: string }) => {
    return api<OtpRequiredResponse>("v1", `cards/${cardId}`, "GET", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
    });
  });
}
