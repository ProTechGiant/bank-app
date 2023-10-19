export interface PortfoliosPerformanceList {
  PortfoliosPerformanceList: PortfolioPerformanceList[];
}

export interface PortfolioPerformanceList {
  PortfolioPerformanceList: {
    PortfolioCode: string;
    Date: string;
    MarketValue: string;
  }[];
}

export interface Portfolios {
  TotalPortfoliosValue: number;
  TotalCashBalance: number;
  TotalGainLoss: number;
  TotalGainLossPercentage: number;
  PortfolioList: [
    {
      PortfolioId: number;
      PortfolioCode: string;
      PortfolioName: string;
      PortfolioHoldingList: [
        {
          ProductInformation: {
            ProductId: number;
            ProductName: string;
          };
        },
        {
          ProductInformation: {
            ProductId: number;
            ProductName: string;
          };
        }
      ];
    }
  ];
}

export interface PortfolioDetails {
  PortfolioId: number;
  PortfolioCode: string;
  PortfolioName: string;
  PortfolioCurrency: string;
  TotalPortfolioValue: number;
  TotalCashBalance: number;
  TotalGainLoss: number;
  TotalGainLossPercentage: number;
  PortfolioHoldingList: [
    {
      ProductId: number;
      ProductName: string;
      ProductCurrency: string;
      IsCash: string;
      InvestedValue: number;
      NAV: number;
      YTD: number;
      AvargeCoast: number;
      Units: number;
      InceptionDate: string;
      ValuationDate: string;
      ExchangeRate: number;
      UnrealizedGainLoss: number;
      SubscriptionFees: number;
      MinimumSubscriptionAmount: number;
      MinimumAdditionalSubscriptionAmount: number;
      Dividend: string;
      CategoryArabic: string;
      CategoryEnglish: string;
      Strategy: string;
      MutualFundInfo: string;
      AssetAllocation: {
        Sukuk: number;
        SharesFund: number;
        CashMarketFund: number;
        EIT: number;
      };
    }
  ];
  PortfolioPerformanceList: PortfolioPerformanceList;
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

export type Investment = {
  assetName: string;
  percentage: string;
  investmentAmount: string;
  color: string;
};

export type AssetInvestment = {
  TotalInvesmtent: string;
  Investments: Investment[];
};
