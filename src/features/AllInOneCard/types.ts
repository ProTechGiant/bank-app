import { ImageSourcePropType } from "react-native";

import { Theme } from "@/theme";

export interface RewardsMethods {
  Id: number;
  Name: string;
  Description: string;
}
export interface RewardsMethodsResponse {
  RewardsMethods: RewardsMethods[];
}

export interface PaymentOption {
  Id: number;
  Name: string;
  Description: string;
  isRecommended?: boolean;
  discount?: number;
}

export enum Screens {
  ProductSelection,
  Redemption,
  PaymentType,
  OrderReview,
}

export interface AllInOneCardContextState {
  productId?: string;
  cardStatus?: "ACTIVATED" | "INACTIVE";
  paymentPlan?: string;
  paymentPlanId?: string;
  redemptionMethod?: string;
  redemptionMethodId?: string;
  cardType?: "nera" | "neraPlus";
  setContextState: (newState: Partial<AllInOneCardContextState>) => void;
  resetState: () => void;
  setScreen: (screen: Screens) => void;
  physicalCardStatus: boolean;
}
export interface TransactionItem {
  TransactionId: string;
  TransactionDate: string;
  PostDate?: string;
  Currency: string;
  DebitCreditFlag?: string;
  TransactionDescription?: string;
  TransactionReferenceNumber: string;
  Amount: string;
  SourceCurrency?: string;
  SourceAmount?: string;
  AuthCode: string;
  MerchantId?: string;
  MerchantCategoryCode?: string;
  MerchantCategoryGroup?: string;
  MerchantName: string;
  MerchantAddress?: string;
  MerchantCity?: string;
  MerchantCountry?: string;
  TransactionCode?: string;
  Location: string;
  TransactionType: string;
}
export interface TransactionResponse {
  CardTransactions: TransactionItem[];
}
export interface Benefit {
  title: string;
  subTitle: string;
  iconUrl: string;
}

export interface CardData {
  cardType: CardTypes;
  benefits: Benefit[];
  yearlyFee?: number;
  monthlyFee?: number;
}

export interface neraData {
  icon: JSX.Element;
  title: string;
  description: string;
}

export interface CardReview {
  cardDetails: {
    type: string;
    rewardMethod: string;
  };
  currencies: {
    freeCurrencies: string;
    description: string;
  };
  benefits: {
    description: string;
    note: string;
    icons: ImageSourcePropType[]; // Assuming these are React components
  };
  payment: {
    subscriptionType: "monthly" | "yearly";
    subscription: {
      monthly: {
        duration: string;
        charges: string;
      };
      yearly: {
        duration: string;
        charges: string;
      };
    };
    vat: string;
    total: string;
  };
}

export type TransactionDetailsNavigationParams = {
  screen: "AllInOneCard.TransactionDetailsScreen";
  params: {
    transactionDetails: TransactionItem;
  };
};

export interface TransactionType {
  id: number;
  label: string;
  checked: boolean;
}

export interface CurrencyType {
  id: number;
  currencyData: {
    currency: string;
    value: string;
    country: string;
    icon: JSX.Element;
  };
  checked: boolean;
}
export interface CardControlOptionType {
  id: number;
  title: string;
  description: string;
  isToggled: boolean;
}

export interface visaDetails {
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  userName: string;
}
export interface Rewards {
  id: string;
  date: string;
  value: string;
}
export enum CardTypes {
  NERA = "nera",
  NERA_PLUS = "neraPlus",
}

export interface FeesResponse {
  FeesAmount: string;
  VatAmount: string;
  TotalAmount: string;
}
export interface CardIssuanceParams {
  CustomerId: string;
  CardHolderName: string;
  CardType: string; // Should only be 'All-in-one card' as per your description
  CardProductCode: string;
  CardHolderTitle?: string;
  VirtualCardIndicator: "P" | "V";
  Currency?: string;
  ExpiryDate?: string;
  WalletList?: string;
  PaymentPlanId?: string;
  RedeemptionMethodId?: string;
  FeesAmount?: string;
  VatAmount?: string;
  TotalAmount?: string;
}

