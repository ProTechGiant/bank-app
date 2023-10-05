import {
  LUX_CARD_PRODUCT_ID,
  PHYSICAL_CARD_TYPE,
  SINGLE_USE_CARD_TYPE,
  STANDARD_CARD_PRODUCT_ID,
  VIRTUAL_CARD_TYPE,
} from "@/constants";

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

export interface CardSettingsInput {
  ContactlessPayments?: boolean;
  OnlinePayments?: boolean;
  AtmWithdrawals?: boolean;
  SwipePayments?: boolean;
  InternationalPayments?: boolean;
  POSTransaction?: boolean;
}

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

export interface CardCreateResponse {
  Header: {
    ErrorId: string;
    ErrorDesc: string;
  };
  Body: {
    CmAccountId: string;
    CmCustomerId: string;
    Token: string;
    LastFourDigit: string;
    CardId: string;
    CardType: string;
    CardProductId: string;
    Status: string;
  };
}

export interface DetailedCardResponse {
  ExpDate: string;
  CardNumber: string;
  Cvv: string;
}

export interface ChangePOSLimit {
  CardIdType: string;
  CardId: string;
  Reason: string;
  Limits: {
    LimitType: string;
    Value: string;
    Currency: string;
  };
}

export type ActionType =
  | "ReissAsNew" // Used to issue the physical card for the first time.
  | "Reissue" // Used to issue physical card after replacement of virtual card.
  | "Replacement" // Used to replace the virtual card by new one with new card number and PIN.
  | "Renewal" // Used to extend the expiry date of the card.
  | "Convert"; // Convert virtual card to physical card.

export type RenewalReason = "Cancellation" | "Expiration";
