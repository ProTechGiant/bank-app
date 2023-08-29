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
export interface FilterType {
  Name: string;
  isActive: boolean;
}
export interface FilterItemType extends FilterType {
  Code: number;
}
export interface CategoryType extends FilterType {
  CategoryCode: number;
}
export interface SectionType extends FilterType {
  LocationCode: number;
}
export interface LocationType extends FilterType {
  SectionCode: number;
}
export interface RedeemType extends FilterType {
  TypeCode: number;
}
export interface FiltersType {
  Categories: CategoryType[];
  Locations: LocationType[];
  Sections?: SectionType[];
  Types: FilterItemType[];
}
export interface AppreciationType {
  ActiveFlag: number;
  Category: CategoryType;
  CreationDate: string;
  ExpiryDate: string;
  ImageUrl: string;
  Location: LocationType;
  PartnerName: string;
  PreSaleDateTime: string;
  PreSaleDescription: string;
  Ranking: number;
  RedeemFlag: number;
  Section: SectionType;
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
