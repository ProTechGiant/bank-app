import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface PerformanceChartPointBoxProps {
  yValue: number;
}

export default function PerformanceChartPointBox({ yValue }: PerformanceChartPointBoxProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
  }));

  const pointContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    borderRadius: theme.radii.small,
    padding: theme.spacing["8p"],
  }));

  // TODO: add new color from theme
  const pointEndSectionStyle = useThemeStyles<ViewStyle>(() => ({
    width: 4,
    height: 17,
    backgroundColor: "#EC5F48",
    position: "absolute",
    right: 0,
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="horizontal" align="center" gap="8p" style={pointContainerStyle}>
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
