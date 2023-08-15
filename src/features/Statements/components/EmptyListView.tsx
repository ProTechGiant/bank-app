import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { ReferralCarouselIcon } from "../assets";

interface EmptyListViewProps {
  isFilterActive: boolean;
}

export default function EmptyListView({ isFilterActive }: EmptyListViewProps) {
  const { t } = useTranslation();
  const { height: screenHeight } = useWindowDimensions();

  const titleStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["8p"],
  }));

  const emptyListViewStyle = useThemeStyles<ViewStyle>(theme => ({
    padding: theme.spacing["16p"],
    marginBottom: theme.spacing["16p"],
    alignSelf: "center",
    borderRadius: theme.radii.xlarge,
  }));

  return (
    <Stack direction="vertical" align="center" justify="center" style={{ height: screenHeight * 0.5 }}>
      <Stack direction="vertical" style={emptyListViewStyle}>
        <ReferralCarouselIcon />
      </Stack>
      <Typography.Text style={titleStyle} weight="bold" size="title3" align="center">
        {t("Statements.AccessStatements.nothingHereText")}
      </Typography.Text>
      <Typography.Text style={styles.paddingBottom} size="callout" color="neutralBase+10" align="center">
        {isFilterActive
          ? t("Statements.AccessStatements.noStatementsTextForFilter")
          : t("Statements.AccessStatements.noStatementsText")}
      </Typography.Text>
    </Stack>
  );
}

const styles = StyleSheet.create({
  paddingBottom: {
    paddingBottom: 100,
  },
});
