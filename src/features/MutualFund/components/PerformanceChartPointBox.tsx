import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface PerformanceChartPointBoxProps {
  yValue: number;
  xValue: string;
}

export default function PerformanceChartPointBox({ yValue, xValue }: PerformanceChartPointBoxProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
  }));

  const pointContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    borderRadius: theme.radii.small,
    padding: theme.spacing["8p"],
  }));

  const pointDividerStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 1,
    height: 17,
    backgroundColor: theme.palette["primaryBase-10"],
  }));

  // TODO: add new color from theme
  const pointEndSectionStyle = useThemeStyles<ViewStyle>(() => ({
    width: 4,
    height: 17,
    backgroundColor: "#EC5F48",
    position: "absolute",
    right: 0,
  }));

  // TODO: add translations
  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" align="center" gap="8p" style={pointContainerStyle}>
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="caption2" color="neutralBase-60">
            {t("MutualFund.MutualFundDetailsScreen.date")}
          </Typography.Text>
          <Typography.Text size="caption2" color="neutralBase-60" weight="bold">
            {xValue}
          </Typography.Text>
        </Stack>
        <View style={pointDividerStyle} />
        <Stack direction="vertical" gap="4p">
          <Typography.Text size="caption2" color="neutralBase-60">
            {t("MutualFund.MutualFundDetailsScreen.value")}
          </Typography.Text>
          <Typography.Text size="caption2" color="neutralBase-60" weight="bold">
            {t("MutualFund.MutualFundDetailsScreen.sar", { value: yValue })}
          </Typography.Text>
        </Stack>
        <View style={pointEndSectionStyle} />
      </Stack>
    </View>
  );
}
