import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View, ViewStyle } from "react-native";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { DocumentTypeOptions, LanguageOptions, StatusOptions } from "../types";

interface ViewFilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategory: string[];
  selectedLanguage: string[];
  selectedStatus: string[];
  onApplyFilter: (filters: { status: string[]; language: string[]; documentType: string[] }) => void;
}

export default function ViewFilterModal({
  visible,
  onClose,
  onApplyFilter,
  selectedCategory,
  selectedLanguage,
  selectedStatus,
}: ViewFilterModalProps) {
  const { t } = useTranslation();

  const [selectedStatusOptions, setSelectedStatusOptions] = useState<string[]>(selectedStatus);
  const [selectedLanguageOptions, setSelectedLanguageOptions] = useState<string[]>(selectedLanguage);
  const [selectedDocumentTypeOptions, setSelectedDocumentTypeOptions] = useState<string[]>(selectedCategory);

  const handleOptionSelect = (option: string, setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSelectedOptions(prevOptions => {
      if (prevOptions.includes(option)) {
        return prevOptions.filter(item => item !== option);
      } else {
        return [...prevOptions, option];
      }
    });
  };

  useEffect(() => {
    setSelectedStatusOptions(selectedStatus);
    setSelectedLanguageOptions(selectedLanguage);
    setSelectedDocumentTypeOptions(selectedCategory);
  }, [selectedStatus, selectedLanguage, selectedCategory]);

  const handleOnApplyFilter = () => {
    onApplyFilter({
      status: selectedStatusOptions,
      language: selectedLanguageOptions,
      documentType: selectedDocumentTypeOptions,
    });

    onClose();
  };

  const handleOnClearFilter = () => {
    setSelectedStatusOptions([]);
    setSelectedLanguageOptions([]);
    setSelectedDocumentTypeOptions([]);

    onApplyFilter({
      status: [],
      language: [],
      documentType: [],
    });
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
    marginBottom: theme.spacing["4p"],
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

  const renderOptions = (
    options: string[],
    selectedOptions: string[],
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    return options.map(option => (
      <Pressable
        style={[optionContainerStyle, selectedOptions.includes(option) && optionSelectedStyle]}
        onPress={() => handleOptionSelect(option, setSelectedOptions)}
        key={option}>
        <Typography.Text size="footnote" weight="medium" color="neutralBase+30">
          {option}
        </Typography.Text>
      </Pressable>
    ));
  };

  const renderMainScreen = () => {
    return (
      <>
        <Stack direction="vertical" gap="12p" style={containerMarginsStyle}>
          <Typography.Text size="callout" color="neutralBase-10" weight="medium">
            {t("Documents.FilterModal.documentType")}
          </Typography.Text>
          <Stack direction="horizontal" align="center">
            {renderOptions(
              Object.values(DocumentTypeOptions),
              selectedDocumentTypeOptions,
              setSelectedDocumentTypeOptions
            )}
          </Stack>
        </Stack>
        <Stack direction="vertical" gap="12p" style={containerMarginsStyle}>
          <Typography.Text size="callout" color="neutralBase-10" weight="medium">
            {t("Documents.FilterModal.language")}
          </Typography.Text>
          <Stack direction="horizontal" align="center">
            {renderOptions(Object.values(LanguageOptions), selectedLanguageOptions, setSelectedLanguageOptions)}
          </Stack>
        </Stack>
        <Stack direction="vertical" gap="12p">
          <Typography.Text size="callout" color="neutralBase-10" weight="medium">
            {t("Documents.FilterModal.status")}
          </Typography.Text>
          <Stack direction="horizontal" align="center">
            {renderOptions(Object.values(StatusOptions), selectedStatusOptions, setSelectedStatusOptions)}
          </Stack>
        </Stack>

        <View style={buttonsContainerStyle}>
          <Button
            onPress={handleOnApplyFilter}
            disabled={
              !(
                selectedStatusOptions.length > 0 ||
                selectedLanguageOptions.length > 0 ||
                selectedDocumentTypeOptions.length > 0
              )
            }>
            {t("Documents.FilterModal.set")}
          </Button>
          <Button
            disabled={
              !(
                selectedStatusOptions.length > 0 ||
                selectedLanguageOptions.length > 0 ||
                selectedDocumentTypeOptions.length > 0
              )
            }
            variant="tertiary"
            onPress={handleOnClearFilter}>
            {t("Documents.FilterModal.clearAll")}
          </Button>
        </View>
      </>
    );
  };

  return (
    <Modal visible={visible} onClose={onClose} style={modalStyle} headerText="Filter">
      {renderMainScreen()}
    </Modal>
  );
}
