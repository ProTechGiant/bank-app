import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";

import { StatementLanguageTypes } from "../constants";

interface LanguageFilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onFilter: (language: StatementLanguageTypes) => void;
}

export default function LanguageFilterModal({ onClose, isVisible, onFilter }: LanguageFilterModalProps) {
  const { t } = useTranslation();
  const [preferredLanguage, setPreferredLanguage] = useState<StatementLanguageTypes>(StatementLanguageTypes.English);

  const radioButtonContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["20p"],
  }));

  const handleOnFilter = () => {
    onFilter(preferredLanguage);
  };

  return (
    <Modal headerText={t("Statements.AccessStatements.FilterModal.title")} visible={isVisible} onClose={onClose}>
      <RadioButtonGroup
        style={radioButtonContainerStyle}
        onPress={value => setPreferredLanguage(value)}
        value={preferredLanguage}>
        <RadioButton label={StatementLanguageTypes.English} value={StatementLanguageTypes.English} />
        <RadioButton label={StatementLanguageTypes.Arabic} value={StatementLanguageTypes.Arabic} />
      </RadioButtonGroup>
      <Button onPress={handleOnFilter}>{t("Statements.AccessStatements.FilterModal.buttonText")}</Button>
    </Modal>
  );
}
