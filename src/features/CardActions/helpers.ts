import { SINGLE_USE_CARD_TYPE } from "@/constants";

import { Card } from "./types";

export function isCardInactive(card: Card) {
  return card.Status === "expired_report" || card.Status === "expired" || card.Status === "inactive";
}

export function hasActiveSingleUseCard(cardsList: Card[]) {
  return cardsList.find(card => card.CardType === SINGLE_USE_CARD_TYPE && card.Status === "freeze") !== undefined;
}
