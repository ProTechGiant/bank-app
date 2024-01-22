import { ApiAccountResponseElement, ApiBalanceResponseElement } from "@/hooks/use-accounts";
import AuthenticatedStackParams from "@/navigation/AuthenticatedStackParams";
import { HomePageConfigurationResponse } from "@/types/Homepage";

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

export interface TransactionDetailed {
  cardType: string;
  status: string;
  location: string;
  title: string;
  subTitle: string;
  amount: string;
  currency: string;
  transactionDate: number[];
  roundUpsAmount: string;
  categoryName?: string;
  categoryId?: string;
  hiddenIndicator: string;
}

export interface Transaction {
  AccountId: string;
  TransactionId: string;
  CardType: string;
  StatementReference: string;
  CreditDebitIndicator: string;
  Status: string;
  TransactionInformation: string;
  BookingDateTime: number[];
  ValueDateTime: number[];
  AddressLine: string;
  ChargeAmount: {
    Amount: string;
  };
  Amount: {
    Amount: string;
    Currency: string;
  };
  MerchantDetails: { MerchantName: string };
  SupplementaryData: {
    RoundupAmount: string;
    RoundupCurrency: string;
    CategoryId: string;
    CategoryName: string;
  };
  HiddenIndicator: string;
}

export interface Transaction {
  Amount: {
    Amount: string;
    Currency: string;
  };
  MerchantDetails: { MerchantName: string };
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

export interface PendingTask {
  ActionId: string;
  ActionTypeId: string;
  DueDate: string;
  Description: string;
  Persistent: boolean;
  ServiceId: string;
  MessageId: string;
  MessageText: string;
  RedirectDestinationLink: keyof ScreenRouteNameMappingType;
  UpdatedBy: string;
  ButtonName: string;
  SecondaryButtonName: string;
}

export interface BulletinTasksResponse {
  PendingTasks: PendingTask[];
  total: string;
  Completed: string;
}

export type ScreenRouteNameMappingType = Record<string, string>;

export type HomeTabsScreens = "Transfer" | "Home" | "Cards" | "Support";

export interface HomepageContentResponse {
  Homepage: {
    Sections: {
      Actions: BulletinTasksResponse;
      Products: {
        Accounts: {
          Account: ApiAccountResponseElement["Data"]["Account"];
          AccountCategory: string;
          Balance: ApiBalanceResponseElement["Data"]["Balance"];
        };
        SavingPots: [];
      }[];
      Shortcuts: HomePageConfigurationResponse["Homepage"]["Sections"]["Shortcuts"];
      HeroFeatures: HomePageConfigurationResponse["Homepage"]["Sections"]["HeroFeatures"];
      Sections: HomePageConfigurationResponse["Homepage"]["Sections"]["Sections"];
      BalanceVisibility: boolean;
    };
  };
}

export const DEFAULT_BULLETIN_BOARD: BulletinTasksResponse = {
  PendingTasks: [],
  Completed: "default",
  total: "default",
};
