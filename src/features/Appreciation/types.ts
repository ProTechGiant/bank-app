export enum TabsTypes {
  ALL = "All",
  REDEEMED = "Redeemed",
  LIKED = "Liked",
}

export enum SortingOptions {
  RECOMMENDED = "recommendedForYou",
  MOST_RECENT = "mostRecent",
  ALPHABETIC = "alphabetic",
}

export enum UserTypeEnum {
  STANDARD = "standard",
  PLUS = "plus",
}
export interface FilterItemType {
  Name: string;
  Code: number;
  isActive?: boolean;
}
export interface FiltersType {
  Categories: FilterItemType[];
  Locations: FilterItemType[];
  Sections?: FilterItemType[];
  Types: FilterItemType[];
}
export interface AppreciationType {
  ActiveFlag: number;
  Category: FilterItemType;
  CreationDate: string;
  ExpiryDate: string;
  ImageUrl: string;
  Location: FilterItemType;
  PartnerName: string;
  PreSaleDateTime: string;
  PreSaleDescription: string;
  Ranking: number;
  RedeemFlag: number;
  Section: FilterItemType;
  Tier: number;
  Type: AppreciationType;
  VoucherDescription: string;
  VoucherId: string;
  VoucherName: string;
}
export interface AppreciationResponceType {
  Appreciations: AppreciationType[];
  CustomerId: number;
}

export interface AppreciationFeedbackRequest {
  appreciationId: string;
  comment: string;
  voteId: string;
}
