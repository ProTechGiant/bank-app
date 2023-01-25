export default interface NafathDetails {
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
