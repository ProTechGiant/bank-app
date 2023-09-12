export interface NotificationType<DateType> {
  NotificationId: number;
  NotificationName: string;
  MessageContent: string;
  CreatedOn: DateType;
  SubCategoryName: string;
  SubCategoryScreen: string;
  SubCategoryStack: string;
}

export interface NotificationsResponseType {
  Notifications: NotificationType<string>[];
  SubCategories: SubCategoryType[];
}
export interface SubCategoryType {
  Id: string;
  Name: string;
}

export interface FilterType extends SubCategoryType {
  isActive: boolean;
}

export enum SectionEnum {
  TODAY = "today",
  YESTERDAY = "yesterday",
  OLDER = "older",
}

//TODO change with the real values once known
export const InfoIconValues = ["Changes to your account", "Changes to your card"];
export const SwapIconValues = ["Payments in", "Payments out", "Scheduled Payments", "Bill payments"];

export const PAGE_SIZE = 10;
