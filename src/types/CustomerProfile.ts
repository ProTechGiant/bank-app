export interface FetchCustomerProfileInterface {
  FullName: string;
  FirstName: string;
  FatherName: string;
  GrandFatherName: string;
  FamilyName: string;
  ARBCic: string;
  Gender: number;
  NationalityCode: string;
  CustomerStatus: number;
  CustomerStatusDescription: string;
  CustomerSource: number;
  MobilePhone: string;
  Email: string;
  PlaceOfBirthCode: string;
  PlaceOfBirth: string;
  Dob: string;
  DobHijri: string;
  PreferredLang: number;
  Language: string;
  IssueLocation: string;
  AssuranceLevel: string;
  IdVersionNumber: string;
  SocialStatus: number;
  FinancialInformation: FinancialInformation;
  CustomerAddress: CustomerAddress;
  ReferralCode: string;
  CustomerTier: number;
  CivilianIDType: number;
  CivilianID: string;
  IssueDate: string;
  CivilianIDExpiryDate: string;
  IssueDateHijri: string;
  ExpiryDateHijri: string;
  FailedKyc: boolean;
  RM: RM;
  OnboardingDate: string;
  TermsandConditions: TermsandConditions;
  ForeignTaxResidency: ForeignTaxResidency;
  Mnemonic: string;
  CustomerId: string;
  ExpireSoon: boolean;
}

interface ForeignTaxResidency {
  ForeignTaxResidencyFlag: boolean;
  ForeignTaxResidencyGuid: string;
  ForeignTaxCountry: ForeignTaxCountry[];
}

interface ForeignTaxCountry {
  CountryName: string;
  TaxReferenceNumber: string;
}

interface TermsandConditions {
  TermsAndConditionsFlag: boolean;
  DeclarationsFlag: boolean;
  DeclarationsVersionNumber: string;
  TermsAndConditionsGuid: string;
}

interface RM {
  Name: string;
  Id: string;
}

interface CustomerAddress {
  Address: Address[];
}

export interface Address {
  StreetName: string;
  CityCode: string;
  CountryCode: string;
  Postcode: string;
  District: string;
  UnitNumber: string;
  IsPrimary: boolean;
  BuildingNumber: string;
  AddressType: number;
  CustomerAddressGuid: string;
}

interface FinancialInformation {
  SourceOfIncome: string;
  MonthlyLimit: string;
  AccountPurpose: string;
  OccupationCode: string;
}
