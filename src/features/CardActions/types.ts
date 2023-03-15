export interface Card {
  CardId: string;
  CardType: string;
  ProductId: string;
  LastFourDigits: string;
  Status: string;
  AccountName: string;
  AccountNumber: string;
}

export interface CustomerTier {
  tier: string;
}

export type CardStatus = "active" | "inactive" | "frozen";
