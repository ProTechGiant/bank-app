import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import { formatAmount } from "../utils";
import ProgressBar from "./ProgressBar";

interface GoalProgressProps {
  currentValue: number;
  totalGoalValue: number;
  goalPercentageStatus: number;
}

export default function GoalProgressSection({ currentValue, totalGoalValue }: GoalProgressProps) {
  const { t } = useTranslation();

  const amountStyles = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["16p"],
  }));

  const contentStyle = useThemeStyles<ViewStyle>(theme => ({
    flex: 1,
    paddingBottom: theme.spacing["16p"],
  }));

  const progressBarStyle = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["4p"],
  }));

  const progressValue = Math.floor((currentValue / totalGoalValue) * 100);

  return (
    <View style={contentStyle}>
      <Stack direction="horizontal" justify="space-between" style={amountStyles} align="center">
        <Typography.Text size="large" weight="bold">
          {currentValue}
        </Typography.Text>
        <Typography.Text size="callout" weight="regular">
          {t("GoalGetter.goalDetail.of", { amount: formatAmount(totalGoalValue, false) })}{" "}
          {t("GoalGetter.goalDetail.sar")}
        </Typography.Text>
      </Stack>
      <ProgressBar
        goalTimeAchievePercentage={progressValue}
        goalPercentageAmount={progressValue}
        textColor="neutralBase+30"
        secondaryProgressColor="neutralBase-20-30%"
        style={progressBarStyle}
      />
    </View>
  );
}
