export interface Card {
  CardId: string;
  CardType: string;
  ProductId: string;
  LastFourDigits: string;
  Status: CardStatus;
  AccountName: string;
  AccountNumber: string;
}

export interface CardSettingsInput {
  ContactlessPayments: boolean;
  OnlinePayments: boolean;
  AtmWithdrawals: boolean;
  SwipePayments: boolean;
}

export type CardStatus = "expired" | "expired_report" | "inactive" | "unfreeze" | "freeze";

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

export interface DetailedCardResponse {
  ExpDate: string;
  CardNumber: string;
  Cvv: string;
}
