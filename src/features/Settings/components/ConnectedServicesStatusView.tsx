import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useTheme, useThemeStyles } from "@/theme";

import { ConnectedServicesStatus } from "../constants";

interface ConnectedServicesStatusViewProps {
  status: ConnectedServicesStatus;
}

export default function ConnectedServicesStatusView({ status }: ConnectedServicesStatusViewProps) {
  const { t } = useTranslation();
  const {
    theme: { palette },
  } = useTheme();

  const badgeStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["4p"],
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    alignItems: "center",
    borderRadius: theme.radii.extraSmall,
  }));

  const documentStatusData = {
    [ConnectedServicesStatus.AUTHORIZED]: {
      title: t("Settings.ConnectedServicesScreen.active"),
      color: palette.successBase,
    },
    [ConnectedServicesStatus.REJECTED]: {
      title: t("Settings.ConnectedServicesScreen.Rejected"),
      color: palette["errorBase-20"],
    },
    [ConnectedServicesStatus.REVOKED]: {
      title: t("Settings.ConnectedServicesScreen.Revoked"),
      color: palette["secondary_yellowBase-10"],
    },
    [ConnectedServicesStatus.EXPIRED]: {
      title: t("Settings.ConnectedServicesScreen.Expired"),
      color: palette["secondary_blueBase-20"],
    },
  };

  const backgroundColor = documentStatusData[status]?.color;

  return (
    <Stack direction="horizontal" style={[badgeStyle, { backgroundColor }]}>
      <Typography.Text size="caption1">{documentStatusData[status].title}</Typography.Text>
    </Stack>
  );
}
