import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Typography from "@/components/Typography";
import { useCustomerProfile } from "@/hooks/use-customer-profile";
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

  const { data: customerProfile } = useCustomerProfile();

  return (
    <View style={container}>
      <Typography.Text size="caption2">
        {t("HelpAndSupport.LiveChatScreen.welcomeMessage") +
          `${customerProfile?.FirstName} ` +
          t("HelpAndSupport.LiveChatScreen.waitingMessage")}
      </Typography.Text>
    </View>
  );
}
