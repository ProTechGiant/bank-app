export interface PushConsentBodyRequest {
  ConsentId: string;
  DecisionId: number;
  Accounts: Account[];
  Cards: Card[];
}

interface Account {
  Id: number;
  Type: string;
}

interface Card {
  AccountNumber: string;
  Type: string;
}

export interface ConsentDataResponse {
  ConsentId: string;
  TPPInfo: {
    TPPNameEnglish: string;
    TPPNameArabic: string;
    TPPLogo: string;
  };
  Purpose: Array<{
    DescriptionEnglish: string;
    DescriptionArabic: string;
  }>;
  DataGroupsList: Array<{
    DataGroupNameEnglish: string;
    DataGroupNameArabic: string;
    PermissionsList: Array<{
      PermissionDescriptionEnglish: string;
      PermissionDescriptionArabic: string;
    }>;
  }>;
  CreationDateTime: string;
  ExpirationDateTime: string;
  Accounts: Array<{
    Id: string;
    Type: string;
    MaskedNumber?: string;
  }>;
  Cards: Array<{
    AccountNumber: string;
    MaskedNumber: string;
    Type: string;
  }>;
}
