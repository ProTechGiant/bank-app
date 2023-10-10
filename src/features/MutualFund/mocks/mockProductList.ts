import { OffersProducts } from "../types";

const mockOffersProducs: OffersProducts = {
  productsList: [
    {
      Id: "1234",
      Name: "ABC Fund SAR",
      YTD: 54,
      NAV: 52.56,
      isActive: true,
      currency: "SAR",
      fundAvailability: "A",
      minimumSubscriptionAmount: 5000,
      minimumAdditionalSubscriptionAmount: 5000,
      subscriptionFees: 0.025,
      riskLevel: "High",
      isEndowment: true,
      categoryArabic: "توزيعات",
      categoryEnglish: "Dividend",
      strategy: "Income",
      dealingDaysFrequency: "Bi-Weekly",
      dealingDays: "Sunday & Wednesday",
      dividend: "SA",
      risk: "H",
    },
  ],
};
export default mockOffersProducs;
