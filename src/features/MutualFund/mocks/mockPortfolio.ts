import { PortfolioData } from "../types";

export const mockPortfolioInformation = {
  mutualFundName: "Al Rajhi Conservative Fund",
  inceptionDate: "September 2023",
  fundCurrency: "Saudi Riyal",
  performanceFee: "Nil",
  minimumSubscription: "5,000 SAR",
  minimumAdditionalSubscription: "2,000 SAR",
  riskLevel: "High",
};

export const mockPortfolioList: PortfolioData = {
  TotalPortfoliosValue: 458666154.5245,
  TotalCashBalance: 458666154.5245,
  TotalGainLoss: 55,
  TotalGainLossPercentage: 0.1,
  portfolioList: [
    {
      portfolioId: 1235,
      portfolioCode: "1122-001-0011223344555",
      portfolioName: "Croatia account",
      portfolioHoldingList: [
        {
          productInformation: {
            productId: 321,
            productName: "SRC Fund A1",
          },
        },
        {
          productInformation: {
            productId: 456,
            productName: "Portfolio A",
          },
        },
        {
          productInformation: {
            productId: 456,
            productName: "Croatia account",
          },
        },
      ],
    },
    {
      portfolioId: 4678,
      portfolioCode: "PORT002",
      portfolioName: "Portfolio B",
      portfolioHoldingList: [
        {
          productInformation: {
            productId: 987,
            productName: "SRC Fund B1",
          },
        },
      ],
    },
  ],
};