export interface CardIssuanceResponse {
  OtpId: string;
}

export interface ProductInfo {
  ProductName: string;
  ProductCode: string;
  ProductDescription?: string;
}

export interface ProductsResponse {
  CardTypeCode: string;
  ProductList?: {
    ProductCodesList: ProductInfo[];
  };
}

export interface ContentCardType {
  ContentId: string;
  ContentCategoryId: string;
  ContentTag: string;
  ContentPublishDateTime?: string; // Optional because not all objects have this property
  Title: string;
  SubTitle: string;
  ContentDescription?: string; // Optional because not all objects have this property
  Media: {
    SourceFileName: string;
    SourceFileURL: string;
  }[];
  WhatsNextCategoryId?: string; // Optional because not all objects have this property
  WhatsNextTypeId?: string; // Optional because not all objects have this property
  ReadDuration?: number;
  AuthorSocialMedia: Record<string, any>; // Assuming it can have any key-value pairs
  EventDetails: {
    Price: number;
  };
}

export interface Restriction {
  RestrictionType: string;
  RestrictionFlag: boolean;
  RestrictionDescription: string;
  RestrictionDisplayName: string;
}
export interface CardRestrictions {
  Restrictions: Restriction[];
}
export interface EditControlSettings {
  ContactlessPayments?: boolean;
  OnlinePayments?: boolean;
  AtmWithdrawals?: boolean;
  POSPayments?: boolean;
}
interface Balance {
  Type: string;
  Currency: string;
  Amount: string;
}

export interface CardInformation {
  CustomerId: string;
  CardIdentifierId: string;
  CardIdentifierType: string;
  CardExpiryDate: string;
  CardHolderName: string;
  AccountNumber: string;
  Balances: Balance[];
}
export interface RewardTypeSwitchRequest {
  AccountNumber: string;
  RewardType: string;
}
export interface CurrenciesType {
  CurrencyID: string;
  CurrencyCode?: string;
  CurrencyName?: string;
  CurrencyLogo?: string;
  CurrencySymbol?: string;
  CurrencyBalance?: string;
}
export interface CurrencySummaryResponse {
  CurrenciesCount: number; // Currencies Count
  DeletedCurrenciesCount: number; // Deleted Currencies Count
  AvailableCurrenciesCount: number; // Available Currencies Count
  CurrenciesList?: CurrenciesType[]; // List of Cities, nullable
}

export interface CurrencyRequest {
  CurrenciesList: CurrenciesType[];
}

export interface CardTransactionQuery {
  // Card Identifier Information
  CardIdentifierId: string; // Card External Id
  CardIdentifierType: string; // Value EXID
  // Query Parameters
  FromDate?: string; // Optional, From Date
  ToDate?: string; // Optional, To Date
  TransactionType?: string; // Optional, Type of transaction
  Currency?: string; // Optional, Code of currency
  NoOfTransaction?: number; // Optional, Number of transactions requested
  ReturnMCCGroup?: string; // Optional, Flag to return MCC group (True/False)
}
export interface FreezeCardResponse {
  CardIdType: string;
  CardId: string;
  Status: string;
}

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

//card detail

export interface CardDetailResponse {
  Cards: Card[];
}

export interface Card {
  CardDetails: CardDetails;
  Transaction: Transaction[];
}

export interface CardDetails {
  CardId: string;
  CardType: string;
  ProductId: string;
  Status: string;
  AccountNumber: string;
  RedemptionMethod: string;
  PhysicalCardFlag: string;
  AppleWalletFlag: string;
}

export interface Transaction {
  TransactionId: string;
  TransactionDate: string;
  PostDate: string;
  Currency: string;
  DebitCreditFlag: string;
  TransactionDescription: string;
  TransactionReferenceNumber: string;
  Amount: string;
  AuthCode: string;
  MerchantName: string;
  TransactionType: string;
}

// for get cities api

