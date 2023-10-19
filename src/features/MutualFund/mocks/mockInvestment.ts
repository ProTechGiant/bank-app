import { AssetInvestment } from "../types";

export const mockInvestment: AssetInvestment = {
  TotalInvesmtent: "3485 SAR",
  Investments: [
    { assetName: "Sokuk", percentage: "50%", investmentAmount: "1742.5 SAR", color: "#DEEDC4" },
    { assetName: "Shares Fund", percentage: "25%", investmentAmount: "871.25 SAR", color: "#DFD8F3" },
    { assetName: "Cash Markets Fund", percentage: "25%", investmentAmount: "871.25 SAR", color: "#D8F3EF" },
  ],
};

export const mockChartData = [
  { x: "Shares Fund", y: 30 },
  { x: "Cash Markets Fund", y: 50 },
  { x: "Sokuk", y: 20 },
];
