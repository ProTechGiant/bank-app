import { useTranslation } from "react-i18next";
import ContextMenu from "react-native-context-menu-view";

import { ThreeDotsIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";

import { CardStatus } from "../types";

interface QuickActionsMenuProps {
  cardStatus: CardStatus;
  onUnfreezeCardPress: () => void;
  onFreezeCardPress: () => void;
  onViewPinPress: () => void;
  onCardSettingsPress: () => void;
}

export default function QuickActionsMenu({
  cardStatus,
  onUnfreezeCardPress,
  onFreezeCardPress,
  onViewPinPress,
  onCardSettingsPress,
}: QuickActionsMenuProps) {
  const { t } = useTranslation();

  return (
    <ContextMenu
      actions={[
        {
          title: cardStatus === "freeze" ? t("CardActions.QuickMenu.defrost") : t("CardActions.QuickMenu.freezeCard"),
          systemIcon: cardStatus === "freeze" ? "thermometer.snowflake" : "snowflake",
          disabled: cardStatus === "inactive",
        },
        {
          title: t("CardActions.QuickMenu.viewPin"),
          systemIcon: "lock",
          disabled: cardStatus === "inactive",
        },
        {
          title: t("CardActions.QuickMenu.settings"),
          systemIcon: "gearshape",
          disabled: cardStatus === "freeze",
        },
      ]}
      dropdownMenuMode={true}
      onPress={e => {
        e.nativeEvent.index === 0
          ? cardStatus === "freeze"
            ? onUnfreezeCardPress()
            : onFreezeCardPress()
          : e.nativeEvent.index === 1
          ? onViewPinPress()
          : onCardSettingsPress();
      }}>
      <BankCard.EndButton icon={<ThreeDotsIcon />} />
    </ContextMenu>
  );
}
