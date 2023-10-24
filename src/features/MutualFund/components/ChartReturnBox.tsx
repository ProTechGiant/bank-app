import { useTranslation } from "react-i18next";
import { ViewStyle } from "react-native";

import { Stack, Typography } from "@/components";
import { useThemeStyles } from "@/theme";

interface ChartReturnBoxProps {
  oneYearReturn: string;
  fiveYearReturn: string;
}

export default function ChartReturnBox({ oneYearReturn, fiveYearReturn }: ChartReturnBoxProps) {
  const { t } = useTranslation();

  const containerStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
    marginHorizontal: theme.spacing["16p"],
    padding: theme.spacing["16p"],
    alignSelf: "stretch",
    borderColor: theme.palette["neutralBase-30"],
    borderWidth: 1,
    borderRadius: theme.radii.medium,
  }));

  return (
    <Stack direction="horizontal" align="center" justify="space-between" style={containerStyle}>
      <Stack direction="vertical" flex={1}>
        <Typography.Text size="footnote" color="neutralBase">
          {t("MutualFund.MutualFundDetailsScreen.ReturnsAfterOneyear")}
        </Typography.Text>
        <Typography.Text size="callout" color="neutralBase+30">
          {oneYearReturn}
        </Typography.Text>
      </Stack>
      <Stack direction="vertical" flex={1} align="flex-end">
        <Typography.Text size="footnote" color="neutralBase">
          {t("MutualFund.MutualFundDetailsScreen.ReturnsAfterFiveyear")}
        </Typography.Text>
        <Typography.Text size="callout" color="neutralBase+30">
          {fiveYearReturn}
        </Typography.Text>
      </Stack>
    </Stack>
  );
}
