import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Pill from "@/components/Pill";
import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { SelectedLanguageType } from "../types";

interface SelectLanguageSectionProps {
  selectedLanguage: string;
  onChangeLanguage: (language: SelectedLanguageType) => void;
}

export default function SelectLanguageSection({ selectedLanguage, onChangeLanguage }: SelectLanguageSectionProps) {
  const { t } = useTranslation();

  const selectLanguageSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["20p"],
    marginTop: theme.spacing["24p"],
    marginBottom: theme.spacing["20p"],
  }));

  return (
    <Stack direction="vertical" align="stretch" style={selectLanguageSectionStyle} gap="16p">
      <Stack direction="vertical" gap="8p">
        <Typography.Text size="title2" weight="medium" color="neutralBase+30">
          {t("Statements.RequestStatementScreen.letsGo")}
        </Typography.Text>
        <Typography.Text size="callout" weight="medium" color="neutralBase+10">
          {t("Statements.RequestStatementScreen.chooseStatementLanguage")}
        </Typography.Text>
      </Stack>
      <Stack direction="horizontal" align="center" gap="16p" justify="space-between">
        <Typography.Text size="body" weight="regular" color="neutralBase+30">
          {t("Statements.RequestStatementScreen.language")}
        </Typography.Text>
        <Stack direction="horizontal" gap="8p">
          <Pill isActive={selectedLanguage === "en"} onPress={() => onChangeLanguage("en")}>
            {t("Statements.RequestStatementScreen.english")}
          </Pill>
          <Pill isActive={selectedLanguage === "ar"} onPress={() => onChangeLanguage("ar")}>
            {t("Statements.RequestStatementScreen.arabic")}
          </Pill>
        </Stack>
      </Stack>
    </Stack>
  );
}
