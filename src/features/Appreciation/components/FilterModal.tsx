import { useTranslation } from "react-i18next";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { FiltersType } from "../types";

interface FilterModalProps {
  onClose: () => void;
  onApplyButtonPress: () => void;
  onClearAllPressed: () => void;
  onFilterItemPressed: (categoryIndex: number, itemIndex: number) => void;
  isApplyButtonDisabled: boolean;
  isVisible: boolean;
  filters: FiltersType[];
}

export default function FilterModal({
  onClose,
  onApplyButtonPress,
  isApplyButtonDisabled,
  isVisible,
  filters,
  onFilterItemPressed,
  onClearAllPressed,
}: FilterModalProps) {
  const { t } = useTranslation();

  const clearAllButtonStyle = useThemeStyles<ViewStyle>(() => ({
    width: "100%",
  }));

  const clearAllTextStyle = useThemeStyles<TextStyle>(() => ({
    textDecorationLine: "underline",
  }));

  const categoryStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["32p"],
    paddingBottom: theme.spacing["48p"],
  }));

  const tagsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["12p"],
    flexWrap: "wrap",
  }));

  return (
    <Modal visible={isVisible} onClose={() => onClose()} headerText={t("Appreciation.HubScreen.filter")}>
      <Pressable onPress={onClearAllPressed} style={clearAllButtonStyle}>
        <Typography.Text
          color="primaryBase-40"
          weight="regular"
          size="footnote"
          align="right"
          style={clearAllTextStyle}>
          {t("Appreciation.HubScreen.clearAll")}
        </Typography.Text>
      </Pressable>
      <View style={categoryStyle}>
        {filters.map((filterCategory, index) => {
          return (
            <Stack direction="vertical" gap="16p" key={index}>
              <Typography.Text size="callout" color="neutralBase-10" weight="medium">
                {filterCategory.filterName}
              </Typography.Text>
              <Stack direction="horizontal" gap="12p" style={tagsContainerStyle}>
                {filterCategory.filters.map((item, i) => {
                  return (
                    <Chip
                      onPress={() => onFilterItemPressed(index, i)}
                      title={item.name}
                      isRemovable={false}
                      key={i}
                      isSelected={item.isActive}
                    />
                  );
                })}
              </Stack>
            </Stack>
          );
        })}
      </View>
      <Button onPress={onApplyButtonPress} disabled={isApplyButtonDisabled}>
        {t("Appreciation.HubScreen.apply")}
      </Button>
    </Modal>
  );
}
