import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import Stack from "@/components/Stack";
import Typography from "@/components/Typography";
import { useThemeStyles } from "@/theme";

import ProgressWheel from "../../components/ProgressWheel";

interface GoalDetailsHeaderProps {
  TargetAmount: string;
  TargetDate: string;
  AvailableBalanceAmount: string;
}

const GoalDetailsHeader = ({ AvailableBalanceAmount, TargetAmount, TargetDate }: GoalDetailsHeaderProps) => {
  const { t } = useTranslation();
  const numberFormatter = Intl.NumberFormat("en-US");

  const progressWheelWrapper = useThemeStyles<ViewStyle>(theme => ({
    marginTop: theme.spacing["32p"],
    marginBottom: theme.spacing["16p"],
    backgroundColor: theme.palette.primaryBase,
    justifyContent: "center",
  }));

  const available = parseInt(AvailableBalanceAmount, 10);
  const target = parseInt(TargetAmount, 10);

  const formattedDate = (date: string) => {
    return format(new Date(date), "d MMM, yyyy");
  };

  return (
    <View>
      <View style={progressWheelWrapper}>
        <ProgressWheel
          circleSize={128}
          current={available}
          total={target}
          textColor="neutralBase-50"
          textSize="large"
        />
      </View>
      <View>
        <Stack direction="horizontal" align="center" justify="center">
          <Typography.Text size="large" weight="medium" color="neutralBase-50" align="center">
            {numberFormatter.format(Number(AvailableBalanceAmount))}
          </Typography.Text>
          <Typography.Text color="neutralBase-30" size="callout" weight="regular" style={styles.currencyText}>
            {t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.currency")}
          </Typography.Text>
        </Stack>
        <Typography.Text
          size="callout"
          weight="medium"
          color="neutralBase-50"
          align="center"
          style={styles.targetAmountDetails}>
          {t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.targetAmountDetails", {
            TargetAmount: numberFormatter.format(Number(TargetAmount)),
          })}
        </Typography.Text>
        <Typography.Text
          size="footnote"
          weight="medium"
          color="neutralBase-10"
          align="center"
          style={styles.targetDate}>
          {t("SavingsGoals.GoalDetailsScreen.GoalDetailsHeader.targetDate", {
            TargetDate: formattedDate(TargetDate),
          })}
        </Typography.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  currencyText: {
    marginBottom: 8,
    marginLeft: 4,
  },

  targetAmountDetails: {
    marginTop: 4,
  },
  targetDate: {
    marginTop: 24,
  },
});

export default GoalDetailsHeader;
