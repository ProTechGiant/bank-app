import { FavoriteEnum } from "@/features/Appreciation/types";

export enum TabsTypes {
  ALL = "All",
  REDEEMED = "Redeemed",
  LIKED = "Liked",
}

export enum SortingOptions {
  RECOMMENDED = "recommendedForYou",
  MOST_RECENT = "mostRecent",
  ALPHABETIC = "alphabetic",
  EXPIRING_SOONEST = "expiringSoonest",
}
export interface FilterItemType {
  Name: string;
  Code: number;
  isActive?: boolean;
}
export interface AppreciationType<FavoriteType> {
  AppreciationId: string;
  isFavourite: FavoriteType;
  VoucherCode: string;
  Pin_Password: string;
  Rank: number;
  AppreciationName: string;
  AppreciationDescription: string;
  PartnerName: string;
  PartnerDescription: string;
  PartnerTermsAndConditionsId: string;
  Tier: number;
  Category: FilterItemType;
  Section: FilterItemType;
  Type: FilterItemType;
  Location: FilterItemType;
  RedeemFlag: number;
  ActiveFlag: number;
  ExpiryDate: string;
  ImageUrl: string;
  PresaleContent: string;
  PresaleDate: string;
  AppreciationTermsAndConditionsId: string;
}
export interface AppreciationResponseType {
  PageSize: number;
  Offset: number;
  Appreciations: AppreciationType<FavoriteEnum>[];
  CustomerId: number;
}

export enum PromotedEnum {
  Code = "1",
  Name = "Promotional",
}
