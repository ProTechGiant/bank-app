import React from "react";
import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useTheme, useThemeStyles } from "@/theme";

import { CheckCircleIcon } from "../assets/CheckCircleIcon";
import { CircleIcon } from "../assets/CircleIcon";
import { UploadDocumentStatus } from "../constants";

interface UploadDocumentStatusViewProps {
  status: UploadDocumentStatus;
}

export default function UploadDocumentStatusView({ status }: UploadDocumentStatusViewProps) {
  const { t } = useTranslation();
  const {
    theme: { palette },
  } = useTheme();

  const badgeStyle = useThemeStyles<ViewStyle>(theme => ({
    gap: theme.spacing["4p"],
    marginBottom: theme.spacing["8p"],
    paddingHorizontal: theme.spacing["8p"],
    paddingVertical: theme.spacing["4p"],
    alignItems: "center",
  }));

  const documentStatusData = {
    [UploadDocumentStatus.NEW]: {
      title: t("Onboarding.UploadDocumentScreen.todo"),
      color: palette["neutralBase-20"],
      icon: <CircleIcon />,
    },
    [UploadDocumentStatus.APPROVED]: {
      title: t("Onboarding.UploadDocumentScreen.done"),
      color: palette.successBase,
      icon: <CheckCircleIcon />,
    },
    [UploadDocumentStatus.REJECTED]: {
      title: t("Onboarding.UploadDocumentScreen.failed"),
      color: palette.interactionBase,
      icon: <CircleIcon />,
    },
  };

  const backgroundColor = documentStatusData[status]?.color;

  return (
    <Stack direction="horizontal" style={[badgeStyle, { backgroundColor }]}>
      {documentStatusData[status].icon}
      <Typography.Text size="caption1" color="neutralBase-60">
        {documentStatusData[status].title}
      </Typography.Text>
    </Stack>
  );
}
