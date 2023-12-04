import { TagVariantType } from "@/components/Tag";

export function getWhatsNextTagColor(WhatsNextTypeId: string) {
  return WhatsNextTypeId === INTERVIEW
    ? "mint"
    : WhatsNextTypeId === WHATS_NEXT_FOR_ME
    ? "blue"
    : WhatsNextTypeId === REVIEW
    ? "purple"
    : "yellow";
}

export function getWhatsNextTagColorBranded(variant: TagVariantType) {
  return variant === "mint"
    ? "secondary_mintBase-20"
    : variant === "blue"
    ? "secondary_blueBase-20"
    : variant === "purple"
    ? "secondary_purpleBase-20"
    : "secondary_yellowBase-30";
}
const INTERVIEW = "1";
const WHATS_NEXT_FOR_ME = "2";
const REVIEW = "3";

export const MAX_ARTICLES_IN_TOP_TEN = "10";
