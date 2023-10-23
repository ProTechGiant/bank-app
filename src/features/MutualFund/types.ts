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

export interface AssetsAllocation {
  SokukFund: number;
  InvestmentFund: number;
  SharesFund: number;
  CashMarketsFund: number;
}

export type Product = {
  Id: string;
  Name: string;
  YTD: number;
  NAV: number;
  IsActive: boolean;
  Currency: string;
  FundAvailability: string;
  MinimumSubscriptionAmount: number;
  MinimumAdditionalSubscriptionAmount: number;
  SubscriptionFees: number;
  RiskLevel: string;
  IsEndowment: boolean;
  Category: string;
  Strategy: string;
  DealingDaysFrequency: string;
  DealingDays: string;
  Dividend: string;
  Risk: string;
  AssetsAllocation: AssetsAllocation;
};

export type OffersProducts = {
  ProductsList: Product[];
};

export interface Account {
  AccountName: string;
}

type ProductInformation = {
  ProductId: number;
  ProductName: string;
};

export type PortfolioHolding = {
  ProductInformation: ProductInformation;
};

export type Portfolio = {
  PortfolioId: number;
  PortfolioCode: string;
  PortfolioName: string;
  PortfolioHoldingList: PortfolioHolding[];
};

export type PortfolioData = {
  TotalPortfoliosValue: number;
  TotalCashBalance: number;
  TotalGainLoss: number;
  TotalGainLossPercentage: number;
  PortfolioList: Portfolio[];
};
type HoldinInformation = {
  RiskLevel: string;
  InceptionDate: string;
  ProductCurrency: string;
  SubscriptionFees: string;
  MinimumSubscriptionAmount: number;
  MinimumAdditionalSubscriptionAmount: number;
};
export type PortfolioDetail = {
  PortfolioHoldingList: HoldinInformation[];
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
