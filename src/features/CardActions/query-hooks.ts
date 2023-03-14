import { useMutation, useQuery } from "react-query";

import api from "@/api";
import { generateRandomId } from "@/utils";

import { Card, CustomerTier } from "./types";

interface CardsResponse {
  Cards: Card[];
}

export function useCards() {
  return useQuery("cards", () => {
    return api<CardsResponse>("v1", "cards", "GET", undefined, undefined, {
      ["x-correlation-id"]: generateRandomId(),
    });
  });
}
interface FreezeCardResponse {
  Status: string;
  IsOtpRequired: boolean;
}
interface UnfreezeCardResponse {
  IsOtpRequired: boolean;
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

interface OtpResponse {
  OtpId: string;
  OtpCode: string;
  PhoneNumber: string;
}

interface OtpRequest {
  OtpId: string;
  OtpCode: string;
  CardId: string;
  correlationId: string;
}

interface OtpValidationResponse {
  IsOtpValid: boolean;
  NumOfAttempts: number;
  Pin?: string;
}

export function useFreezeCard() {
  return useMutation(({ cardId, correlationId }: { cardId: string; correlationId: string }) => {
    return api<FreezeCardResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: "freeze" },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
  });
}

export function useUnfreezeCard() {
  return useMutation(({ cardId, correlationId }: { cardId: string; correlationId: string }) => {
    return api<UnfreezeCardResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: "unfreeze" },
      {
        ["x-correlation-id"]: correlationId,
      }
    );
    // For testing while BE is not returning Phone Number (to be removed)
    // return {
    //   IsOtpRequired: true,
    //   OtpId: "5e52ac26-3e9b-42f1-b2b7-5e50818c1db4",
    //   OtpCode: "1915",
    //   PhoneNumber: "+966555555555",
    // };
  });
}

export function useCustomerTier() {
  return useQuery("customer", () => {
    return api<CustomerTier>("v1", "customer/tier", "GET");
  });
}

export function useRequestViewPinOtp() {
  return useMutation(({ cardId, correlationId }: { cardId: string; correlationId: string }) => {
    return api<OtpResponse>("v1", `cards/${cardId}/pin`, "GET", undefined, undefined, {
      ["x-correlation-id"]: correlationId,
    });
    // For testing while BE is not working (to be removed)
    // return {
    //   OtpId: "d4b3ddff-0716-443b-83bb-90665a932297",
    //   OtpCode: "1234",
    //   PhoneNumber: "+966555555555",
    // };
  });
}

export function useOtpValidation() {
  return useMutation(({ CardId, OtpId, OtpCode, correlationId }: OtpRequest) => {
    return api<OtpValidationResponse>(
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
    // For testing while BE is not working (to be removed)
    // return {
    //   IsOtpValid: true,
    //   NumOfAttempts: 2,
    //   Pin: "1234",
    // };
  });
}