export interface CitiesResponse {
  CitiesList: CitiesList[];
}

export interface CitiesList {
  CityCode: string;
  CityName: string;
  CountryCode: string;
}
export interface Address {
  BuildingNumber: string;
  Street?: string;
  District: string;
  City?: string;
  PostalCode?: string;
  Country?: string;
}
// pin change api request
export interface AIOPinChangeRequest {
  CardIdType: string;
  CardId: string;
  Reason: string;
}

export interface AIOPinChangeResponse {
  OtpId: string;
}

export interface AddCurrenciesRequest {
  CardId: string; // Card External Id
  CardIdType: "EXID"; // Allowed values are: EXID
  Reason: "Add Currency"; // Allowed values - Add Currency
  CurrenciesList: string[]; // List of Currencies
  NoOfAllCurrencies: number; // NoOfAllCurrencies
  NoOfFreeCurrencies: number; // NoOfFreeCurrencies
  NoOfPaidCurrencies: number; // NoOfPaidCurrencies
  Fees: string; // Amount without vat
  Vat: string; // Vat amount
  TotalAmount: string; // Total amount
}

export interface AddCurrenciesResponse {
  CardId: string;
  IsOtpRequired?: boolean;
  OtpId?: string;
}
export interface PricePlan {
  Code: string;
  ArabicName: string;
  englishName: string; // Consider renaming this to EnglishName to follow the naming convention
  PricePlanTypeId: number;
  PricePlanUomId: number;
  PaymentTypeId: number;
  IsAllowedDiscount: number; // This could also be boolean if it represents a true/false value
  HasChargeValue: number; // This could also be boolean if it represents a true/false value
  ChargeValue: number;
  DownPayment: number;
  Fees: number;
  Id: number;
}

export interface PricePlansResponse {
  PricePlans: PricePlan[];
}

export type LocationState = {
  shouldUpdateMarker: boolean;
  location: Location;
};

export type Account = {
  ID: number;
  Logo: ImageSourcePropType;
  AccountNumber: string;
  Name: string;
  Amount: string;
};
export interface Reason {
  Code: string;
  Name: string;
  Description: string;
}
export interface PermanentCardReasonsResponse {
  ReasonsList: Reason[];
}

export interface defaultStyleForCard {
  cardWidth?: number;
  cardHeight?: number;
  sizeWords?: keyof Theme["typography"]["text"]["sizes"];
  logoWidth?: number;
  logoHeight?: number;
  visaWidth?: number;
  visaHeight?: number;
}
// rewards cashback repsonse

export interface RewardsCashBackResponse {
  CardEXID: string;
  CashbackSummary: CashbackSummary;
}

export interface CashbackSummary {
  MonthlyHistory: MonthlyHistory[];
  LastMonth: string;
}

export interface MonthlyHistory {
  Month: string;
  Amount: string;
  Currency: string;
  Year: string;
}

//order AIO physical card

export interface PhysicalCardIssuanceRequest {
  CardId: string;
  CardIdType: "EXID";
  ActionType: "ReissAsNew" | "Reissue";
  Reason: string;
  Fees: string;
  Vat: string;
  TotalAmount: string;
}
export interface PhysicalCardIssuanceResponse {
  CardId: string;
  IsOtpRequired: boolean;
  OtpId: string;
}
export interface CardDeliveryDetails {
  CustomerId: string;
  CardExId: string;
  CardHolderName: string;
  CardType: "PREPAID" | "CREDIT" | "DEBIT";
  DeliveryAddressOne: string;
  DeliveryAddressTwo?: string;
  DeliveryCity: string;
  DeliveryCountry: string;
  DeliveryEmail?: string;
  DeliveryMobileNumber?: string;
}

export interface FeatureFeeResponse {
  FeesAmount: string;
  VatAmount: string;
  TotalAmount: string;
}

// Card close reasons

export interface ReasonsResponse {
  ReasonsList: ReasonsList[];
}

export interface ReasonsList {
  Code: string;
  Name: string;
  Description: string;
}
