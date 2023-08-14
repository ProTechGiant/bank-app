import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View, ViewStyle } from "react-native";

import { useThemeStyles } from "@/theme";

export default function RedeemedAppreciation() {
  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["24p"],
  }));

  const { t } = useTranslation();
  return (
    <View style={containerStyle}>
      <Text>{t("Appreciation.HubScreen.redeemed")}</Text>
    </View>
  );
}
