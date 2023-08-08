import { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";

import { LANGUAGES } from "../types";

interface SelectingLanguageModalProps {
  onClose: () => void;
  onSaveChanges: (value: string) => void;
  isVisible: boolean;
  title: string;
  selectedLanguage?: string;
  isSaveButtonLoading: boolean;
}

const SelectingLanguageModal = ({
  onClose,
  onSaveChanges,
  isVisible,
  title,
  selectedLanguage,
  isSaveButtonLoading,
}: SelectingLanguageModalProps) => {
  const { t } = useTranslation("translation", { keyPrefix: "Settings" });
  const [value, setValue] = useState(selectedLanguage);
  const isSaveChangesButtonDisabled = value === selectedLanguage;

  useEffect(() => {
    setValue(selectedLanguage);
  }, [selectedLanguage, isVisible]);

  const handleSaveChangesPress = () => {
    if (value && !isSaveButtonLoading) {
      onSaveChanges(value);
    }
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
          <RadioButton value={LANGUAGES.EN} label={t("language.EN")} />
          <RadioButton value={LANGUAGES.AR} label={t("language.AR")} />
        </RadioButtonGroup>
      </View>
      <View style={buttonContainerStyle}>
        <Button onPress={handleSaveChangesPress} loading={isSaveButtonLoading} disabled={isSaveChangesButtonDisabled}>
          {t("ChangeLanguageModal.saveChanges")}
        </Button>
      </View>
    </Modal>
  );
};

export default memo(SelectingLanguageModal);
