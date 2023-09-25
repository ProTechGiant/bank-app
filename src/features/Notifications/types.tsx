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

export interface SectionType {
  day: SectionEnum;
  title: string;
  data: NotificationType<Date>[];
}

export const PAGE_SIZE = 10;
export const SUBTITLE_MAX_LENGTH = 50;
