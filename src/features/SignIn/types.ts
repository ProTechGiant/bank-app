import { SvgProps } from "react-native-svg";

import { IconProps } from "@/assets/icons";
import { BannerColorType } from "@/components/Banner";

export interface ErrorMessageType {
  message: string | JSX.Element;
  icon: React.ReactElement<SvgProps | IconProps>;
  backgroundColor: BannerColorType;
  link?: string;
}

export interface IqamaInputs {
  MobileNumber: string;
  NationalId: string;
}
