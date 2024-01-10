import { Theme } from "@/theme";

import { DAYS_BEFORE_EXPIRY } from "./constants";

export enum IpsTabsEnum {
  SENT = "sent",
  RECEIVED = "received",
}

export enum RequestStatusEnum {
  ALL = "all",
  PENDING = "pending",
  CANCELED = "canceled",
  PAID = "paid",
  EXPIRED = "expired",
  REJECTED = "rejected",
}

export enum RequestDetailsScreenTypeEnum {
  CONFIRM = "CONFIRM",
  PENDING = "PENDING",
  FINISHED = "FINISHED",
}

export const FILTER_COLOR_MAPPING: Record<RequestStatusEnum, keyof Theme["palette"]> = {
  [RequestStatusEnum.PENDING]: "neutralBase",
  [RequestStatusEnum.PAID]: "successBase",
  [RequestStatusEnum.REJECTED]: "errorBase",
  [RequestStatusEnum.EXPIRED]: "warningBase",
  [RequestStatusEnum.CANCELED]: "errorBase",
  [RequestStatusEnum.ALL]: "neutralBase",
};

export type DaysType = (typeof DAYS_BEFORE_EXPIRY)[number];
