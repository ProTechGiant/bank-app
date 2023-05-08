import { format } from "date-fns";

export function formatDateTime(date: Date) {
  return format(date, "d MMMM, yyyy • HH:mm");
}

const ACTIVE_CASE_STATUSES = ["Opened", "Assigned", "In Review", "Reopened"];
export function isCaseActive(status: string) {
  return ACTIVE_CASE_STATUSES.includes(status);
}
