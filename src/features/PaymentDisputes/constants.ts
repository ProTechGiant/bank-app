import { Theme } from "@/theme";

import { CasesCategoriesEnum } from "./types";

export const ACTIVE_CASE_STATUSES = ["Opened", "Assigned", "In Review", "Reopened"];
export const STATUS_COLOR_MAPPING: Record<string, keyof Theme["palette"]> = {
  Pending: "neutralBase+10",
  Assigned: "warningBase",
  "In Review": "warningBase",
  "In Progress": "warningBase",
  Approved: "successBase",
  Rejected: "errorBase",
  "On Hold": "errorBase",
  Reopened: "neutralBase+30",
};

//FIXME add the real values
export const STATUS_REASON_MAPPING: Record<string, string> = {
  "1": "Pending",
  "2": "In Review",
  "3": "Approved",
  "4": "Rejected",
  "5": "In Progress",
  "6": "On Hold",
};

//FIXME the code for each type
export const CASE_TYPE_MAPPING: Record<CasesCategoriesEnum, string | undefined> = {
  [CasesCategoriesEnum.ALL]: undefined,
  [CasesCategoriesEnum.COMPLAINTS]: "NB00010",
  [CasesCategoriesEnum.DISPUTES]: "AM00002",
  [CasesCategoriesEnum.OTHERS]: "AM00001",
};

export const STATUS_LABEL_MAPPING: Record<string, string> = {
  Opened: "PaymentDisputes.CaseListItem.opened",
  Assigned: "PaymentDisputes.CaseListItem.assigned",
  "In Review": "PaymentDisputes.CaseListItem.inReview",
  Approved: "PaymentDisputes.CaseListItem.approved",
  Rejected: "PaymentDisputes.CaseListItem.rejected",
  Reopened: "PaymentDisputes.CaseListItem.reopened",
};
