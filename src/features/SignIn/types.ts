import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { AlertColorType } from "@/components/Alert";

export interface ErrorMessageType {
  message: string | JSX.Element;
  icon: React.ReactElement<SvgProps | IconProps>;
  color: AlertColorType;
  link?: string;
}

export interface IqamaInputs {
  MobileNumber: string;
  NationalId: string;
}
