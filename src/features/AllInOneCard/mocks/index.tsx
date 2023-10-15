import { DiamondIcon } from "@/assets/icons";

import { NetflixIcon, PhoneIcon } from "../assets/icons";
import { CardData, neraData } from "../types";

export const cardData: CardData[] = [
  {
    id: 1,
    title: "nera Plus",
    isDiamond: true,
    benefits: [
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "6 Free Currencies with lower exchange rate ",
      },
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "1000+ Lounge Access 12 times",
      },
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "Detailed Spending Insights",
      },
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "1.2% Cashback or Mokafaa Points",
      },
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "Discount on Product and Services Fees",
      },
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "Enjoy Visa Signature Benefits",
      },
    ],
    freeBenefits: {
      description: "You can choose up to 2 free subscriptions.",
      subscriptions: [<NetflixIcon />, <NetflixIcon />, <NetflixIcon />, <NetflixIcon />, <NetflixIcon />],
      subscription: [438, 50],
    },
  },
  {
    id: 2,
    title: "nera",
    isDiamond: false,
    benefits: [
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "4 Free Currencies",
      },
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "1000+ Lounge Access 12 times",
      },
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "0.5% Cashback or Mokafaa Points",
      },
      {
        icon: <DiamondIcon width={17} height={16} color="#000" />,
        description: "Enjoy Visa Platinum Benefits",
      },
    ],
    freeBenefits: {
      description: " 3 month free subscription.",
      subscriptions: [<NetflixIcon />],
      subscription: [0],
    },
  },
];

export const neraDataModal: neraData[] = [
  {
    icon: <PhoneIcon />,
    title: "nera plus ",
    description: "An exclusive subscription that will elevate you experience and bring you what’s next. ",
  },
  {
    icon: <PhoneIcon />,
    title: "Free subscriptions ",
    description: "Enjoy 3 free subscriptions ",
  },
  {
    icon: <PhoneIcon />,
    title: "6 Free Currencies",
    description: "With a with a very competitive exchange rate",
  },
  {
    icon: <PhoneIcon />,
    title: "Up to 20% off YQ meet & assist ",
    description: "YQ is a global network of specialist airport meet & assist service partners at over 450 airports.",
  },
  {
    icon: <PhoneIcon />,
    title: "Fraudulent card misuse protection",
    description: "Control your spendings with exclusive insights",
  },
  {
    icon: <PhoneIcon />,
    title: "Airport lounge access",
    description: "12  free airport lounge access passes per year",
  },

  {
    icon: <PhoneIcon />,
    title: "Visa golf access",
    description: "Discounts on green fees at member golf clubs across the globe.",
  },
];

export const paymentOptions = [
  {
    Id: 1,
    Name: "One Time Yearly Payment",
    Description: "438.00 SAR / Year",
    isRecommended: true,
    discount: 17,
  },
  {
    Id: 2,
    Name: "Easy Monthly Installments",
    Description: "50.00 SAR / Month",
  },
];

export const rewardsMethods = [
  {
    Id: 1,
    Name: "Cashback",
    Description:
      "Get 1% on each transaction and 2% on preferred partners. The money will be directly transferred to your All-in-one card SAR wallet.",
  },
  {
    Id: 2,
    Name: "Mokafaa Points",
    Description:
      "Receive X point for every 1 SAR spent. Use those points to redeem rewards like gift cards, travel perks, merchandise or unlock higher-value perks.",
  },
];

export const mockTransactions = [
  {
    Title: "Starbucks",
    Date: "10-03-2023 | 20:45",
    Amount: "-100.00",
    Status: "SUCCESS",
    PaymentType: "Cashback: 2 SAR",
  },
  {
    Title: "Zara",
    Date: "10-03-2023 | 20:45",
    Amount: "-530.00",
    Status: "SUCCESS",
    PaymentType: "Card Deposit",
  },
  // {
  //   Title: "Regular payment",
  //   Date: "10-03-2023 | 20:45",
  //   Amount: "+120.00 SAR",
  //   Status: "FAILED",
  //   PaymentType: "Transfer",
  // },
  {
    Title: "Aldrees",
    Date: "10-03-2023 | 20:45",
    Amount: "-200.00",
    Status: "FAILED",
    PaymentType: "Cashback: 10 SAR",
  },
];

export const cardType = "neraPlus";
