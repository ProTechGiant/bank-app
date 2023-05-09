import { format } from "date-fns";

import { ACTIVE_CASE_STATUSES } from "../constants";

export function formatDateTime(date: Date) {
  return format(date, "d MMMM, yyyy • HH:mm");
}

export function isCaseActive(status: string) {
  return ACTIVE_CASE_STATUSES.includes(status);
}
