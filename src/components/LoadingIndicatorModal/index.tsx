import React from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Modal, View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

interface LoadingIndicatorModalProps {
  color?: keyof Theme["palette"];
  loadingText?: string;
}

export default function LoadingIndicatorModal(props: LoadingIndicatorModalProps) {
  const { t } = useTranslation();

  const defaultLoadingText = t("Loader.loadingText");
  const { loadingText = defaultLoadingText } = props;

  const containerStyles = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.palette["neutralBase+10"],
  }));

  const innerContainerStyles = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette["supportBase-30"],
    padding: theme.spacing["67p"],
    borderRadius: theme.radii.xlarge,
    justifyContent: "center",
  }));

  const loadingTextStyle = useThemeStyles<ViewStyle>(theme => ({
    marginBottom: theme.spacing["32p"],
  }));

  return (
    <Modal transparent>
      <View style={containerStyles}>
        <Typography.Text color="supportBase-30" size="large" weight="bold" align="center" style={loadingTextStyle}>
          {loadingText}
        </Typography.Text>
        <View style={innerContainerStyles}>
          <ActivityIndicator size="large" color="primaryBase-40" />
        </View>
      </View>
    </Modal>
  );
}
