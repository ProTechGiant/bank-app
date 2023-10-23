import { useQuery } from "react-query";

import api from "@/api";
import {
  LUX_CARD_PRODUCT_ID,
  PHYSICAL_CARD_TYPE,
  SINGLE_USE_CARD_TYPE,
  STANDARD_CARD_PRODUCT_ID,
  VIRTUAL_CARD_TYPE,
} from "@/constants";
import { generateRandomId } from "@/utils";

export type CardStatus =
  | "EXPIRED"
  | "EXPIRED_REPORT"
  | "INACTIVE"
  | "LOST"
  | "DAMAGED"
  | "STOLEN"
  | "PENDING-ACTIVATION"
  | "CANCELLED"
  | "LOCK"
  | "UNLOCK"
  | "NEW_CARD"
  | "ACTIVATE";

export const queryKeys = {
  all: () => ["cards"] as const,
};

export interface Card {
  CardId: string;
  CardType: typeof PHYSICAL_CARD_TYPE | typeof SINGLE_USE_CARD_TYPE | typeof VIRTUAL_CARD_TYPE;
  ProductId: typeof STANDARD_CARD_PRODUCT_ID | typeof LUX_CARD_PRODUCT_ID;
  LastFourDigits: string;
  Status: CardStatus;
  AccountName: string;
  AccountNumber: string;
  IsExpireSoon: boolean;
  IsExpired: boolean;
}

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
