import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useTheme, useThemeStyles } from "@/theme";

export default function SearchLoader() {
  const { t } = useTranslation();
  const appTheme = useTheme();

  const indicatorStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  const indicatorColor = appTheme.theme.palette.complimentBase;

  return (
    <Stack direction="vertical" align="center" justify="center" style={styles.container}>
      <ActivityIndicator style={indicatorStyle} color={indicatorColor} size="large" />
      <Typography.Text weight="medium" size="callout">
        {t("Settings.ConnectedServicesScreen.loadingResults")}
      </Typography.Text>
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 120,
  },
});
