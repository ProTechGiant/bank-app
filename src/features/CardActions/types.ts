export interface Card {
  CardId: string;
  CardType: string;
  ProductId: string;
  LastFourDigits: string;
  Status: string;
  AccountName: string;
  AccountNumber: string;
}

export interface CardSettingsInput {
  ContactlessPayments: boolean;
  OnlinePayments: boolean;
  AtmWithdrawals: boolean;
  SwipePayments: boolean;
}

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
  };
}

export type CardStatus = "active" | "inactive" | "frozen";

export interface DetailedCardResponse {
  ExpDate: string;
  CardNumber: string;
  Cvv: string;
}

export type CardType = "standard" | "plus" | "single-use";
