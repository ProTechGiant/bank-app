import { ConnectedServicesStatus } from "./constants";

export enum LanguageOptionType {
  Application = "APPLICATION",
  Notifications = "NOTIFICATIONS",
}

export enum LANGUAGES {
  AR = "ar",
  EN = "en",
}

export interface HomePageLayoutResponse {
  name: string;
  type: string;
  description: string;
  isItemChecked: boolean;
  nameAR: string;
  descriptionAR: string;
}
export interface DraggableItemProps {
  data: HomePageLayoutResponse[];
  onDragEnd: (data: HomePageLayoutResponse[]) => void;
}

export interface EditHomeConfigurationProps {
  isVisible: boolean;
  onClose: () => void;
}

export interface ReOrderSectionProps {
  item: HomePageLayoutResponse;
  onPress: () => void;
  isActive: boolean;
  handleItemPress: (name: string) => void;
}

export interface GetUserConnectedServicesInterface {
  PageCount: number;
  RowCount: number;
  DataList: ConnectedServicesDataListInterface[];
}

export interface ConnectedServicesDataListInterface {
  ConsentId: string;
  ConsentStatus: ConnectedServicesStatus;
  TPPInfo: Omit<TppInfoInterface, "TPPId">;
  AccountsNumber: number;
  CreationDateTime: string;
  ExpirationDateTime: string;
  LastDataSharedDateTime: string;
}

export interface TppInfoInterface {
  TPPNameEnglish: string;
  TPPNameArabic: string;
  TPPLogo: string;
  TPPId: string;
}

export interface GetTppListApiResponseInterface {
  TPPList: Tpplist[];
}

export interface Tpplist {
  TPPInfo: Tppinfo;
}

export interface Tppinfo {
  TPPId: string;
  TPPNameEnglish: string;
  TPPNameArabic: string;
}

export interface UserConsentQueryParamsInterface {
  PageSize: number;
  Offset: number;
  Status: ConnectedServicesStatus[];
  FromCreationDate?: string;
  ToCreationDate?: string;
  TPPId?: string;
}

export interface GetUserConsentAPIParamsInterface extends Omit<UserConsentQueryParamsInterface, "Status"> {
  Status: string;
}

export interface GetUserConsentAPIResponse {
  connectedAccounts: ConnectedServicesDataListInterface[];
  totalRecords: number;
}

export interface ConnectedServicesFilterInterface {
  creationDateFilter?: string;
  statusFilters: ConnectedServicesStatus[];
}

export interface SuccessApiResponse {
  Status: string;
  Message: string;
}

export interface ConsentDetailedResponse {
  ConsentId: string;
  TPPInfo: {
    TPPId: string;
    TPPNameEnglish: string;
    TPPNameArabic: string;
    TPPLogo: string;
    TPPNickname: string;
  };
  Purpose: [
    {
      DescriptionEnglish: string;
      DescriptionArabic: string;
    }
  ];
  DataGroupsList: [
    {
      DataGroupNameEnglish: string;
      DataGroupNameArabic: string;
      PermissionsList: [
        {
          PermissionDescriptionEnglish: string;
          PermissionDescriptionArabic: string;
        }
      ];
    }
  ];
  CreationDateTime: string;
  ExpirationDateTime: string;
  Accounts: [
    {
      Id: string;
      MaskedNumber: string;
      Type: string;
    }
  ];
  Cards: [
    {
      AccountNumber: string;
      MaskedNumber: string;
      Type: string;
    }
  ];
}
