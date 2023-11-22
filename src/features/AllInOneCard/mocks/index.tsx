import { AllCurrenciesIcon, NetflixIcon } from "../assets/icons";
import { SaudiRiyalIcon } from "../assets/icons";
import EmiratesDirhamIcon from "../assets/icons/EmiratesDirhamIcon";
import egypt from "../assets/images/egypt.png";
import EURO from "../assets/images/EURO.png";
import UK from "../assets/images/UK.png";
import USAFlag from "../assets/images/USAFlag.png";
import {
  AIOPinChangeRequest,
  CardControlOptionType,
  CardData,
  CardIssuanceParams,
  CardReview,
  CurrenciesType,
  TransactionItem,
  visaDetails,
} from "../types";

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
export const mockTransactions: TransactionItem[] = [
  {
    TransactionId: "01",
    MerchantName: "Whole Foods Market",
    TransactionDate: "31 Apr 2023",
    Amount: "-59.67",
    TransactionType: "ATM withdrawal",
    TransactionReferenceNumber: "FT46789e66976",
    Location: "KSA",
    Currency: "AED",
    AuthCode: "56749442",
    TransactionDescription: " 0.03 SAR Cashback",
  },
  {
    TransactionId: "02",
    MerchantName: "Zara",
    TransactionDate: "26 Apr 2023",
    Amount: "-10.00",
    TransactionType: "Internet purchase",
    TransactionReferenceNumber: "FT46789e66976",
    Location: "KSA",
    Currency: "SAR",
    AuthCode: "56749442",
    TransactionDescription: " 0.5 SAR Cashback",
  },
  {
    TransactionId: "03",
    MerchantName: "Top-Up",
    TransactionDate: "20 Apr 2023",
    Amount: "+10.00",
    TransactionType: "Point of sale",
    TransactionReferenceNumber: "FT46789e66976",
    Location: "KSA",
    Currency: "AED",
    AuthCode: "56749442",
  },
  {
    TransactionId: "04",
    MerchantName: "Miles Shopping Center",
    TransactionDate: "17 May 2023",
    Amount: "-100.00",
    TransactionType: "Internet purchase",
    TransactionReferenceNumber: "FT46789e66976",
    Location: "KSA",
    Currency: "SAR",
    AuthCode: "56749442",
    TransactionDescription: "5 Pts",
  },
  {
    TransactionId: "05",
    MerchantName: "Safeway Market",
    TransactionDate: "12 Apr 2023",
    Amount: "-250.45",
    TransactionType: "ATM withdrawal",
    TransactionReferenceNumber: "FT46789e66976",
    Location: "KSA",
    Currency: "AED",
    AuthCode: "56749442",
    TransactionDescription: " 4.5 SAR Cashback",
  },
  {
    TransactionId: "06",
    MerchantName: "Top-Up",
    TransactionDate: "8 Apr 2023",
    Amount: "+120.00",
    TransactionType: "Point of sale",
    TransactionReferenceNumber: "FT46789e66976",
    Location: "KSA",
    Currency: "SAR",
    AuthCode: "56749442",
  },
  {
    TransactionId: "07",
    MerchantName: "Saudi Airlines",
    TransactionDate: "1 Apr 2023",
    Amount: "-200.00",
    TransactionType: "ATM withdrawal",
    TransactionReferenceNumber: "FT46789e66976",
    Location: "KSA",
    Currency: "SAR",
    AuthCode: "56749442",
    TransactionDescription: "8 Pts",
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

const USD = "USD";
const GBP = "GBP";
const EUR = "EUR";
const EGP = "EGP";
const AED = "AED";
const INR = "INR";
const PKR = "PKR";
const BDT = "BDT";
const LKR = "LKR";
const NPR = "NPR";
const PHP = "PHP";

export const defineCurrencies: CurrenciesType[] = [
  {
    id: 1,
    currencyCode: USD,
    currencySymbol: "$",
    currencyImage: USAFlag,
    currencyName: "United States Dollar",
    currencyNameAr: "الدولار الأمريكي",
  },
  {
    id: 2,
    currencyCode: GBP,
    currencySymbol: "£",
    currencyImage: UK,
    currencyName: "British Pound Sterling",
    currencyNameAr: "الجنيه الاسترليني",
  },
  {
    id: 3,
    currencyCode: EUR,
    currencySymbol: "€",
    currencyImage: EURO,
    currencyName: "Euro",
    currencyNameAr: "اليورو",
  },
  {
    id: 4,
    currencyCode: EGP,
    currencySymbol: "£",
    currencyImage: egypt,
    currencyName: "Egyptian Pound",
    currencyNameAr: "الجنيه المصري",
  },
  {
    id: 5,
    currencyCode: AED,
    currencySymbol: "د.إ",
    currencyImage: USAFlag,
    currencyName: "UAEmirates Dirham",
    currencyNameAr: "درهم اماراتي",
  },
  {
    id: 6,
    currencyCode: INR,
    currencySymbol: "₹",
    currencyImage: egypt,
    currencyName: "Indian Rupee",
    currencyNameAr: "الروبية الهندية",
  },
  {
    id: 7,
    currencyCode: PKR,
    currencySymbol: "₨",
    currencyImage: UK,
    currencyName: "Pakistani Rupee",
    currencyNameAr: "الروبية الباكستانية",
  },
  {
    id: 8,
    currencyCode: BDT,
    currencySymbol: "৳",
    currencyImage: USAFlag,
    currencyName: "Bangladeshi Taka",
    currencyNameAr: "تاكا بنغلاديشي",
  },
  {
    id: 9,
    currencyCode: LKR,
    currencySymbol: "₨",
    currencyImage: EURO,
    currencyName: "Sri Lankan Rupee",
    currencyNameAr: "الروبية السريلانكية",
  },
  {
    id: 10,
    currencyCode: NPR,
    currencySymbol: "₨",
    currencyImage: egypt,
    currencyName: "Nepalese Rupee",
    currencyNameAr: "الروبية النيبالية",
  },
  {
    id: 11,
    currencyCode: PHP,
    currencySymbol: "₱",
    currencyImage: UK,
    currencyName: "Philippine Peso",
    currencyNameAr: "البيزو الفلبيني",
  },
];

export const CurrencyConversion: { [key: string]: string } = {
  USD: "1 USD = 3.75 SAR",
  GBP: "1 GBP = 4.69 SAR",
  EUR: "1 EUR = 4.10 SAR",
  EGP: "1 EGP = 0.12 SAR",
  AED: "1 AED = 1.02 SAR",
  INR: "1 INR = 0.045 SAR",
  PKR: "1 PKR = 0.013 SAR",
  BDT: "1 BDT = 0.034 SAR",
  LKR: "1 LKR = 0.011 SAR",
  NPR: "1 NPR = 0.028 SAR",
  PHP: "1 PHP = 0.068 SAR",
};

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

export const mockBarData = [
  { value: 500, label: "Dec" },
  { value: 800, label: "Jan" },
  { value: 500, label: "Feb" },
  { value: 1000, label: "Mar" },
  { value: 400, label: "Apr" },
  { value: 800, label: "May" },
];

export const emptyBarChart = [
  { value: 0, label: "Dec" },
  { value: 0, label: "Jan" },
  { value: 0, label: "Feb" },
  { value: 0, label: "Mar" },
  { value: 0, label: "Apr" },
  { value: 0, label: "May" },
];

export const totalSpending = 863027;

export const mockTransactionType = ["ATM withdrawal", "Internet purchase", "Point of sale"];
export const mockCurrencyType = [
  { currency: "All currencies ", value: "All", country: "show all currencies you have", icon: <AllCurrenciesIcon /> },
  { currency: "Default currency (SAR)", value: "SAR", country: "Saudi Riyal", icon: <SaudiRiyalIcon /> },
  { currency: "AED", value: "AED", country: "United Arab Emirates Dirham", icon: <EmiratesDirhamIcon /> },
];
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

export const mockDefaultAddress = {
  title: "Default address",
  label: "District name",
  value: "Riyadh 11122",
};

//pin change otp genration mock request

export const mockPinChangeRequest: AIOPinChangeRequest = {
  CardIdType: "1",
  CardId: "392c9d73-ab07-4928-a526-1ff110f97dbd",
  Reason: "150",
};
