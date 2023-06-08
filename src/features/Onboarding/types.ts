import { AlertVariantType } from "@/components/Alert";

export interface NafathDetails {
  CustomerId?: string;
  CustomerType?: string;
  ExistingCustomerFlag?: string;
  EnglishName?: string;
  EnglishFirstName?: string;
  EnglishFatherName?: string;
  englishGrandFatherName?: string;
  EnglishFamilyName?: string;
  ArabicName?: string;
  ArabicFirstName?: string;
  ArabicFatherName?: string;
  arabicGrandFatherName?: string;
  ArabicFamilyName?: string;
  Gender?: string;
  Dob?: string;
  PlaceOfBirthCode?: string;
  DobHijri?: string;
  Lang?: string;
  Iss?: string;
  SponsorName?: string;
  CardIssueDateGregorian?: string;
  CardIssueDateHijri?: string;
  Iat?: string;
  IssueLocationAr?: string;
  IssueLocationEn?: string;
  Aud?: string;
  Nbf?: string;
  NationalId?: string;
  MobileNumber?: string;
  SocialStatusCode?: string;
  NationalityCode?: string;
  Nationality?: string;
  ArabicNationality?: string;
  PassportNumber?: string;
  IqamaExpiryDateHijri?: string;
  IqamaExpiryDateGregorian?: string;
  IdExpiryDateHijri?: string;
  IdExpiryDateGregorian?: string;
  Exp?: string;
  Addresses?: [
    {
      StreetName?: string;
      City?: string;
      District?: string;
      UnitNumber?: string;
      BuildingNumber?: string;
      PostCode?: string;
      LocationCoordinates?: string;
    }
  ];
}

export interface ForeignTaxCountry {
  CountryName: string;
  TaxReferenceNumber: string;
}

export interface FatcaFormInput {
  ForeignTaxResidencyFlag: boolean | null;
  ForeignTaxCountry: Array<ForeignTaxCountry>;
}

export interface FinancialDetails {
  OccupationCode?: string;
  AccountPurpose: string;
  SourceOfIncome: string;
  MonthlyLimit: string;
}

export interface ErrorMessageType {
  message: string | JSX.Element;
  variant: AlertVariantType;
  link?: string;
}

export interface IqamaInputs {
  MobileNumber: string;
  NationalId: string;
}

export interface CustomerPendingAction {
  ActionId: string;
  ActionTypeId: string;
  DueDate: string;
  Description: string;
  Persistent: boolean;
  ServiceId: string;
  MessageId: string;
  MessageText: string;
  RedirectDestinationLink: string;
  UpdatedBy: string;
}

export type StatusId = 1 | 2 | 3;

export type Status = "COMPLETED" | "PENDING" | "DECLINED";
