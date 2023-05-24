import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Modal, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

interface LoaderModalProps {
  loading: boolean;
  color?: keyof Theme["palette"];
}

export default function LoaderModal({ loading }: LoaderModalProps) {
  const { t } = useTranslation();

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette["neutralBase+10"],
  }));

  const innerContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-30"],
    padding: theme.spacing["64p"],
    borderRadius: theme.radii.xlarge,
    justifyContent: "center",
  }));

  const loadingTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Modal transparent visible={loading}>
      <View style={containerStyles}>
        <Typography.Text color="supportBase-30" size="large" weight="bold" style={loadingTextStyle}>
          {t("LoaderText.loadingText")}
        </Typography.Text>
        <View style={innerContainerStyles}>
          <ActivityIndicator size="large" color="#27574E" />
        </View>
      </View>
    </Modal>
  );
}
