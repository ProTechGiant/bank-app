export function getWhatsNextTagColor(WhatsNextTypeId: string) {
  return WhatsNextTypeId === INTERVIEW
    ? "mint"
    : WhatsNextTypeId === WHATS_NEXT_FOR_ME
    ? "blue"
    : WhatsNextTypeId === REVIEW
    ? "purple"
    : "yellow";
}

const INTERVIEW = "1";
const WHATS_NEXT_FOR_ME = "2";
const REVIEW = "3";

export const MAX_ARTICLES_IN_TOP_TEN = "10";
