import { createElement } from "react";
import { SvgProps } from "react-native-svg";

import * as icons from "@/assets/icons";
import { IconProps } from "@/assets/icons";

interface IconMappingType {
  [key: string]: {
    [key: string]: React.ReactElement<SvgProps | IconProps>;
  };
}

export const iconMapping: IconMappingType = {
  frequentlyAskedQuestions: {
    c_1: createElement(icons.PersonIcon),
    c_2: createElement(icons.TransferHorizontalIcon),
    c_3: createElement(icons.MoneyIcon),
    c_4: createElement(icons.CardIcon),
    c_5: createElement(icons.WalletIcon),
    c_6: createElement(icons.MobileIcon),
  },
  homepageQuickActions: {
    "balance-add": createElement(icons.AddBorderedIcon),
    "split-bill": createElement(icons.SplitIcon),
    settings: createElement(icons.SettingsIcon),
    "send-money": createElement(icons.TransferVerticalIcon),
    referrals: createElement(icons.ReferralIcon),
    "internal-transfer": createElement(icons.TransferHorizontalIcon),
    edit: createElement(icons.ThreeDotsIcon),
    plus: createElement(icons.PlusIcon),
  },
  adhocDocumnets: {
    "01": createElement(icons.SummarizeIcon),
    "02": createElement(icons.CardMemberShipIcon),
  },
};
