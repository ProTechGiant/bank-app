import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { RadioButton, RadioButtonGroup } from "@/components/RadioButton";
import { useThemeStyles } from "@/theme";

import { StatementLanguageTypes } from "../constants";

interface LanguageFilterModalProps {
  isVisible: boolean;
  preferredLanguage: StatementLanguageTypes;
  onChangePreferredLanguage: (language: StatementLanguageTypes) => void;
  onClose: () => void;
  onFilter: (language: StatementLanguageTypes) => void;
}

export default function LanguageFilterModal({
  onClose,
  isVisible,
  onFilter,
  preferredLanguage,
  onChangePreferredLanguage,
}: LanguageFilterModalProps) {
  const { t } = useTranslation();

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
        onPress={value => onChangePreferredLanguage(value)}
        value={preferredLanguage}>
        <RadioButton label={t("Statements.AccessStatements.EN")} value={StatementLanguageTypes.English} />
        <RadioButton label={t("Statements.AccessStatements.AR")} value={StatementLanguageTypes.Arabic} />
      </RadioButtonGroup>
      <Button onPress={handleOnFilter}>{t("Statements.AccessStatements.FilterModal.buttonText")}</Button>
    </Modal>
  );
}
