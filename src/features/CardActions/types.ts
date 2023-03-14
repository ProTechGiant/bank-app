export interface Card {
  CardId: string;
  CardType: string;
  ProductId: string;
  LastFourDigits: string;
  Status: string;
}

export interface CustomerTier {
  tier: string;
}

export type CardStatus = "active" | "inactive" | "frozen";
