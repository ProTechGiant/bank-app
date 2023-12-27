import { Address } from "@/types/CustomerProfile";

import { AllCurrenciesIcon } from "../assets/icons";
import { SaudiRiyalIcon } from "../assets/icons";
import EmiratesDirhamIcon from "../assets/icons/EmiratesDirhamIcon";
import {
  AddCurrenciesRequest,
  AIOPinChangeRequest,
  CardIssuanceParams,
  CardReview,
  Location,
  TransactionItem,
  visaDetails,
} from "../types";
import amazonImage from "./../assets/images/amazon.png";
import AnghamiLogo from "./../assets/images/anghamilogo.png";
import appleImage from "./../assets/images/apple.png";
import netflixImage from "./../assets/images/netflix.png";
import playStorImage from "./../assets/images/playStore.png";
import shahedImage from "./../assets/images/shahed.png";

export const neraPlusCardBenefits = [shahedImage, AnghamiLogo];
export const neraCardBenefits = [shahedImage];

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

  PaymentPlanCode: "AIOMonthly",

  RedeemptionMethodId: "1",

  FeesAmount: "200.0",

  VatAmount: "300",

  TotalAmount: "2600",
};

export const cardType = "neraPlus";
export const DIAL_NUMBER = 1;

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
  JOD: "1 JOD = 5.29 SAR",
  KWD: "1 KWD = 12.16 SAR",
  MAD: "1 MAD = 0.37 SAR",
  TRY: "1 TRY = 0.13 SAR",
  TND: "1 TND = 1.21 SAR",
  OMR: "1 OMR = 9.74 SAR",
  AUD: "1 AUD = 2.49 SAR",
  CAD: "1 CAD = 2.76 SAR",
  CNY: "1 CNY = 0.53 SAR",
  DKK: "1 DKK = 0.55 SAR",
  HKD: "1 HKD = 0.48 SAR",
  IDR: "1 IDR = 0.00024 SAR",
  JPY: "1 JPY = 0.025 SAR",
  KES: "1 KES = 0.024 SAR",
  NZD: "1 NZD = 2.31 SAR",
  NOK: "1 NOK = 0.35 SAR",
  QAR: "1 QAR = 1.03 SAR",
  ZAR: "1 ZAR = 0.20 SAR",
  KRW: "1 KRW = 0.0029 SAR",
  SEK: "1 SEK = 0.36 SAR",
  CHF: "1 CHF = 4.28 SAR",
  THB: "1 THB = 0.11 SAR",
  SAR: "1 SAR = 1 SAR",
};

export const visaCardData: visaDetails = {
  cardNumber: "5678567856785678",
  expMonth: "11",
  expYear: "28",
  cvv: "321",
  userName: "Ahmad A AL SAEED",
};

export const USER_WITH_ALL_IN_CARD = "1000002357";
export const USER_WITH_ALL_IN_CARD_2 = "1000002357"; //1000001199 can be used to mock user to see AIO card dahsboard by default on cards tab
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

export const numberOfDays = 5;

export const mockDefaultAddress: Address = {
  IsPrimary: true,
  AddressType: 4,
  BuildingNumber: "1",
  StreetName: "Street name",
  District: "At Taawun",
  CityCode: "Riyadh",
  Postcode: "11122",
  CountryCode: "Saudi Arabia",
  CustomerAddressGuid: "00000000-0000-0000-0000-000000000000",
  UnitNumber: "1",
};

//pin change otp genration mock request
export const mockPinChangeRequest: AIOPinChangeRequest = {
  CardIdType: "1",
  CardId: "392c9d73-ab07-4928-a526-1ff110f97dbd",
  Reason: "150",
};

export const AddCurrenciesMockRequest: AddCurrenciesRequest = {
  CardId: "43e1da79-8e63-4a55-b87d-3871bb9e9dca",
  CardIdType: "EXID",
  Reason: "Add Currency",
  CurrenciesList: ["AEA", "EGP", "USD"],
  NoOfAllCurrencies: 3,
  NoOfFreeCurrencies: 2,
  NoOfPaidCurrencies: 1,
  Fees: "0.00",
  Vat: "0.00",
  TotalAmount: "0.00",
};

export const mockLocations: Location[] = [
  {
    name: "Al Takhassousi, Al Mutamarat,Riyadh ,12711,Riyadh  ,Saudi Arabia",
    latitude: 24.662963,
    longitude: 46.6864334,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  {
    name: "Al Fath,,,42312,Madinah,, Saudi Arabia",
    latitude: 24.4786543,
    longitude: 39.5844179,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  {
    name: "SULAIMAN AL ADWANI, Irqah,,12522,Riyadh , Saudi Arabia,",
    latitude: 24.7014542,
    longitude: 46.6093275,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  {
    name: " Umm Al Hamam St, Umm Al Hamam Al Gharbi,,12325,Riyadh, Saudi Arabia,",
    latitude: 24.7014542,
    longitude: 46.6093275,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  {
    name: "Al Olaya, ,,12331,Riyadh, Saudi Arabia",
    latitude: 24.7062928,
    longitude: 46.6559261,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  {
    name: "7013 At Takhassusi Branch St, Ar Rahmaniyyah,12341,,Riyadh, Saudi Arabia",
    latitude: 24.716157,
    longitude: 46.6491716,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
];

export const sourceAndDestinationAccounts = [
  {
    ID: 0,
    Logo: require("../assets/images/DebitCardImage.png"),
    AccountNumber: "23342334",
    Name: "Current account",
    Balance: "23.400",
    CurrencyCode: "SAR",
  },
  {
    ID: 1,
    Logo: require("../assets/images/BankCardImage.png"),
    AccountNumber: "23342334",
    Name: "Default currency (SAR)",
    Balance: "123.87",
    CurrencyCode: "SAR",
  },
];

export const fakeCardNumber = "4567";
export const pendingTransactionsRejectionReason = false;
export const remainingBalanceRejectionReason = false;
export const feesNotPaidRejectionReason = false;

const mockCurrencies = [
  {
    CurrencyBalance: "774",
    CurrencyCode: "USD",
    CurrencyID: "4",
    CurrencyLogo: "https://webcmssc.npnbank.local/sitecore/-/media/Images/Flags/United_States_of_America",
    CurrencyName: "United States dollar",
    CurrencySymbol: "$",
  },
  {
    CurrencyBalance: "89",
    CurrencyCode: "EGP",
    CurrencyID: "1",
    CurrencyLogo: "https://webcmssc.npnbank.local/sitecore/-/media/Images/Flags/Egypt",
    CurrencyName: "Egyptian pound",
    CurrencySymbol: "E£",
  },
  {
    CurrencyBalance: "1000",
    CurrencyCode: "SAR",
    CurrencyID: "2",
    CurrencyLogo: "https://webcmssc.npnbank.local/sitecore/-/media/Images/Flags/Saudi_Arabia",
    CurrencyName: "Saudi riyal",
    CurrencySymbol: "SAR",
  },
  {
    CurrencyBalance: "8877",
    CurrencyCode: "AED",
    CurrencyID: "3",
    CurrencyLogo: "https://webcmssc.npnbank.local/sitecore/-/media/Images/Flags/United_Arab_Emirates",
    CurrencyName: "United Arab Emirates dirham",
    CurrencySymbol: "AED",
  },
];

export const Currencies = mockCurrencies.map(currency => ({
  ID: currency.CurrencyID,
  Logo: currency.CurrencyLogo,
  Name: currency.CurrencyName,
  Balance: currency.CurrencyBalance,
  CurrencyCode: currency.CurrencyCode,
}));
