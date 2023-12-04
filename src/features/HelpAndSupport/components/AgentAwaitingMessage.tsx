import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

export default function AgentAwaitingMessage() {
  const { t } = useTranslation();

  const container = useThemeStyles<ViewStyle>(theme => ({
    borderColor: theme.palette["primaryBase-70"],
    borderStartWidth: theme.spacing["4p"],
    borderRadius: theme.radii.regular,
    borderTopRightRadius: theme.radii.xlarge,
    borderBottomRightRadius: theme.radii.extraSmall,
    padding: theme.spacing["16p"],
    marginBottom: theme.spacing["24p"],
    backgroundColor: theme.palette["supportBase-20"],
  }));

  return (
    <View style={container}>
      <Typography.Text size="caption2">{t("HelpAndSupport.LiveChatScreen.waitingMessage")}</Typography.Text>
    </View>
  );
}
