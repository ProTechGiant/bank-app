export interface NotificationType<DateType> {
  NotificationId: number;
  NotificationName: string;
  MessageContent: string;
  CreatedOn: DateType;
  SubCategoryScreen: string;
  SubCategoryStack: string;
  SubCategories: SubCategoryType[];
}

export interface SubCategoryType {
  Id: number;
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

export const PAGE_SIZE = 5;
