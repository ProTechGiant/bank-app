import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export default function EmptySearchResult() {
  const { t } = useTranslation();

  const noResultStyles = useThemeStyles<ViewStyle>(theme => ({
    marginHorizontal: theme.spacing["24p"],
  }));

  return (
    <Stack direction="vertical" justify="center" align="center" flex={1} style={noResultStyles}>
      <Typography.Text size="callout" weight="semiBold" align="center">
        {t("EmptySearchResult.title")}
      </Typography.Text>
      <Typography.Text size="footnote" weight="regular" align="center">
        {t("EmptySearchResult.message")}
      </Typography.Text>
    </Stack>
  );
}
