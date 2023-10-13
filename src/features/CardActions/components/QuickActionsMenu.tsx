import { useActionSheet } from "@expo/react-native-action-sheet";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native";

import { ThreeDotsIcon } from "@/assets/icons";
import BankCard from "@/components/BankCard";

import { CardStatus } from "../types";

interface QuickActionsMenuProps {
  cardStatus: CardStatus;
  onUnfreezeCardPress: () => void;
  onFreezeCardPress: () => void;
  onViewPinPress: () => void;
  onCardSettingsPress: () => void;
  testID?: string;
}

export default function QuickActionsMenu({
  cardStatus,
  onUnfreezeCardPress,
  onFreezeCardPress,
  onViewPinPress,
  onCardSettingsPress,
  testID,
}: QuickActionsMenuProps) {
  const { t } = useTranslation();
  const { showActionSheetWithOptions } = useActionSheet();

  const handleOnPress = () => {
    const options: string[] = [];

    if (cardStatus !== "INACTIVE") {
      options.push(cardStatus === "LOCK" ? t("CardActions.QuickMenu.defrost") : t("CardActions.QuickMenu.freezeCard"));
      options.push(t("CardActions.QuickMenu.viewPin"));
    }

    if (cardStatus !== "LOCK") options.push(t("CardActions.QuickMenu.settings"));
    options.push(t("CardActions.QuickMenu.cancel"));

    showActionSheetWithOptions({ options, cancelButtonIndex: options.length - 1 }, selectedIndex => {
      if (selectedIndex === undefined) return;
      const label = options[selectedIndex];

      if (label === t("CardActions.QuickMenu.defrost")) {
        onUnfreezeCardPress();
      }

      if (label === t("CardActions.QuickMenu.freezeCard")) {
        onFreezeCardPress();
      }

      if (label === t("CardActions.QuickMenu.viewPin")) {
        onViewPinPress();
      }

      if (label === t("CardActions.QuickMenu.settings")) {
        onCardSettingsPress();
      }
    });
  };

  return (
    <Pressable onPress={handleOnPress} testID={testID}>
      <BankCard.EndButton icon={<ThreeDotsIcon />} />
    </Pressable>
  );
}
