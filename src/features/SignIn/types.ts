import { AlertVariantType } from "@/components/Alert";

export interface ErrorMessageType {
  message: string | JSX.Element;
  variant: AlertVariantType;
  link?: string;
}

export interface IqamaInputs {
  MobileNumber: string;
  NationalId: string;
}
