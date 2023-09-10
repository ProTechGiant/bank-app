import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import { useThemeStyles } from "@/theme";

import { FilterType } from "../types";

interface FilterModalProps {
  isVisible: boolean;
  setIsVisible: (status: boolean) => void;
  filters: FilterType[];
  onItemPress: (id: number) => void;
  onApplyButtonPress: () => void;
  isApplyButtonDisabled: boolean;
}
export default function FilterModal({
  setIsVisible,
  isVisible,
  filters,
  onItemPress,
  onApplyButtonPress,
  isApplyButtonDisabled,
}: FilterModalProps) {
  const { t } = useTranslation();

  const tagsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    flexWrap: "wrap",
    paddingBottom: theme.spacing["48p"],
  }));

  return (
    <Modal
      headerText={t("Notifications.NotificationHubScreen.filterModal.title")}
      onClose={() => setIsVisible(false)}
      visible={isVisible}>
      <Stack direction="horizontal" gap="12p" style={tagsContainerStyle}>
        {filters.map(item => {
          return (
            <Chip
              onPress={() => onItemPress(item.Id)}
              title={item.Name}
              isRemovable={false}
              key={item.Id}
              isSelected={item.isActive}
            />
          );
        })}
      </Stack>
      <Button onPress={onApplyButtonPress} disabled={isApplyButtonDisabled}>
        {t("Notifications.NotificationHubScreen.filterModal.applyButton")}
      </Button>
    </Modal>
  );
}
