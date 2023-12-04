import { AlertVariantType } from "@/components/Alert";

import { UploadDocumentStatus } from "./constants";

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
  Profession: string;
  Sector?: string;
  OccupationCode?: string;
  CompanyName?: string;
  MainIncome: string;
  MonthlyLimit: string;
  MonthlyDebitCreditAmount: string;
  AdditionalIncomeFlag?: boolean;
  AdditionalIncomeType?: string;
  AdditionalIncomeAmount?: string;
}

export interface OccupationalInfo {
  Profession?: string;
  Sector?: string;
  Occupation?: string;
  CompanyName?: string;
}

export interface IncomeSpendingDetails {
  MainIncomeType?: string;
  MonthlyLimit?: string;
  MonthlyDebitAndCreditAmount?: string;
  AdditionalIncomeType?: string;
  AdditionalIncomeAmount?: string;
}

export interface FobEligibilityRequest {
  NationalId: string;
  MobileNumber: string;
  IdType: number;
  EchoList?: {
    Name: string;
    Value: string;
  }[];
}

export interface RegistrationResponse {
  AuthUserId: string;
  AccessToken: string;
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

export type Status = "NEW" | "COMPLETED" | "PENDING" | "DECLINED" | "HIGH_RISK";

export interface CustomersTermsAndConditions {
  TermsID: string;
  TermsSections: TermsSection[];
  ContentCategoryId: string;
}

export interface TermsSection {
  TermsSectionId: string;
  Title: string;
  Bodies: Body[];
  ContentCategoryId: string;
  Order: number;
}

export interface Body {
  TermsBodyId: string;
  TermsSectionId: string;
  Order: number;
  Body: string;
  ContentCategoryId: string;
}

export interface FobEligibilityResponse {
  IsFOBEligibile: boolean;
  IsSameMobileNumber: boolean;
  ArbMobileNumber: string;
}
export interface RetrieveUploadDocumentsListInterface {
  CaseNumber: string;
  Status: string;
  ClassificationCode: string;
  RequiredDocuments: RequiredDocumentInterface[];
}

export interface CheckHighRiskInterface {
  HighRiskCustomerFlag: boolean;
}

export interface RequiredDocumentInterface {
  DocumentGuid: string;
  AnnotationGuid: string;
  DocumentStatus: UploadDocumentStatus;
  Reason: string;
  Name: string;
  NameAr: string;
  DescriptionEn: string;
  DescriptionAr: string;
}

export interface UploadDocumentHighRiskRequestInterface {
  DocumentGuid: string;
  AnnotationGuid: string;
  DocumentBodyBase64String: string;
  DocumentType: string;
  DocumentName: string;
}

export interface UploadDocumentHighRiskResponseInterface {
  AnnotationId: string;
}
export interface DownloadHighRiskDocumentResponse {
  DocumentBodyBase64String: string;
  DocumentType: string;
  DocumentName: string;
}

export interface SendOnboardingOtpResponse {
  OneTimePassword: {
    Length: number;
    TimeToLive: number;
    AllowedAttempts: number;
  };
}

export interface ListItemType {
  label: string;
  value: string;
}
