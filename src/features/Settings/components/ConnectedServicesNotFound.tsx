import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { EmptyStateIllustrationIcon } from "../assets/icons";

export default function ConnectedServicesNotFound() {
  const { t } = useTranslation();

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["4p"],
  }));

  const illustrationStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["16p"],
  }));

  return (
    <Stack direction="vertical" align="center" justify="center" style={styles.container}>
      <Stack style={illustrationStyle} direction="horizontal">
        <EmptyStateIllustrationIcon />
      </Stack>
      <Typography.Text size="callout" weight="medium" style={titleStyle}>
        {t("Settings.ConnectedServicesScreen.noResultsFound")}
      </Typography.Text>
      <Typography.Text size="footnote" color="neutralBase">
        {t("Settings.ConnectedServicesScreen.notConnectionYet")}
      </Typography.Text>
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 120,
  },
});
