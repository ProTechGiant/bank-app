import { PHYSICAL_CARD_TYPE, SINGLE_USE_CARD_TYPE } from "@/constants";

import { Card } from "./types";

export function isPhysicalCard(card: Card) {
  return card.CardType === PHYSICAL_CARD_TYPE;
}

export function isSingleUseCard(card: Card) {
  return card.CardType === SINGLE_USE_CARD_TYPE;
}

export function isSingleUseCardInactive(card: Card) {
  return card.Status === "expired_report" || card.Status === "expired" || card.Status === "inactive";
}

export function hasActiveSingleUseCard(cardsList: Card[]) {
  return cardsList.some(card => isSingleUseCard(card) && card.Status === "unfreeze");
}

export function formatCardNumber(cardNumber: string) {
  return cardNumber.replace(/\d{4}(?=\d)/g, "$& ");
}

export function formatCardExpiryDate(expiryDate: string) {
  return expiryDate.replace(/(\d{2})(\d{2})/, "$2/$1");
}
