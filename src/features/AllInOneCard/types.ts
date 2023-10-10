export interface RewardsMethods {
  Id: number;
  Name: string;
  Description: string;
}

export enum Screens {
  ProductSelection,
  Redemption,
  PaymentType,
  OrderReview,
}

export interface AllInOneCardContextState {
  productId?: string;
  paymentPlanId?: string;
  redeemptionMethodId?: string;
}
