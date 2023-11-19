import { NetflixIcon } from "../assets/icons";
import egypt from "../assets/images/egypt.png";
import EURO from "../assets/images/EURO.png";
import UK from "../assets/images/UK.png";
import USAFlag from "../assets/images/USAFlag.png";
import { CardControlOptionType, CardData, CardIssuanceParams, CardReview, currenciesType, visaDetails } from "../types";

export const cardData: CardData[] = [
  {
    id: 1,
    title: "nera Plus",
    cardType: "neraPlus",
    isDiamond: true,
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

    freeBenefits: {
      description: " 3 month free subscription.",
      subscriptions: [<NetflixIcon />],
      subscription: [0],
    },
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

export const cardRequestData: CardIssuanceParams = {
  CustomerId: "1000001199",

  CardHolderName: "CardHolderName",

  CardType: "DEBIT",

  CardProductCode: "366_SAR_001",

  CardHolderTitle: "CardHolderTitle",

  VirtualCardIndicator: "V",

  Currency: "Currency",

  ExpiryDate: "2023-12-03T22:27:09",

  WalletList: "WalletList",

  PaymentPlanId: "1",

  RedeemptionMethodId: "1",

  FeesAmount: "2349.99",

  VatAmount: "300",

  TotalAmount: "2600",
};

export const cardType = "neraPlus";
export const DIAL_NUMBER = 1;

export const defineCurrencies: currenciesType[] = [
  {
    id: 1,
    currencyCode: "USD",
    currencySymbol: "$",
    currencyImage: USAFlag,
    currencyName: "United States Dollar",
    currencyNameAr: "الدولار الأمريكي",
  },
  {
    id: 2,
    currencyCode: "GBP",
    currencySymbol: "£",
    currencyImage: UK,
    currencyName: "British Pound Sterling",
    currencyNameAr: "الجنيه الاسترليني",
  },
  {
    id: 3,
    currencyCode: "EUR",
    currencySymbol: "€",
    currencyImage: EURO,
    currencyName: "Euro",
    currencyNameAr: "اليورو",
  },
  {
    id: 4,
    currencyCode: "EGP",
    currencySymbol: "£",
    currencyImage: egypt,
    currencyName: "Egyptian Pound",
    currencyNameAr: "الجنيه المصري",
  },
  {
    id: 5,
    currencyCode: "AED",
    currencySymbol: "د.إ",
    currencyImage: USAFlag,
    currencyName: "UAEmirates Dirham",
    currencyNameAr: "درهم اماراتي",
  },
  {
    id: 6,
    currencyCode: "INR",
    currencySymbol: "₹",
    currencyImage: egypt,
    currencyName: "Indian Rupee",
    currencyNameAr: "الروبية الهندية",
  },
  {
    id: 7,
    currencyCode: "PKR",
    currencySymbol: "₨",
    currencyImage: UK,
    currencyName: "Pakistani Rupee",
    currencyNameAr: "الروبية الباكستانية",
  },
  {
    id: 8,
    currencyCode: "BDT",
    currencySymbol: "৳",
    currencyImage: USAFlag,
    currencyName: "Bangladeshi Taka",
    currencyNameAr: "تاكا بنغلاديشي",
  },
  {
    id: 9,
    currencyCode: "LKR",
    currencySymbol: "₨",
    currencyImage: EURO,
    currencyName: "Sri Lankan Rupee",
    currencyNameAr: "الروبية السريلانكية",
  },
  {
    id: 10,
    currencyCode: "NPR",
    currencySymbol: "₨",
    currencyImage: egypt,
    currencyName: "Nepalese Rupee",
    currencyNameAr: "الروبية النيبالية",
  },
  {
    id: 11,
    currencyCode: "PHP",
    currencySymbol: "₱",
    currencyImage: UK,
    currencyName: "Philippine Peso",
    currencyNameAr: "البيزو الفلبيني",
  },
];

export const cardControlOptions: CardControlOptionType[] = [
  {
    id: 1,
    title: "Online transaction",
    description: "allow any transaction conducted over the internet",
    isToggled: false,
  },
  {
    id: 2,
    title: "ATM withdrawal",
    description: "allow any use of ATM withdraw or deposit money",
    isToggled: false,
  },
  {
    id: 3,
    title: "Point of sale transaction",
    description: "allow payment made at cashier counters in the stores",
    isToggled: false,
  },
  {
    id: 4,
    title: "Contactless",
    description: "allow payments by phone or card without swiping the card, For Example: Apple pay / Mada pay",
    isToggled: false,
  },
];

export const visaCardData: visaDetails = {
  cardNumber: "5678567856785678",
  expMonth: "11",
  expYear: "28",
  cvv: "321",
  userName: "Ahmad A AL SAEED",
};

export const USER_WITH_ALL_IN_CARD = "1000002357";
export const USER_WITHOUT_ALL_IN_CARD = "1000001102";
export const USER_WITH_INACTIVE_ALL_IN_CARD = "0000002270";
export const USER_WITH_ZERO_BALANCE = "1000003001";

export const mockSettings = [
  "Change Card PIN",
  "Order Physical Card",
  "Statements",
  "Card Close & Replacement",
  "Add to Apple Wallet",
  "Permanent Card Closure",
  "FAQs",
];
export const passcode = "1111";
