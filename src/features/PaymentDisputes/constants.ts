import { Theme } from "@/theme";

export const ACTIVE_CASE_STATUSES = ["Opened", "Assigned", "In Review", "Reopened"];
export const STATUS_COLOR_MAPPING: Record<string, keyof Theme["palette"]> = {
  Opened: "neutralBase+30",
  Assigned: "warningBase",
  "In Review": "warningBase",
  Approved: "successBase",
  Rejected: "errorBase",
  Reopened: "neutralBase+30",
};

export const STATUS_LABEL_MAPPING: Record<string, string> = {
  Opened: "PaymentDisputes.CaseListItem.opened",
  Assigned: "PaymentDisputes.CaseListItem.assigned",
  "In Review": "PaymentDisputes.CaseListItem.inReview",
  Approved: "PaymentDisputes.CaseListItem.approved",
  Rejected: "PaymentDisputes.CaseListItem.rejected",
  Reopened: "PaymentDisputes.CaseListItem.reopened",
};
