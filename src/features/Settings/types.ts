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
  TPPList: Omit<TppInfoInterface, "TPPLogo">[];
}

export interface ConsentDetailedInterface {
  ConsentId: string;
  TPPInfo: {
    TPPNameEnglish: string;
    TPPNameArabic: string;
    TPPNickName: string;
    GroupsListData: {
      DataGroupNameEnglish: string;
      DataGroupNameArabic: string;
      PermissionsList: {
        PermissionDescriptionEnglish: string;
        PermissionDescriptionArabic: string;
      }[];
    }[];
    CreationDateTime: string;
    ExiprationDateTime: string;
    Accounts: {
      Id: number;
      Type: string;
    }[];
    Cards: {
      AccountNumber: string;
      Type: string;
    }[];
  };
}
