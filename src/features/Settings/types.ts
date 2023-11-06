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

export interface ConnectedServicesInterface {
  title: string;
  status: ConnectedServicesStatus;
  accountsCount: number;
  firstConnected: string;
  lastDataShared?: string;
  connectionExpiry?: string;
  rejectionDate?: string;
  expiryDate?: string;
  disconnectionDate?: string;
}
