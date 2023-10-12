export interface lineDetails {
  name: string;
  color: string;
  data: { x: number; y: number }[];
}

export type Product = {
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

export interface Account {
  AccountName: string;
}

type ProductInformation = {
  productId: number;
  productName: string;
};

export type PortfolioHolding = {
  productInformation: ProductInformation;
};

export type Portfolio = {
  portfolioId: number;
  portfolioCode: string;
  portfolioName: string;
  portfolioHoldingList: PortfolioHolding[];
};

export type PortfolioData = {
  TotalPortfoliosValue: number;
  TotalCashBalance: number;
  TotalGainLoss: number;
  TotalGainLossPercentage: number;
  portfolioList: Portfolio[];
};
