import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";
import { SortingOptions } from "@/types/Appreciation";

interface SortingModalProps {
  isVisible: boolean;
  isApplyButtonDisabled: boolean;
  onApplyButtonPressed: () => void;
  onClose: () => void;
  onChange: (nextValue: SortingOptions) => void;
  currentValue: SortingOptions;
  options: SortingOptions[];
}

export default function SortingModal({
  isVisible,
  isApplyButtonDisabled,
  onApplyButtonPressed,
  currentValue,
  onChange,
  onClose,
  options,
}: SortingModalProps) {
  const { t } = useTranslation();

  const radioButtonGroupStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingBottom: theme.spacing["32p"],
  }));

  return (
    <Modal visible={isVisible} onClose={onClose} headerText={t("Appreciation.SortingModal.title")}>
      <RadioButtonGroup value={currentValue} onPress={newValue => onChange(newValue)} style={radioButtonGroupStyle}>
        {options.map(option => (
          <RadioButton value={option} label={t(`Appreciation.HubScreen.FilterOptions.${option}`)} key={option} />
        ))}
      </RadioButtonGroup>
      <Button onPress={onApplyButtonPressed} disabled={isApplyButtonDisabled}>
        {t("Appreciation.SortingModal.applyButton")}
      </Button>
    </Modal>
  );
}
