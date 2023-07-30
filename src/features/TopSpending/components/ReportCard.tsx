import React from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { TrendingUpIcon } from "@/assets/icons";
import Typography from "@/components/Typography";
import { Theme, useThemeStyles } from "@/theme";

interface ReportCardProps {
  color?: keyof Theme["palette"];
  label: string;
  amount: number | string;
}

export default function ReportCard({ color = "primaryBase-40", label, amount }: ReportCardProps) {
  const { t } = useTranslation();
  const container = useThemeStyles<ViewStyle>(theme => ({
    paddingVertical: theme.spacing["12p"],
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }));
  const leftSide = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: theme.spacing["12p"],
  }));

  const iconColor = useThemeStyles(theme => theme.palette[color]);
  return (
    <View style={container}>
      <View style={leftSide}>
        <TrendingUpIcon color={iconColor} width={44} height={44} />
        <Typography.Text size="callout">{label}</Typography.Text>
      </View>
      <Typography.Text color={color} size="callout">
        {amount} {t("Currency.sar")}
      </Typography.Text>
    </View>
  );
}
