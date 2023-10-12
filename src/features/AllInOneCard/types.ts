export interface RewardsMethods {
  Id: number;
  Name: string;
  Description: string;
}

export interface PaymentOption {
  Id: number;
  Name: string;
  Description: string;
  isRecommended?: boolean;
  discount?: number;
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

interface Benefit {
  icon: JSX.Element;
  description: string;
}

interface FreeBenefits {
  description: string;
  subscriptions: JSX.Element[];
  subscription: number[];
}

export interface CardData {
  id: number;
  title: string;
  isDiamond: boolean;
  benefits: Benefit[];
  freeBenefits: FreeBenefits;
}

export interface neraData {
  icon: JSX.Element;
  title: string;
  description: string;
}
