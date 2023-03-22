import { Card } from "./types";

export function isCardInactive(card: Card) {
  return card.Status === "expired_report" || card.Status === "expired" || card.Status === "inactive";
}
