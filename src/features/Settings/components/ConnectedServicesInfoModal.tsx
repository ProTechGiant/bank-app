import React from "react";
import { useTranslation } from "react-i18next";
import { TextStyle } from "react-native";

import { Modal, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface ConnectedServicesInfoModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function ConnectedServicesInfoModal({ isVisible, onClose }: ConnectedServicesInfoModalProps) {
  const { t } = useTranslation();

  const titleStyle = useThemeStyles<TextStyle>(theme => ({
    marginBottom: theme.spacing["24p"],
  }));

  return (
    <Modal visible={isVisible} onClose={onClose}>
      <Typography.Text style={titleStyle} size="callout" color="neutralBase+10">
        {t("Settings.ConnectedServicesScreen.InfoModal.title")}
      </Typography.Text>
      <Typography.Text size="callout" color="neutralBase+10" style={titleStyle}>
        {t("Settings.ConnectedServicesScreen.InfoModal.description")}
      </Typography.Text>
    </Modal>
  );
}
