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
}

export function useFreezeCard() {
  return useMutation(({ cardId }: { cardId: string }) => {
    return api<FreezeCardResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: "freeze" },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export function useUnfreezeCard() {
  return useMutation(({ cardId }: { cardId: string }) => {
    return api<UnfreezeCardResponse>(
      "v1",
      `cards/${cardId}`,
      "POST",
      undefined,
      { Status: "unfreeze" },
      {
        ["x-correlation-id"]: generateRandomId(),
      }
    );
  });
}

export function useCustomerTier() {
  return useQuery("customer", () => {
    return api<CustomerTier>("v1", "customer/tier", "GET");
  });
}
