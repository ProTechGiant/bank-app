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
  cardStatus?: "ACTIVATED" | "INACTIVE";
  paymentPlan?: string;
  paymentPlanId?: number;
  redemptionMethod?: string;
  redemptionMethodId?: number;
  cardType?: "nera" | "neraPlus";
  setContextState: (newState: Partial<AllInOneCardContextState>) => void;
  resetState: () => void;
  setScreen: (screen: Screens) => void;
}

export interface TransactionItem {
  Title: string;
  Date: string;
  Amount: string;
  Status: string;
  PaymentType: string;
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
  cardType: "nera" | "neraPlus";
  isDiamond: boolean;
  benefits: Benefit[];
  freeBenefits: FreeBenefits;
}

export interface neraData {
  icon: JSX.Element;
  title: string;
  description: string;
}

export interface CardReview {
  cardDetails: {
    type: string;
    rewardMethod: string;
  };
  currencies: {
    freeCurrencies: string;
    description: string;
  };
  benefits: {
    description: string;
    note: string;
    icons: JSX.Element[]; // Assuming these are React components
  };
  payment: {
    subscriptionType: "monthly" | "yearly";
    subscription: {
      monthly: {
        duration: string;
        charges: string;
      };
      yearly: {
        duration: string;
        charges: string;
      };
    };
    vat: string;
    total: string;
  };
}
