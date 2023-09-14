import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";

export interface Notification {
  action_id: string;
  action_type: string;
  action_status: string;
  action_title: string;
  action_message: string;
  action_link: keyof AuthenticatedStackParams;
  action_button_text: string;
}

export interface HomepageItemLayoutType {
  name: string;
  type: string;
  description: string;
  isItemChecked: boolean;
}

export interface TaskType {
  ActionId: string;
  ActionTypeId: string;
  DueDate: string;
  Description: string;
  Persistent: boolean;
  ServiceId: string;
  MessageId: string;
  MessageText: string;
  RedirectDestinationLink: string;
  UpdatedBy: string;
  ButtonName: string;
  SecondaryButtonName?: string;
}

type CustomerConfigurationType =
  | { IsVisible: true; SectionIndex: number }
  | { IsVisible: false; SectionIndex?: number };

export interface QuickActionType {
  Id: string;
  Name: string;
  "Shortcut Icon": string;
  Description: string;
  Link: {
    screen: string;
    stack: keyof AuthenticatedStackParams;
  };
  CustomerConfiguration: CustomerConfigurationType;
}

export interface QuickActionsType {
  Homepage: {
    Sections: {
      Shortcuts: QuickActionType[];
    };
  };
}

export enum FeedbackStatus {
  IDLE = "idle",
  POSITIVE = "1",
  NEGATIVE = "2",
}

export enum NotificationModalVariant {
  success = "success",
  error = "error",
}
interface IncludedTopCategory {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  percentage: string;
  currency: string;
  iconPath: string;
  iconViewBox: string;
}
export interface TopSpendingCategoriesResponse {
  categories: {
    total: number;
    includedCategories: IncludedTopCategory[];
  };
}
export interface AppreciationFeedbackRequest {
  appreciationId: string;
  comment: string;
  voteId: string;
}

interface MediaType {
  SourceFileName: string;
  SourceFileDatatype: string;
  SourceFileURL: string;
}

export interface FilterItemType {
  id: string;
  name: string;
  isActive: boolean;
}

interface AuthorSocialMediaType {
  Name: string;
  Link: string;
}

interface MediaType {
  SourceFileName: string;
  SourceFileDatatype: string;
  SourceFileURL: string;
}

export interface EventDetails {
  EventDateTime: string;
  OpeningHours: string;
  Location: string;
  Website: string;
  Price: number;
}

export interface ArticleSectionType {
  ContentId: string;
  ParentContentId: string;
  ContentDataTypeId: string;
  ContentCategoryId: string;
  ContentTag: string;
  ContentPublishDateTime: string;
  Title: string;
  SubTitle: string;
  ContentDescription: string;
  Media: MediaType[];
  WhatsNextCategoryId: string;
  WhatsNextCategory: string;
  WhatsNextTypeId: string;
  WhatsNextType: string;
  AuthorName: string;
  AuthorAbout: string;
  AuthorImage: string;
  AuthorSocialMedia: AuthorSocialMediaType;
  EventDetails: EventDetails;
  ChildrenContents?: ArticleSectionType[];
}
