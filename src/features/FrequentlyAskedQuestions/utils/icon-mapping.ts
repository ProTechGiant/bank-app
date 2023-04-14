import { createElement } from "react";
import { SvgProps } from "react-native-svg";

import * as icons from "@/assets/icons";
import { IconProps } from "@/assets/icons";

interface IconMappingType {
  [key: string]: React.ReactElement<SvgProps | IconProps>;
}

export const iconMapping: IconMappingType = {
  c_1: createElement(icons.PersonIcon),
  c_2: createElement(icons.TransferHorizontalIcon),
  c_3: createElement(icons.MoneyIcon),
  c_4: createElement(icons.CardIcon),
  c_5: createElement(icons.WalletIcon),
  c_6: createElement(icons.MobileIcon),
};
