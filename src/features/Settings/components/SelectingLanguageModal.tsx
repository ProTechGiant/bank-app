import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";

enum LANGUAGES {
  AR = "ar",
  EN = "en",
}
interface SelectingLanguageModalProps {
  onClose: () => void;
  onSaveChanges: (value: string) => void;
  isVisible: boolean;
  title: string;
}

export default function SelectingLanguageModal({
  onClose,
  onSaveChanges,
  isVisible,
  title,
}: SelectingLanguageModalProps) {
  const { i18n, t } = useTranslation("translation", { keyPrefix: "Settings.ChangeLanguageModal" });

  const [value, setValue] = useState(i18n.language);
  const isSaveChangesButtonDisabled = value === i18n.language;

  const handleSaveChangesPress = () => {
    onSaveChanges(value);
  };

  const modalStyle = useThemeStyles<ViewStyle>(theme => ({
    borderRadius: theme.radii.small,
  }));

  const buttonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["32p"],
    paddingBottom: theme.spacing["16p"],
  }));

  return (
    <Modal visible={isVisible} style={modalStyle} onClose={onClose} headerText={title}>
      <View>
        <RadioButtonGroup onPress={selectedValue => setValue(selectedValue)} value={value}>
          <RadioButton value={LANGUAGES.EN} label="English" />
          <RadioButton value={LANGUAGES.AR} label="العربية" />
        </RadioButtonGroup>
      </View>
      <View style={buttonContainerStyle}>
        <Button onPress={handleSaveChangesPress} disabled={isSaveChangesButtonDisabled}>
          {t("saveChanges")}
        </Button>
      </View>
    </Modal>
  );
}
