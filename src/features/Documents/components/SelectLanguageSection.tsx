import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Pill from "@/components/Pill";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { DocumentLanguageType } from "../constants";

interface SelectLanguageSectionProps {
  documentLanguage: DocumentLanguageType;
  onChangeLanguage: (language: DocumentLanguageType) => void;
}

export default function SelectLanguageSection({ documentLanguage, onChangeLanguage }: SelectLanguageSectionProps) {
  const { t } = useTranslation();

  const selectLanguageSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginVertical: theme.spacing["24p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" style={selectLanguageSectionStyle} gap="16p">
      <Typography.Text size="callout" weight="medium" color="neutralBase+10">
        {t("Documents.RequestDocumentScreen.selectDocumentLang")}
      </Typography.Text>
      <Stack direction="horizontal" align="center" gap="16p" justify="space-between">
        <Typography.Text size="callout" weight="regular" color="neutralBase+10">
          {t("Documents.RequestDocumentScreen.language")}
        </Typography.Text>
        <Stack direction="horizontal" gap="8p">
          <Pill
            isActive={documentLanguage === DocumentLanguageType.English}
            onPress={() => onChangeLanguage(DocumentLanguageType.English)}>
            {t("Documents.RequestDocumentScreen.english")}
          </Pill>
          <Pill
            isActive={documentLanguage === DocumentLanguageType.العربية}
            onPress={() => onChangeLanguage(DocumentLanguageType.العربية)}>
            {t("Documents.RequestDocumentScreen.arabic")}
          </Pill>
        </Stack>
      </Stack>
    </Stack>
  );
}
