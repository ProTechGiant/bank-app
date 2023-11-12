import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

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
  onItemPress: (id: string) => void;
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

  const applyButtonStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["48p"],
  }));

  const tagsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    flexWrap: "wrap",
    paddingBottom: theme.spacing["48p"],
  }));

  return (
    <Modal
      style={styles.modalStyle}
      headerText={t("Notifications.NotificationHubScreen.filterModal.title")}
      onClose={() => setIsVisible(false)}
      visible={isVisible}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
        <View style={applyButtonStyle}>
          <Button onPress={onApplyButtonPress} disabled={isApplyButtonDisabled}>
            {t("Notifications.NotificationHubScreen.filterModal.applyButton")}
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalStyle: {
    maxHeight: "80%",
  },
});
