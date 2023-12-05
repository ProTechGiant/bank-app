import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

import { RatioIcon } from "../assets/icons";

interface PerformanceChartPointBoxProps {
  yValue: number;
  investmentAmount: number;
  xValue: string;
}

export default function PerformanceChartPointBox({ yValue, xValue, investmentAmount }: PerformanceChartPointBoxProps) {
  const { t } = useTranslation();

  const getProfitPercentage = () => {
    const profit = ((yValue - investmentAmount) / yValue) * 10;
    if (isNaN(profit)) {
      return 0;
    }
    return profit.toFixed(1);
  };

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["16p"],
  }));

  const investmentContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    paddingTop: theme.spacing["8p"],
  }));

  const pointContainerStyle = useThemeStyles<ViewStyle>(theme => ({
    backgroundColor: theme.palette.primaryBase,
    borderRadius: theme.radii.small,
    padding: theme.spacing["12p"],
  }));

  const pointEndSectionStyle = useThemeStyles<ViewStyle>(theme => ({
    width: 4,
    height: 40,
    backgroundColor: theme.palette.complimentBase,
    position: "absolute",
    right: 0,
  }));

  return (
    <View style={containerStyle}>
      <Stack direction="vertical" justify="center" gap="4p" style={pointContainerStyle}>
        <Stack direction="horizontal" gap="4p">
          <Typography.Text size="caption2" color="neutralBase-60">
            {t("MutualFund.MutualFundDetailsScreen.yourExpectedReturnIn")}
          </Typography.Text>
          <Typography.Text size="caption2" color="neutralBase-60" weight="bold">
            {xValue}
          </Typography.Text>
        </Stack>
        <Stack direction="horizontal" align="center" gap="4p">
          <Typography.Text size="caption2" color="neutralBase-60" weight="bold">
            {t("MutualFund.MutualFundDetailsScreen.sar", {
              value: yValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            })}
          </Typography.Text>
          <Stack direction="horizontal" gap="4p" align="center">
            <RatioIcon />
            {/* TODO: add ratio equation */}
            <Typography.Text size="caption2" color="neutralBase-60">
              {`+${getProfitPercentage()}%`}
            </Typography.Text>
          </Stack>
        </Stack>
        <Stack direction="vertical" gap="4p" style={investmentContainerStyle}>
          <Typography.Text size="caption2" color="neutralBase-60">
            {t("MutualFund.MutualFundDetailsScreen.investment")}
          </Typography.Text>
          <Typography.Text size="caption2" color="neutralBase-60" weight="bold">
            {t("MutualFund.MutualFundDetailsScreen.sar", {
              value: investmentAmount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
            })}
          </Typography.Text>
        </Stack>
        <View style={pointEndSectionStyle} />
      </Stack>
    </View>
  );
}
