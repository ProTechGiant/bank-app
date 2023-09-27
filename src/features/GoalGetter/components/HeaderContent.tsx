import React from "react";
import { useTranslation } from "react-i18next";
import { TextStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

interface HeaderContentProps {
  goalName: string;
  contribution: string;
  duration: string;
}

export default function HeaderContent({ goalName, contribution, duration }: HeaderContentProps) {
  const { t } = useTranslation();

  const headerTextPadding = useThemeStyles<TextStyle>(theme => ({
    paddingBottom: theme.spacing["12p"],
    paddingTop: theme.spacing["12p"],
  }));

  const textPaddingBottom = useThemeStyles<TextStyle>(theme => ({
    paddingBottom: theme.spacing["12p"],
  }));

  return (
    <Stack direction="vertical" gap="8p">
      <Typography.Text size="title1" weight="regular" style={headerTextPadding}>
        {t("GoalGetter.SelectProductsScreen.headerContent.title")}
      </Typography.Text>
      <Typography.Text size="footnote" weight="regular" color="neutralBase+20">
        {goalName}
      </Typography.Text>
      <Typography.Text size="xlarge" weight="bold" style={textPaddingBottom}>
        {contribution}
      </Typography.Text>
      <Typography.Text size="footnote" weight="regular" color="neutralBase+20">
        {t("GoalGetter.SelectProductsScreen.headerContent.achievedIn")}
      </Typography.Text>
      <Typography.Text size="title2" weight="bold">
        {duration}
      </Typography.Text>
    </Stack>
  );
}
