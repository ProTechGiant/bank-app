import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FilterItemType } from "../types";

interface FilterModalProps {
  onClose: () => void;
  isVisible: boolean;
  categories: FilterItemType[];
  types: FilterItemType[];
  onApplyFilterPress: () => void;
  onClearFilterPress: () => void;
  onTypeFilterItemPress: (index: number) => void;
  onCategoryFilterItemPress: (index: number) => void;
  isApplyButtonDisabled: boolean;
}

export default function FilterModal({
  onClose,
  isVisible,
  categories,
  types,
  onApplyFilterPress,
  onClearFilterPress,
  onTypeFilterItemPress,
  onCategoryFilterItemPress,
  isApplyButtonDisabled,
}: FilterModalProps) {
  const { t } = useTranslation();

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginHorizontal: theme.spacing["16p"],
  }));

  const clearAllStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    alignSelf: "flex-end",
    paddingTop: theme.spacing["8p"],
  }));

  const chipContainerStyle = useThemeStyles<ViewStyle>(theme => ({ marginVertical: theme.spacing["8p"] }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["48p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <Modal visible={isVisible} style={modalStyle} onClose={onClose} headerText={t("WhatsNext.HubScreen.filter")}>
      <Pressable style={clearAllStyle} onPress={onClearFilterPress}>
        <Typography.Text color="primaryBase-40" size="footnote">
          {t("WhatsNext.HubScreen.clearAll")}
        </Typography.Text>
      </Pressable>
      <Stack direction="vertical" gap="16p" align="flex-start" style={contentStyle}>
        <Typography.Text color="neutralBase-10" size="callout">
          {t("WhatsNext.HubScreen.type")}
        </Typography.Text>
        <Stack direction="horizontal" gap="12p" style={styles.flexWrap}>
          {types.map((data, index) => {
            return (
              <View key={data.id} style={chipContainerStyle}>
                <Chip
                  title={data.name}
                  isEnabled={data.isActive}
                  isClosable={false}
                  onPress={() => onTypeFilterItemPress(index)}
                />
              </View>
            );
          })}
        </Stack>
        <Typography.Text color="neutralBase-10" size="callout">
          {t("WhatsNext.HubScreen.category")}
        </Typography.Text>
        <Stack direction="horizontal" gap="12p" style={styles.flexWrap}>
          {categories.map((data, index) => {
            return (
              <View key={data.id} style={chipContainerStyle}>
                <Chip
                  title={data.name}
                  isEnabled={data.isActive}
                  isClosable={false}
                  onPress={() => onCategoryFilterItemPress(index)}
                />
              </View>
            );
          })}
        </Stack>
      </Stack>
      <View style={buttonContainerStyle}>
        <Button onPress={onApplyFilterPress} disabled={isApplyButtonDisabled}>
          {t("WhatsNext.HubScreen.apply")}
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flexWrap: {
    flexWrap: "wrap",
  },
});
