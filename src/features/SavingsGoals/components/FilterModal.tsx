import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (options: string[]) => void;
  onClearAll: () => void;
  filterOptions: string[];
  selectedOptions: string[];
  onSelectOption: (options: string) => void;
}

export default function FilterModal({
  selectedOptions,
  visible,
  onClose,
  onApplyFilter,
  filterOptions,
  onClearAll,
  onSelectOption,
}: FilterModalProps) {
  const { t } = useTranslation();
  const handleOnClearAll = () => {
    onClearAll();
    onClose();
  };

  const handleOnApplyFilter = () => {
    onApplyFilter(selectedOptions);
    onClose();
  };

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["16p"],
    backgroundColor: theme.palette["neutralBase-50"],
  }));

  const optionContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    flexDirection: "row",
    backgroundColor: theme.palette["neutralBase-40"],
    borderRadius: theme.radii.xxlarge,
    paddingHorizontal: theme.spacing["12p"],
    paddingVertical: theme.spacing["4p"],
    marginHorizontal: theme.spacing["4p"],
    borderWidth: 1,
    borderColor: theme.palette["neutralBase-30"],
    marginBottom: theme.spacing["8p"],
  }));

  const optionSelectedStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["neutralBase-40"],
    borderWidth: 2,
    borderColor: theme.palette["neutralBase+30"],
  }));

  const buttonsContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["48p"],
  }));

  const containerMarginsStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const renderOptions = (options: string[]) => {
    return options.map(option => (
      <Pressable
        style={[optionContainerStyle, selectedOptions.includes(option) && optionSelectedStyle]}
        onPress={() => onSelectOption(option)}
        key={option}>
        <Typography.Text size="footnote" weight="medium" color="neutralBase+30">
          {option}
        </Typography.Text>
      </Pressable>
    ));
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      style={modalStyle}
      headerText={t("SavingsGoals.GoalDetailsScreen.FilterModal.title")}>
      <Stack direction="vertical" align="stretch">
        <Stack direction="vertical" gap="12p" style={containerMarginsStyle}>
          <Typography.Text size="callout" color="neutralBase-10" weight="medium">
            {t("SavingsGoals.GoalDetailsScreen.FilterModal.type")}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" align="center" style={styles.pillsContainer}>
          {renderOptions(filterOptions)}
        </Stack>
        <View style={buttonsContainerStyle}>
          <Button disabled={!selectedOptions.length} onPress={handleOnApplyFilter}>
            {t("SavingsGoals.GoalDetailsScreen.FilterModal.buttonText")}
          </Button>
          <Button variant="tertiary" onPress={handleOnClearAll}>
            {t("SavingsGoals.GoalDetailsScreen.FilterModal.clearAll")}
          </Button>
        </View>
      </Stack>
    </Modal>
  );
}

const styles = StyleSheet.create({
  pillsContainer: {
    flexWrap: "wrap",
  },
});
