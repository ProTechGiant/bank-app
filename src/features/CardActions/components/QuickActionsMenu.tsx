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

interface ContextMenuItem {
  id: number;
  title: string;
  systemIcon?: string;
  disabled?: boolean;
}

export default function QuickActionsMenu({
  cardStatus,
  onUnfreezeCardPress,
  onFreezeCardPress,
  onViewPinPress,
  onCardSettingsPress,
}: QuickActionsMenuProps) {
  const { t } = useTranslation();

  const contextMenuActions: ContextMenuItem[] = [
    {
      id: 1,
      title: cardStatus === "frozen" ? t("CardActions.QuickMenu.defrost") : t("CardActions.QuickMenu.freezeCard"),
      systemIcon: cardStatus === "frozen" ? "thermometer.snowflake" : "snowflake",
      disabled: cardStatus === "inactive" ? true : false,
    },
    {
      id: 2,
      title: t("CardActions.QuickMenu.viewPin"),
      systemIcon: "lock",
      disabled: cardStatus === "inactive" ? true : false,
    },
    {
      id: 3,
      title: t("CardActions.QuickMenu.settings"),
      systemIcon: "gearshape",
    },
  ];

  return (
    <ContextMenu
      actions={contextMenuActions}
      dropdownMenuMode={true}
      onPress={e => {
        e.nativeEvent.index === 0
          ? cardStatus === "frozen"
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
