export interface lineDetails {
  name: string;
  color: string;
  data: { x: number; y: number }[];
}

type Product = {
  Id: string;
  Name: string;
  YTD: number;
  NAV: number;
  isActive: boolean;
  currency: string;
  fundAvailability: string;
  minimumSubscriptionAmount: number;
  minimumAdditionalSubscriptionAmount: number;
  subscriptionFees: number;
  riskLevel: string;
  isEndowment: boolean;
  categoryArabic: string;
  categoryEnglish: string;
  strategy: string;
  dealingDaysFrequency: string;
  dealingDays: string;
  dividend: string;
  risk: string;
};

export type OffersProducts = {
  productsList: Product[];
};
