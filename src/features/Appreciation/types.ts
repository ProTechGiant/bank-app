export interface FilterItemType {
  Name: string;
  Code: number;
  isActive?: boolean;
}
export interface FiltersType {
  Categories: FilterItemType[];
  Locations: FilterItemType[];
  Sections: FilterItemType[];
  Types: FilterItemType[];
}
export interface AppreciationType<FavoriteType> {
  AppreciationId: string;
  isFavourite: FavoriteType;
  VoucherCodeType: VoucherCodeEnum;
  VoucherCode: string;
  Pin_Password: string;
  Tier: number;
  Rank: number;
  AppreciationName: string;
  AppreciationDescription: string;
  AppreciationTime: Date;
  PartnerName: string;
  PartnerDescription: string;
  PartnerTermsAndConditionsId: string;
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

export enum VoucherCodeEnum {
  COUPON = 0,
  QR = 1,
  BARCODE = 2,
}
export interface AppreciationResponseType {
  Appreciations: AppreciationType<FavoriteEnum>[];
  CustomerId: number;
}

export enum FavoriteEnum {
  LIKED = 1,
  NOT_LIKED = 2,
}

export enum ActiveEnum {
  ACTIVE = 1,
  EXPIRED = 2,
}

export enum RedeemFlagEnum {
  NOT_REDEEM = 0,
  REDEEM = 1,
}
