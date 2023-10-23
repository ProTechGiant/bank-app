import { DiamondIcon } from "@/assets/icons";
import { TermsAndConditionSection } from "@/types/Content";

import { NetflixIcon, PhoneIcon } from "../assets/icons";
import { CardData, CardReview, neraData } from "../types";

export const cardData: CardData[] = [
  {
    id: 1,
    title: "nera Plus",
    cardType: "neraPlus",
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
      subscription: [480, 50],
    },
  },
  {
    id: 2,
    title: "nera",
    cardType: "nera",
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
    Description: "480.00 SAR / Year",
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

export const cardReview: CardReview = {
  cardDetails: {
    type: "Nera Plus",
    rewardMethod: "Cash-back",
  },
  currencies: {
    freeCurrencies: "Up to 6 free currencies",
    description: "You can set up your free currencies after activation",
  },
  benefits: {
    description: "Free subscriptions",
    note: "You can set up your free subscriptions once your card is activated",
    icons: [<NetflixIcon />, <NetflixIcon />, <NetflixIcon />, <NetflixIcon />, <NetflixIcon />],
  },
  payment: {
    subscriptionType: "monthly", // or 'yearly'
    subscription: {
      monthly: {
        duration: "12",
        charges: "50.00",
      },
      yearly: {
        duration: "1",
        charges: "480.00",
      },
    },
    vat: "7.50",
    total: "57.50",
  },
};
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
export const DIAL_NUMBER = 1;

export const termsSections: TermsAndConditionSection[] = [
  {
    TermsSectionId: "TSID101",
    Title: "General Terms",
    ContentCategoryId: "CCID101",
    Order: 1,
    Bodies: [
      {
        TermsBodyId: "TBID1011",
        TermsSectionId: "TSID101",
        Order: 1,
        Body: "1.1 These general terms and conditions apply to the services provided to clients by Croatia Bank (individually and jointly ”Croatia”, ”we”, ”us” or ”our”). By engaging Croatia, you are deemed to have accepted these terms and conditions which, in addition to our engagement letter, therefore shall be regarded as contractual content between you and Croatia.",
        ContentCategoryId: "CCID1011",
      },
      {
        TermsBodyId: "TBID1012",
        TermsSectionId: "TSID101",
        Order: 2,
        Body: "1.2 To the extent the engagement is extended or new engagements are submitted, these general terms and conditions shall apply irrespective of whether the terms and conditions once again have been sent to you or not.",
        ContentCategoryId: "CCID1012",
      },
    ],
  },
  {
    TermsSectionId: "TSID102",
    Title: "Partnerships",
    ContentCategoryId: "CCID102",
    Order: 2,
    Bodies: [
      {
        TermsBodyId: "TBID1021",
        TermsSectionId: "TSID102",
        Order: 1,
        Body: "We respect the privacy of our users.",
        ContentCategoryId: "CCID1021",
      },
      {
        TermsBodyId: "TBID1022",
        TermsSectionId: "TSID102",
        Order: 2,
        Body: "We do not share personal data with third parties.",
        ContentCategoryId: "CCID1022",
      },
    ],
  },
  {
    TermsSectionId: "TSID103",
    Title: "Section name",
    ContentCategoryId: "CCID103",
    Order: 1,
    Bodies: [
      {
        TermsBodyId: "TBID1031",
        TermsSectionId: "TSID103",
        Order: 1,
        Body: "1.1 These general terms and conditions apply to the services provided to clients by Croatia Bank (individually and jointly ”Croatia”, ”we”, ”us” or ”our”). By engaging Croatia, you are deemed to have accepted these terms and conditions which, in addition to our engagement letter, therefore shall be regarded as contractual content between you and Croatia.",
        ContentCategoryId: "CCID1011",
      },
      {
        TermsBodyId: "TBID1032",
        TermsSectionId: "TSID103",
        Order: 2,
        Body: "1.2 To the extent the engagement is extended or new engagements are submitted, these general terms and conditions shall apply irrespective of whether the terms and conditions once again have been sent to you or not.",
        ContentCategoryId: "CCID1012",
      },
    ],
  },
];

export const USER_WITH_ALL_IN_CARD = "1000002357";
export const USER_WITHOUT_ALL_IN_CARD = "1000001102";
export const USER_WITH_INACTIVE_ALL_IN_CARD = "0000002270";
