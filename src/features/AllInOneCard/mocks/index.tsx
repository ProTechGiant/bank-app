import { AllCurrenciesIcon } from "../assets/icons";
import { SaudiRiyalIcon } from "../assets/icons";
import EmiratesDirhamIcon from "../assets/icons/EmiratesDirhamIcon";
import egypt from "../assets/images/egypt.png";
import EURO from "../assets/images/EURO.png";
import UK from "../assets/images/UK.png";
import USAFlag from "../assets/images/USAFlag.png";
import {
  AIOPinChangeRequest,
  CardIssuanceParams,
  CardReview,
  CurrenciesType,
  TransactionItem,
  visaDetails,
} from "../types";
import amazonImage from "./../assets/images/amazon.png";
import appleImage from "./../assets/images/apple.png";
import netflixImage from "./../assets/images/netflix.png";
import playStorImage from "./../assets/images/playStore.png";
import shahedImage from "./../assets/images/shahed.png";

export const neraPlusCardBenefits = [appleImage, netflixImage, shahedImage, amazonImage, playStorImage];
export const neraCardBenefits = [shahedImage];

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
    icons: [appleImage, netflixImage, shahedImage, amazonImage, playStorImage],
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

  Currency: "Sar",

  ExpiryDate: "2023-12-03T22:27:09",

  WalletList: "WalletList",

  PaymentPlanId: "21",

  RedeemptionMethodId: "1",

  FeesAmount: "200.0",

  VatAmount: "300",

  TotalAmount: "2600",
};

export const cardType = "neraPlus";
export const DIAL_NUMBER = 1;

export const defineCurrencies: CurrenciesType[] = [
  {
    CurrencyID: "1",
    CurrencyName: "United States Dollar",
    CurrencyCode: "USD",
    currencySymbol: "$",
    CurrencyLogo: USAFlag,
  },
  {
    CurrencyID: "2",
    CurrencyName: "British Pound Sterling",
    CurrencyCode: "GBP",
    currencySymbol: "£",
    CurrencyLogo: UK,
  },
  {
    CurrencyID: "3",
    CurrencyName: "Euro",
    CurrencyCode: "EUR",
    currencySymbol: "€",
    CurrencyLogo: EURO,
  },
  {
    CurrencyID: "4",
    CurrencyName: "Egyptian Pound",
    CurrencyCode: "EGP",
    currencySymbol: "£",
    CurrencyLogo: egypt,
  },
  {
    CurrencyID: "5",
    CurrencyName: "UAEmirates Dirham",
    CurrencyCode: "AED",
    currencySymbol: "د.إ",
    CurrencyLogo: USAFlag,
  },
  {
    CurrencyID: "6",
    CurrencyName: "Indian Rupee",
    CurrencyCode: "INR",
    currencySymbol: "₹",
    CurrencyLogo: USAFlag,
  },
  { CurrencyID: "7", CurrencyName: "Pakistani Rupee", CurrencyCode: "PKR", currencySymbol: "₨", CurrencyLogo: egypt },
  {
    CurrencyID: "8",
    CurrencyName: "Bangladeshi Taka",
    CurrencyCode: "BDT",
    currencySymbol: "৳",
    CurrencyLogo: EURO,
  },
  {
    CurrencyID: "9",
    CurrencyName: "Sri Lankan Rupee",
    CurrencyCode: "LKR",
    currencySymbol: "₨",
    CurrencyLogo: USAFlag,
  },
  {
    CurrencyID: "10",
    CurrencyName: "Nepalese Rupee",
    CurrencyCode: "NPR",
    currencySymbol: "₨",
    CurrencyLogo: egypt,
  },
  {
    CurrencyID: "11",
    CurrencyName: "Philippine Peso",
    CurrencyCode: "PHP",
    currencySymbol: "₱",
    CurrencyLogo: EURO,
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

export const visaCardData: visaDetails = {
  cardNumber: "5678567856785678",
  expMonth: "11",
  expYear: "28",
  cvv: "321",
  userName: "Ahmad A AL SAEED",
};

export const USER_WITH_ALL_IN_CARD = "1000002357";
export const USER_WITH_ALL_IN_CARD_2 = "1000001199";
export const USER_WITHOUT_ALL_IN_CARD = "1000001102";
export const USER_WITH_INACTIVE_ALL_IN_CARD = "0000002270";
export const USER_WITH_NERA_PLUS_CARD = "1000003001";

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

export const passcode = "1111";

export const mockAddressDetails = {
  name: "Ibrahim Khan",
  buildingNumber: "At Taawun",
  district: " Riyadh 12475",
  country: " Saudi Arabia",
};

export const feesAndVat = 20;
export const totalAmount = 20;
export const numberOfDays = 5;

export const mockDefaultAddress = {
  BuildingNumber: "Default address",
  Street: "Street name",
  District: "At Taawun",
  City: "Riyadh",
  PostalCode: "11122",
  Country: "Saudi Arabia",
};

//pin change otp genration mock request
export const mockPinChangeRequest: AIOPinChangeRequest = {
  CardIdType: "1",
  CardId: "392c9d73-ab07-4928-a526-1ff110f97dbd",
  Reason: "150",
};

export const selectedAddress = {
  BuildingNumber: "Bank Ar-Rajhi ",
  District: "Al muruj",
  Street: "Street name",
  City: "Riyadh",
  PostalCode: "11122",
  Country: "Saudi Arabia",
};
