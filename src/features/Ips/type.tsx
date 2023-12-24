import { Theme } from "@/theme";

export enum IpsTabsEnum {
  SENT = "sent",
  RECEIVED = "received",
}

export enum FilterTypeEnum {
  ALL = "all",
  PENDING = "pending",
  CANCELED = "canceled",
  PAID = "paid",
  EXPIRED = "expired",
  REJECTED = "rejected",
}

export const FILTER_COLOR_MAPPING: Record<FilterTypeEnum, keyof Theme["palette"]> = {
  [FilterTypeEnum.PENDING]: "neutralBase",
  [FilterTypeEnum.PAID]: "successBase",
  [FilterTypeEnum.REJECTED]: "errorBase",
  [FilterTypeEnum.EXPIRED]: "warningBase",
  [FilterTypeEnum.CANCELED]: "errorBase",
  [FilterTypeEnum.ALL]: "neutralBase",
};
