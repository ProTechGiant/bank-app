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
  VoucherCodeType: VoucherCodeEnum;
  VoucherCode: string;
  Pin_Password: string;
}

export enum VoucherCodeEnum {
  COUPON = 0,
  QR = 1,
  BARCODE = 2,
}
export interface AppreciationResponceType {
  Appreciations: AppreciationType[];
  CustomerId: number;
}
